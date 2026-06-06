'use client';
// Login — OAuth-first per AUTH_HANDOFF (canon 0.3.0). The chooser uses the canon
// components directly (mobile AuthChooser + ID buttons · desktop AuthDesktopChooser
// split), behaviour wired via [data-provider] click delegation + slots-less degrade.
// Phone/OTP keep controlled inputs (canon's are display-only) in the canon auth shell
// (.pa mobile · .pad split desktop) — NOT the marketplace WebShell (the prod bug).
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthChooser, AuthDesktopChooser } from '@rebloom/canon/auth';
import { PdField, PdBtn, PdNotice } from '@/components/canon';
import useIsDesktop from '@/lib/useIsDesktop';
import { api, ApiError, messageForCode } from '@/lib/api';
import type { User } from '@/lib/types';
import { phoneDigits, formatPhoneNational, phoneE164, POLICY_VERSION } from '@/lib/format';
import { IconBack, IconCheck, IconLock, IconShield } from '@/components/icons';

type Step = 'chooser' | 'phone' | 'otp';
type OtpStatus = 'typing' | 'verifying' | 'invalid' | 'locked';

// canon `data-provider` key → API `{provider}` (AUTH_HANDOFF §4.2)
const API_PROV: Record<string, string> = { ya: 'yandex', sber: 'sber', vk: 'vk', tid: 'tid' };
const PROV_NAME: Record<string, string> = { ya: 'Яндекс ID', sber: 'Sber ID', vk: 'VK ID', tid: 'T-ID', apple: 'Apple' };

