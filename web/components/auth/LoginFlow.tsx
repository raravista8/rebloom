'use client';
// Login: phone → OTP, wired to /api/auth (FR-001..004). Composed from canon
// primitives (PdField/PdBtn/PdNotice) + canon-classed controlled markup for the
// interactive inputs (canon's PdInput/PdOtp are display-only). Visual parity via
// canon.css; behaviour owned here. Buttons are enabled by default — validation is
// inline on press (INTERACTION_STATES §1).
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PdField, PdBtn, PdNotice } from '@/components/canon';
import { api, ApiError, messageForCode } from '@/lib/api';
import type { User } from '@/lib/types';
import {
  phoneDigits,
  formatPhoneNational,
  phoneE164,
  POLICY_VERSION,
} from '@/lib/format';
import { IconBack, IconCheck, IconLock } from '@/components/icons';

type Step = 'phone' | 'otp';
type OtpStatus = 'typing' | 'verifying' | 'invalid' | 'locked';

function AuthChrome({
  onBack,
  foot,
  children,
}: {
  onBack: () => void;
  foot: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="pd-root pa pa--ios" data-pd-theme="a" style={{ position: 'relative' }}>
      <div className="pa-top">
        <button className="pd-iconbtn" aria-label="Назад" onClick={onBack}>
          <IconBack className="pd-i22" />
        </button>
      </div>
      <div className="pa-body">{children}</div>
      {foot}
    </div>
  );
}

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LoginFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');

  // phone step
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [phoneErr, setPhoneErr] = useState<string | undefined>();
  const [consentErr, setConsentErr] = useState(false);
  const [sending, setSending] = useState(false);

  // otp step
  const [code, setCode] = useState('');
  const [otp, setOtp] = useState<OtpStatus>('typing');
  const [otpErr, setOtpErr] = useState<string | undefined>();
  const [lockLeft, setLockLeft] = useState(0);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const phoneValid = phoneDigits(phone).length === 10;

  // lock countdown
  useEffect(() => {
    if (otp !== 'locked' || lockLeft <= 0) return;
    const t = setInterval(() => setLockLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [otp, lockLeft]);

  const submitPhone = useCallback(async () => {
    setPhoneErr(undefined);
    if (!phoneValid) {
      setPhoneErr('Похоже, в номере не хватает цифр');
      return;
    }
    if (!consent) {
      setConsentErr(true);
      return;
    }
    setSending(true);
    try {
      await api.post('/auth/otp/request', { phone: phoneE164(phone) });
      setStep('otp');
      setCode('');
      setOtp('typing');
      setOtpErr(undefined);
    } catch (e) {
      const code = e instanceof ApiError ? e.code : 'internal';
      setPhoneErr(
        code === 'validation_error' ? 'Проверьте номер телефона.' : messageForCode(code),
      );
    } finally {
      setSending(false);
    }
  }, [phone, phoneValid, consent]);

  const submitOtp = useCallback(async () => {
    setOtp('verifying');
    setOtpErr(undefined);
    try {
      await api.post<{ user: User }>('/auth/otp/verify', { phone: phoneE164(phone), code });
      if (consent) {
        try {
          await api.post('/consent', { policy_version: POLICY_VERSION });
        } catch {
          /* consent is best-effort here; login already succeeded */
        }
      }
      router.replace('/');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'otp_locked') {
        const retry = Number((e.data?.retry_after_sec as number) ?? 3600);
        setLockLeft(Number.isFinite(retry) ? retry : 3600);
        setOtp('locked');
        setOtpErr(undefined);
      } else {
        setOtp('invalid');
        setOtpErr(
          e instanceof ApiError && e.code !== 'validation_error'
            ? e.message
            : 'Неверный код. Проверьте SMS или запросите код заново.',
        );
      }
    }
  }, [phone, code, consent, router]);

  // auto-submit on 6 digits
  useEffect(() => {
    if (step === 'otp' && code.length === 6 && otp !== 'verifying' && otp !== 'locked') {
      void submitOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);

  // focus the OTP capture when entering the step
  useEffect(() => {
    if (step === 'otp') otpInputRef.current?.focus();
  }, [step]);

  if (step === 'phone') {
    const foot = (
      <div className="pd-footerbar pa-foot">
        <PdBtn variant="primary" block lg loading={sending} onClick={submitPhone}>
          Получить код
        </PdBtn>
      </div>
    );
    return (
      <AuthChrome onBack={() => router.back()} foot={foot}>
        <div style={{ textAlign: 'center', margin: '8px 0 24px' }}>
          <h2 className="pa-h2">Вход по телефону</h2>
          <p className="pa-sub">Пришлём код подтверждения по SMS.</p>
        </div>
        <PdField
          label="Номер телефона"
          hint={phoneErr ? undefined : 'Например, +7 999 124-58-03'}
          error={phoneErr}
        >
          <div className={`pd-input${phoneErr ? ' pd-input--invalid' : ''}`}>
            <span className="pre">+7</span>
            <input
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="999 124-58-03"
              value={formatPhoneNational(phone)}
              onChange={(e) => {
                setPhone(phoneDigits(e.target.value));
                if (phoneErr) setPhoneErr(undefined);
              }}
              aria-label="Номер телефона"
            />
          </div>
        </PdField>
        <div style={{ marginTop: 16 }}>
          <label className={`pd-check${consent ? ' on' : ''}`}>
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                if (e.target.checked) setConsentErr(false);
              }}
              style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }}
            />
            <span className="box">{consent && <IconCheck className="pd-i16" />}</span>
            <span className="t">
              Соглашаюсь с <a href="/legal/terms">условиями</a> и{' '}
              <a href="/legal/privacy">политикой ПДн</a> (ФЗ-152).
            </span>
          </label>
          {consentErr && (
            <p style={{ color: 'var(--pd-danger)', fontSize: 13, marginTop: 8 }}>
              Отметьте согласие, чтобы продолжить.
            </p>
          )}
        </div>
      </AuthChrome>
    );
  }

  // ── OTP step ──
  const locked = otp === 'locked';
  const verifying = otp === 'verifying';
  const foot = locked ? (
    <div className="pd-footerbar pa-foot">
      <PdBtn variant="secondary" block lg disabled>
        Повторить через {mmss(lockLeft)}
      </PdBtn>
    </div>
  ) : (
    <div className="pd-footerbar pa-foot">
      <PdBtn variant="primary" block lg loading={verifying} disabled={verifying} onClick={submitOtp}>
        {verifying ? 'Входим…' : 'Войти'}
      </PdBtn>
    </div>
  );

  return (
    <AuthChrome onBack={() => setStep('phone')} foot={foot}>
      <div style={{ textAlign: 'center', margin: '10px 0 24px' }}>
        <h2 className="pa-h2">Введите код</h2>
        <p className="pa-sub">Отправили на +7&nbsp;{formatPhoneNational(phone)}</p>
      </div>

      <div style={{ position: 'relative' }}>
        <div className={`pd-otp${otp === 'invalid' ? ' invalid' : ''}${locked ? ' locked' : ''}`}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`cell${code[i] ? ' filled' : ''}${
                i === code.length && !locked && !verifying ? ' cur' : ''
              }`}
            >
              {code[i] ?? ''}
            </div>
          ))}
        </div>
        <input
          ref={otpInputRef}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          disabled={locked || verifying}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
            if (otp === 'invalid') setOtp('typing');
          }}
          aria-label="Код из SMS"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'text',
          }}
        />
      </div>

      {otp === 'verifying' && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--pd-muted)',
            fontSize: 13,
            marginTop: 20,
          }}
        >
          Проверяем код…
        </p>
      )}
      {otp === 'invalid' && (
        <div style={{ marginTop: 18 }}>
          <PdNotice kind="danger">{otpErr}</PdNotice>
        </div>
      )}
      {locked && (
        <div style={{ marginTop: 18 }}>
          <PdNotice kind="danger" icon={IconLock}>
            <b>Слишком много попыток.</b> Повторная отправка будет доступна через {mmss(lockLeft)}.
          </PdNotice>
        </div>
      )}
      {otp === 'typing' && (
        <p style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="pd-link" onClick={() => setStep('phone')}>
            Изменить номер
          </button>
        </p>
      )}
    </AuthChrome>
  );
}