const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden style={{ display: 'block', flex: 'none' }}>
    {[0, 72, 144, 216, 288].map((a) => <path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`} />)}
    <circle cx="50" cy="50" r="8" fill="#E8A93B" />
  </svg>
);

// Canon auth shell — mobile `.pa`, desktop `.pad` split (brand aside + card). The
// aside carries its own terracotta gradient; we drop canon's broken hero <img>.
function AuthShell({ onBack, foot, children }: { onBack: () => void; foot?: React.ReactNode; children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  if (isDesktop) {
    return (
      <div className="pd-root pad pa pa--desktop" data-pd-theme="a">
        <aside className="pad-aside">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="pad-photo" src="/hero-lacybird.png" alt="" />
          <div className="pad-brand"><Mark size={26} />Передарим</div>
          <div className="pad-hl">Свежие букеты со скидкой и вторая жизнь подаренным цветам</div>
          <p className="pad-hlsub">Тысячи букетов в вашем городе. Оплата при встрече, отзывы взаимные</p>
          <div className="pad-points">
            <div className="pad-pt"><span className="ic"><IconCheck className="pd-i16" /></span>Публикация букета за 2 минуты</div>
            <div className="pad-pt"><span className="ic"><IconShield className="pd-i16" /></span>Оплата при встрече, без предоплаты</div>
            <div className="pad-pt"><span className="ic"><IconCheck className="pd-i16" /></span>Рейтинги и реальные отзывы</div>
          </div>
        </aside>
        <div className="pad-main">
          <div className="pad-card">
            <button className="pd-link" onClick={onBack} style={{ marginBottom: 10 }}>← Другие способы входа</button>
            {children}
            {foot && <div style={{ marginTop: 18 }}>{foot}</div>}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pd-root pa pa--web" data-pd-theme="a" style={{ position: 'relative' }}>
      <div className="pa-top">
        <button className="pd-iconbtn" aria-label="Назад" onClick={onBack}><IconBack className="pd-i22" /></button>
      </div>
      <div className="pa-body">{children}</div>
      {foot && <div className="pd-footerbar pa-foot">{foot}</div>}
    </div>
  );
}

function mmss(total: number): string {
  const m = Math.floor(total / 60);
  return `${m}:${String(total % 60).padStart(2, '0')}`;
}

export default function LoginFlow() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [step, setStep] = useState<Step>('chooser');
  const [oauthMsg, setOauthMsg] = useState<string | undefined>();

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

  useEffect(() => {
    if (otp !== 'locked' || lockLeft <= 0) return;
    const t = setInterval(() => setLockLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [otp, lockLeft]);

  // OAuth: backend-mediated (Auth-Code+PKCE). Degrades gracefully until the provider
  // endpoint + credentials exist (AUTH_HANDOFF §4.1).
  const startOAuth = useCallback(async (k: string) => {
    setOauthMsg(undefined);
    try {
      const res = await api.post<{ authorize_url?: string }>(`/auth/oauth/${API_PROV[k]}/start`, {
        redirect_uri: `${window.location.origin}/login`,
      });
      if (res?.authorize_url) {
        window.location.href = res.authorize_url;
        return;
      }
      throw new Error('no_url');
    } catch {
      setOauthMsg(`Вход через ${PROV_NAME[k] ?? k} скоро будет доступен — пока войдите по телефону.`);
    }
  }, []);

  const onChooserClick = useCallback(
    (e: React.MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('[data-provider]') as HTMLElement | null;
      const k = btn?.dataset.provider;
      if (!k) return;
      e.preventDefault();
      if (k === 'phone') {
        setOauthMsg(undefined);
        setStep('phone');
      } else if (k in API_PROV) {
        void startOAuth(k);
      }
    },
    [startOAuth],
  );

  const submitPhone = useCallback(async () => {
    setPhoneErr(undefined);
    if (!phoneValid) return setPhoneErr('Похоже, в номере не хватает цифр');
    if (!consent) return setConsentErr(true);
    setSending(true);
    try {
      await api.post('/auth/otp/request', { phone: phoneE164(phone) });
      setStep('otp');
      setCode('');
      setOtp('typing');
      setOtpErr(undefined);
    } catch (e) {
      const c = e instanceof ApiError ? e.code : 'internal';
      setPhoneErr(c === 'validation_error' ? 'Проверьте номер телефона.' : messageForCode(c));
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
          /* best-effort; login already succeeded */
        }
      }
      router.replace('/');
    } catch (e) {
      if (e instanceof ApiError && e.code === 'otp_locked') {
        const retry = Number((e.data?.retry_after_sec as number) ?? 3600);
        setLockLeft(Number.isFinite(retry) ? retry : 3600);
        setOtp('locked');
      } else {
        setOtp('invalid');
        setOtpErr(e instanceof ApiError && e.code !== 'validation_error' ? e.message : 'Неверный код. Проверьте SMS или запросите код заново.');
      }
    }
  }, [phone, code, consent, router]);

  useEffect(() => {
    if (step === 'otp' && code.length === 6 && otp !== 'verifying' && otp !== 'locked') void submitOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, step]);
  useEffect(() => {
    if (step === 'otp') otpInputRef.current?.focus();
  }, [step]);

  // ── CHOOSER (canon components, OAuth-first) ──
  if (step === 'chooser') {
    return (
      <div onClickCapture={onChooserClick} style={{ display: 'contents' }}>
        {isDesktop ? <AuthDesktopChooser slots={{}} /> : <AuthChooser plat="web" slots={{}} />}
        {oauthMsg && (
          <div style={{ position: 'fixed', left: 16, right: 16, bottom: 'max(16px, env(safe-area-inset-bottom))', zIndex: 60, maxWidth: 440, margin: '0 auto' }}>
            <PdNotice kind="info">{oauthMsg}</PdNotice>
          </div>
        )}
      </div>
    );
  }

  // ── PHONE ──
  if (step === 'phone') {
    const foot = (
      <PdBtn variant="primary" block lg loading={sending} onClick={submitPhone}>Получить код</PdBtn>
    );
    return (
      <AuthShell onBack={() => setStep('chooser')} foot={foot}>
        <div style={{ textAlign: 'center', margin: '8px 0 24px' }}>
          <h2 className="pa-h2">Вход по телефону</h2>
          <p className="pa-sub">Пришлём код подтверждения по SMS</p>
        </div>
        <PdField label="Номер телефона" hint={phoneErr ? undefined : 'Например, +7 999 124-58-03'} error={phoneErr}>
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
            <span className="t">Соглашаюсь с <Link href="/legal/terms">условиями</Link> и <Link href="/legal/privacy">политикой ПДн</Link> (ФЗ-152).</span>
          </label>
          {consentErr && <p style={{ color: 'var(--pd-danger)', fontSize: 13, marginTop: 8 }}>Отметьте согласие, чтобы продолжить.</p>}
        </div>
      </AuthShell>
    );
  }

  // ── OTP ──
  const locked = otp === 'locked';
  const verifying = otp === 'verifying';
  const foot = locked ? (
    <PdBtn variant="secondary" block lg disabled>Повторить через {mmss(lockLeft)}</PdBtn>
  ) : (
    <PdBtn variant="primary" block lg loading={verifying} disabled={verifying} onClick={submitOtp}>{verifying ? 'Входим…' : 'Войти'}</PdBtn>
  );
  return (
    <AuthShell onBack={() => setStep('phone')} foot={foot}>
      <div style={{ textAlign: 'center', margin: '10px 0 24px' }}>
        <h2 className="pa-h2">Введите код</h2>
        <p className="pa-sub">Отправили на +7&nbsp;{formatPhoneNational(phone)}</p>
      </div>
      <div style={{ position: 'relative' }}>
        <div className={`pd-otp${otp === 'invalid' ? ' invalid' : ''}${locked ? ' locked' : ''}`}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`cell${code[i] ? ' filled' : ''}${i === code.length && !locked && !verifying ? ' cur' : ''}`}>{code[i] ?? ''}</div>
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
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'text' }}
        />
      </div>
      {verifying && <p style={{ textAlign: 'center', color: 'var(--pd-muted)', fontSize: 13, marginTop: 20 }}>Проверяем код…</p>}
      {otp === 'invalid' && <div style={{ marginTop: 18 }}><PdNotice kind="danger">{otpErr}</PdNotice></div>}
      {locked && <div style={{ marginTop: 18 }}><PdNotice kind="danger" icon={IconLock}><b>Слишком много попыток.</b> Повторная отправка будет доступна через {mmss(lockLeft)}.</PdNotice></div>}
      {otp === 'typing' && <p style={{ textAlign: 'center', marginTop: 20 }}><button className="pd-link" onClick={() => setStep('phone')}>Изменить номер</button></p>}
    </AuthShell>
  );
}
