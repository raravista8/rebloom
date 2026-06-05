// @rebloom/canon · auth/auth.jsx
// Converted from design source pd-auth.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdIc } from "../feed/feed";
import { PdBtn, PdField, PdI, PdInput, PdNotice, PdOtp } from "../primitives/kit";

// pd-auth.jsx — «Передарим» · Регистрация и вход
// OAuth (Яндекс ID / Sber ID / VK ID / T-ID + Apple on iOS) + phone/OTP fallback.
// Adaptive: one core content set, platform-native affordances via `plat` prop:
//   'ios' | 'android' | 'web' | 'desktop'.
// NOTE: provider marks are PLACEHOLDERS (brand-colour swatch + first letter).
// In прод — официальные кнопки/бейджи по брендбукам и SDK провайдеров.


// ── extra icons ──────────────────────────────────────────────────────────
const A = {
  chevR:(p)=><svg viewBox="0 0 24 24" {...p}><path d="m9 5 7 7-7 7"/></svg>,
  phone:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2Z"/></svg>,
  apple:(p)=><svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}><path d="M16 13c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8C6.7 7.7 5.3 8.5 4.5 9.9c-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.3 1.2-2.5 1.3-2.6-.1 0-2.5-1-2.5-3.7ZM13.8 6.1c.6-.8 1.1-1.9.9-3-1 0-2.1.7-2.8 1.5-.6.7-1.1 1.8-.9 2.9 1.1 0 2.2-.6 2.8-1.4Z"/></svg>,
  mail:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>,
  gift:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 13h18M12 9v11M8.5 9C6 9 6 5 8.5 5S12 9 12 9s-.5-4 2-4 2.5 4 0 4"/></svg>,
  globe:(p)=><svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/></svg>,
  lockGlobe:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="5" y="11" width="14" height="9" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>,
  spark:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>,
  heart:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M12 20.3C12 20.3 3.4 14.9 3.4 8.7 3.4 6 5.5 4 8 4 9.8 4 11.3 5 12 6.3 12.7 5 14.2 4 16 4 18.5 4 20.6 6 20.6 8.7 20.6 14.9 12 20.3 12 20.3Z"/></svg>,
  star:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/></svg>,
  wifi:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>,
};
const ic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});

// ── brand mark «Соцветие» (лепестки = currentColor, центр янтарный) ──────────
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=26, center='#E8A93B', style, title='Передарим' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title}
    style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// ── providers ─────────────────────────────────────────────────────────────
const PROV = {
  ya:    { mk:'pa-mk-ya',   ch:'Я',  lbl:'Войти с Яндекс ID' },
  sber:  { mk:'pa-mk-sber', ch:'С',  lbl:'Войти со Сбер ID' },
  vk:    { mk:'pa-mk-vk',   ch:'VK', lbl:'Войти через VK ID' },
  tid:   { mk:'pa-mk-tid',  ch:'Т',  lbl:'Войти с T-ID' },
  apple: { mk:'pa-mk-apple', icon:A.apple, lbl:'Войти с Apple' },
  gos:   { mk:'pa-mk-gos',  ch:'ГУ', lbl:'Войти через Госуслуги' },
  phone: { mk:'pa-mk-phone', icon:A.phone, lbl:'Войти по номеру телефона', tint:true },
};
// Display-only authorize host shown in the consent header / desktop popup chrome.
// In прод the real authorize domain comes from the backend `/start` response.
const PROV_HOST = {
  ya:'oauth.yandex.ru', sber:'id.sber.ru', vk:'id.vk.com',
  tid:'id.tinkoff.ru', apple:'appleid.apple.com', gos:'esia.gosuslugi.ru',
};
// `slot` — official provider SDK widget injected by web/ (VK ID One Tap,
// Яндекс/Sber/T-ID branded buttons, native Apple). Absent → render the design
// placeholder (brand swatch + letter). web/ must NOT fork this component: pass
// `slots={{ya:<…/>, vk:<…/>}}` down through the Auth* screens instead (§AUTH_HANDOFF).
function OAuthBtn({ k, primary, slot }) {
  const p = PROV[k];
  if (slot) return (
    <div className={`pa-oauthbtn pa-oauthbtn--slot${primary?' pa-oauthbtn--primary':''}`} data-provider={k}>{slot}</div>
  );
  return (
    <button className={`pa-oauthbtn${primary?' pa-oauthbtn--primary':''}`} data-provider={k}>
      <span className={`mark ${p.mk}`}>{p.icon ? p.icon({className:'pd-i18',style:{color:'inherit'}}) : p.ch}</span>
      <span className="lbl">{p.lbl}</span>
      <span className="chev">{ic(A.chevR,'pd-i16')}</span>
    </button>
  );
}
// provider stack — iOS adds Apple on top. `slots` (optional) = official SDK
// widgets keyed by provider, injected by web/ without forking the component.
function OauthList({ plat, slots }) {
  const list = plat==='ios'
    ? [['apple',true],['ya',false],['sber',false],['vk',false],['tid',false]]
    : [['ya',true],['sber',false],['vk',false],['tid',false]];
  return (
    <div className="pa-oauth">
      {list.map(([k,pr])=> <OAuthBtn key={k} k={k} primary={pr} slot={slots&&slots[k]}/>)}
    </div>
  );
}
const Consent = () => (
  <p className="pa-consent">Продолжая, вы соглашаетесь с <a>условиями</a> и <a>политикой обработки персональных данных</a> (ФЗ-152).</p>
);
const TrustStrip = () => (
  <div className="pa-trust">{ic(A.lockGlobe,'pd-i14')} Защищённое соединение · данные шифруются</div>
);

// ── shells ────────────────────────────────────────────────────────────────
function AuthShell({ plat='ios', back=true, children, foot, overlay }) {
  return (
    <div className={`pd-root pa pa--${plat}`} data-pd-theme="a" style={{position:'relative'}}>
      <div className="pa-top" style={{paddingTop: plat==='android'?6:0}}>
        {back && <button className="pd-iconbtn">{ic(PdI.back,'pd-i22')}</button>}
      </div>
      <div className="pa-body">{children}</div>
      {foot}
      {overlay}
    </div>
  );
}
const Hero = ({ title, sub, logo=true }) => (
  <div className="pa-hero">
    {logo && <div className="pa-logo"><Mark size={30}/></div>}
    {title ? <h1 className="pa-h2">{title}</h1> : <div className="pa-brand">Передарим</div>}
    {sub && <p className="pa-tag">{sub}</p>}
  </div>
);

// ════════════════════════════════════════════════════════════════════════
// 1 · CHOOSER (вход или регистрация)
// ════════════════════════════════════════════════════════════════════════
function AuthChooser({ plat='ios', slots }) {
  return (
    <AuthShell plat={plat} back={false}>
      <Hero sub={<>Свежие букеты со скидкой<br/>и вторая жизнь для подаренных цветов.</>}/>
      <OauthList plat={plat} slots={slots}/>
      <div className="pa-or">быстрее всего через сервис</div>
      <div className="pa-oauth"><OAuthBtn k="phone"/></div>
      <Consent/>
      <TrustStrip/>
    </AuthShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 · OAUTH HANDOFF (consent) — iOS sheet / Android dialog / web popup
// ════════════════════════════════════════════════════════════════════════
function ProvHead({ k }) {
  const p = PROV[k];
  return (
    <div className="pa-provhead">
      <span className={`mark ${p.mk}`}>{p.icon ? p.icon({className:'pd-i20'}) : p.ch}</span>
      <div><div className="ttl">{p.lbl.replace('Войти с ','').replace('Войти через ','').replace('Войти со ','')}</div>
        <div className="url">{ic(PdI.lock,'pd-i12')} {PROV_HOST[k]||`id.${k}.ru`}</div></div>
    </div>
  );
}
function ConsentBody({ k }) {
  return (
    <>
      <ProvHead k={k}/>
      <div className="pa-account">
        <div className="av"><img src="img/av/w4.jpg" alt=""/></div>
        <div><div className="nm">Екатерина Л.</div><div className="ph">+7 999 •••-58-03</div></div>
        <button className="pd-link" style={{marginLeft:'auto'}}>Сменить</button>
      </div>
      <div style={{fontSize:13,color:'var(--pd-muted)',marginBottom:8}}>«Передарим» запросит:</div>
      <div className="pa-scopes">
        <div className="pa-scope">{ic(PdI.check,'pd-i16')}<span>Имя и фото профиля<span className="muted">чтобы покупатели вас узнавали</span></span></div>
        <div className="pa-scope">{ic(PdI.check,'pd-i16')}<span>Номер телефона<span className="muted">для входа и связи по сделке</span></span></div>
        <div className="pa-scope">{ic(PdI.check,'pd-i16')}<span>Email<span className="muted">для чеков и уведомлений</span></span></div>
      </div>
      <PdBtn variant="primary" block lg>Разрешить и войти</PdBtn>
      <button className="pd-link" style={{display:'block',margin:'12px auto 0'}}>Отмена</button>
    </>
  );
}
function AuthOAuthSheet({ plat='ios', prov='ya', slots }) {
  const overlay = (
    <div className="pa-scrim">
      <div className="pa-sheet">
        <div className="grab"/>
        <ConsentBody k={prov}/>
      </div>
    </div>
  );
  return (
    <div className={`pd-root pa pa--${plat}`} data-pd-theme="a" style={{position:'relative'}}>
      <div className="pa-top"/>
      <div className="pa-body" style={{filter:'blur(1.5px)',opacity:.5,pointerEvents:'none'}}>
        <Hero sub="Свежие букеты со скидкой."/>
        <OauthList plat={plat} slots={slots}/>
      </div>
      {overlay}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 · PHONE ENTRY
// ════════════════════════════════════════════════════════════════════════
function PhoneBody({ state='rest', plat }) {
  const invalid = state==='invalid';
  return (
    <>
      <div style={{textAlign:'center',margin:'8px 0 24px'}}>
        <h2 className="pa-h2">Вход по телефону</h2>
        <p className="pa-sub">Пришлём код подтверждения по SMS.</p>
      </div>
      <PdField label="Номер телефона"
        hint={invalid?undefined:'Например, +7 999 124-58-03'}
        error={invalid?'Похоже, в номере не хватает цифр':undefined}>
        <PdInput prefix="+7" value={invalid?'999 124-58':'999 124-58-03'} state={invalid?'invalid':'focus'} />
      </PdField>
      <div style={{marginTop:16}}>
        <label className="pd-check on"><span className="box">{ic(PdI.check,'pd-i16')}</span>
          <span className="t">Соглашаюсь с <a>условиями</a> и <a>политикой ПДн</a> (ФЗ-152).</span></label>
      </div>
    </>
  );
}
function AuthPhone({ plat='ios', state='rest' }) {
  const foot = <div className={`pd-footerbar pa-foot${plat==='android'?'':''}`}><PdBtn variant="primary" block lg>Получить код</PdBtn></div>;
  return <AuthShell plat={plat} foot={foot}><PhoneBody state={state} plat={plat}/></AuthShell>;
}

// ════════════════════════════════════════════════════════════════════════
// 4 · OTP — typing / verifying / invalid / locked
// ════════════════════════════════════════════════════════════════════════
function OtpBody({ state='typing' }) {
  const map = {
    typing:   { value:'4127', cur:4, st:undefined },
    verifying:{ value:'412739', st:undefined },
    invalid:  { value:'412700', st:'invalid' },
    locked:   { value:'0000',  st:'locked' },
  };
  const c = map[state];
  return (
    <>
      <div style={{textAlign:'center',margin:'10px 0 24px'}}>
        <h2 className="pa-h2">Введите код</h2>
        <p className="pa-sub">Отправили на +7 999 124-58-03</p>
      </div>
      <PdOtp value={c.value} cur={c.cur} state={c.st}/>
      {state==='verifying' && <p style={{textAlign:'center',color:'var(--pd-muted)',fontSize:13,marginTop:20,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
        {null}<span className="pd-spin" style={{width:16,height:16,border:'2px solid var(--pd-border)',borderTopColor:'var(--pd-primary)',borderRadius:'50%',display:'inline-block'}}/>Проверяем код…</p>}
      {state==='invalid' && <div style={{marginTop:18}}><PdNotice kind="danger">Неверный код. Осталось попыток: 2. Проверьте SMS или запросите код заново.</PdNotice></div>}
      {state==='locked' && <div style={{marginTop:18}}><PdNotice kind="danger" icon={PdI.lock}><b>Слишком много попыток.</b> Повторная отправка будет доступна через 58:00.</PdNotice></div>}
      {(state==='typing') && <>
        <p style={{textAlign:'center',color:'var(--pd-muted)',fontSize:13,marginTop:20}}>Отправить код снова через 0:42</p>
        <p style={{textAlign:'center',marginTop:8}}><button className="pd-link">Изменить номер</button></p>
      </>}
    </>
  );
}
function AuthOtp({ plat='ios', state='typing' }) {
  let foot;
  if (state==='locked') foot = <div className="pd-footerbar pa-foot"><PdBtn variant="secondary" block lg disabled>Повторить через 58:00</PdBtn></div>;
  else if (state==='verifying') foot = <div className="pd-footerbar pa-foot"><PdBtn variant="primary" block lg loading disabled>Входим…</PdBtn></div>;
  else foot = <div className="pd-footerbar pa-foot"><PdBtn variant="primary" block lg>Войти</PdBtn></div>;
  return <AuthShell plat={plat} foot={foot}><OtpBody state={state}/></AuthShell>;
}

// ════════════════════════════════════════════════════════════════════════
// 5 · REGISTER / профиль нового пользователя
// ════════════════════════════════════════════════════════════════════════
function RegisterBody({ state='rest', plat }) {
  const invalid = state==='invalid';
  return (
    <>
      <div className="pa-steps"><i/><i className="on"/><i/></div>
      <div style={{textAlign:'center',margin:'6px 0 18px'}}>
        <h2 className="pa-h2">Давайте познакомимся</h2>
        <p className="pa-sub">Так вас увидят покупатели. Это займёт минуту.</p>
      </div>
      <div className="pa-avadd">
        <div className="ring">{ic(PdI.camera,'pd-i24')}<span className="cam">{ic(PdI.camera,'pd-i14')}</span></div>
        <span className="lab">Добавить фото · по желанию</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        <PdField label="Как вас зовут" error={invalid?'Укажите имя, его увидят покупатели':undefined}>
          <PdInput value={invalid?'':'Екатерина'} placeholder="Имя" state={invalid?'invalid':'focus'} />
        </PdField>
        <PdField label="Город" hint="Покажем букеты и покупателей рядом">
          <div className="pa-citysel"><span>Москва</span><span className="chev">{ic(PdIc.chev,'pd-i18')}</span></div>
        </PdField>
      </div>
      <p style={{fontSize:12,color:'var(--pd-faint)',marginTop:14,lineHeight:1.5}}>Имя можно изменить позже в настройках профиля.</p>
    </>
  );
}
function AuthRegister({ plat='ios', state='rest' }) {
  const foot = state==='submitting'
    ? <div className="pd-footerbar pa-foot"><PdBtn variant="primary" block lg loading disabled>Сохраняем…</PdBtn></div>
    : <div className="pd-footerbar pa-foot"><PdBtn variant="primary" block lg>Сохранить и продолжить</PdBtn></div>;
  return <AuthShell plat={plat} foot={foot}><RegisterBody state={state} plat={plat}/></AuthShell>;
}

// ════════════════════════════════════════════════════════════════════════
// 6 · LINK ACCOUNTS (этот телефон уже привязан к провайдеру)
// ════════════════════════════════════════════════════════════════════════
function AuthLink({ plat='ios' }) {
  const foot = <div className="pd-footerbar pa-foot" style={{display:'flex',flexDirection:'column',gap:9}}>
    <PdBtn variant="primary" block lg>Войти через Яндекс ID</PdBtn>
    <PdBtn variant="ghost" block>Продолжить по SMS-коду</PdBtn>
  </div>;
  return (
    <AuthShell plat={plat} foot={foot}>
      <div style={{textAlign:'center',margin:'18px 0 22px'}}>
        <div className="pa-logo" style={{background:'var(--pd-warn-soft)',color:'var(--pd-warn)'}}>{ic(PdI.shield,'pd-i28')}</div>
        <h2 className="pa-h2">Этот номер уже знаком</h2>
        <p className="pa-sub">Аккаунт с номером +7 999 •••-58-03 уже привязан к <b>Яндекс ID</b>. Войдите привычным способом, все объявления и сделки на месте.</p>
      </div>
      <div className="pa-account" style={{margin:'0 0 4px'}}>
        <div className="av"><img src="img/av/w4.jpg" alt=""/></div>
        <div><div className="nm">Екатерина Л.</div><div className="ph">Яндекс ID · последний вход 2 дня назад</div></div>
      </div>
    </AuthShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 7 · WELCOME (готово)
// ════════════════════════════════════════════════════════════════════════
function WelcomeBody() {
  return (
    <div className="pa-welcome">
      <div className="burst">{ic(A.heart,'pd-i28')}</div>
      <h2>С возвращением, Катя!</h2>
      <p>Готово. Свежие букеты Москвы уже ждут. Или подарите вторую жизнь своему.</p>
      <div style={{display:'flex',flexDirection:'column',gap:10,width:'100%',maxWidth:300,marginTop:6}}>
        <PdBtn variant="primary" block lg icon={PdIc.search}>Смотреть букеты</PdBtn>
        <PdBtn variant="secondary" block lg icon={PdIc.plus}>Продать букет</PdBtn>
      </div>
    </div>
  );
}
function AuthWelcome({ plat='ios' }) {
  return <AuthShell plat={plat} back={false}><WelcomeBody/></AuthShell>;
}

// ════════════════════════════════════════════════════════════════════════
// 8 · ERROR / OFFLINE
// ════════════════════════════════════════════════════════════════════════
function AuthError({ plat='ios', offline=false }) {
  const foot = <div className="pd-footerbar pa-foot" style={{display:'flex',flexDirection:'column',gap:9}}>
    <PdBtn variant="primary" block lg icon={PdI.refresh}>Повторить вход</PdBtn>
    <PdBtn variant="ghost" block>Войти другим способом</PdBtn>
  </div>;
  return (
    <AuthShell plat={plat} foot={foot}>
      <div className="pd-empty" style={{height:'auto',paddingTop:60}}>
        <div className="glyph" style={{color:offline?'var(--pd-muted)':'var(--pd-danger)'}}>{ic(offline?A.wifi:PdI.alert,'pd-i28')}</div>
        <h3>{offline?'Нет соединения':'Не удалось войти'}</h3>
        <p>{offline
          ? 'Проверьте интернет. Как только связь вернётся, мы продолжим вход. Аккаунт и данные в безопасности.'
          : 'Сервис входа не ответил. Это бывает редко, попробуйте снова или войдите иначе.'}</p>
      </div>
    </AuthShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 9 · BLOCKED / restricted account (FLOW-8)
// ════════════════════════════════════════════════════════════════════════
function AuthBlocked({ plat='ios' }) {
  const foot = <div className="pd-footerbar pa-foot" style={{display:'flex',flexDirection:'column',gap:9}}>
    <PdBtn variant="primary" block lg icon={PdI.flag}>Обжаловать</PdBtn>
    <PdBtn variant="ghost" block>Выйти</PdBtn>
  </div>;
  return (
    <AuthShell plat={plat} back={false} foot={foot}>
      <div className="pd-empty pa-blocked" style={{height:'auto',paddingTop:56}}>
        <div className="glyph">{ic(PdI.lock,'pd-i28')}</div>
        <h3>Доступ ограничен</h3>
        <p>Аккаунт временно заблокирован после проверки безопасности. Активные сделки и данные защищены. Если это ошибка, отправьте обращение, и мы разберёмся в течение 24 часов.</p>
      </div>
      <div style={{padding:'0 6px'}}><PdNotice kind="info">Причину сообщим в ответе на обращение. В целях безопасности не раскрываем детали проверки здесь.</PdNotice></div>
    </AuthShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// DESKTOP — split-card layout (brand aside + auth card)
// ════════════════════════════════════════════════════════════════════════
function DeskShell({ children, popup }) {
  return (
    <div className="pd-root pad pa pa--desktop" data-pd-theme="a">
      <aside className="pad-aside">
        <img className="pad-photo" src="img/1561181286-d3fee7d55364.jpg" alt=""/>
        <div className="pad-brand"><Mark size={26}/>Передарим</div>
        <div className="pad-hl">Свежие букеты со скидкой и вторая жизнь подаренным цветам.</div>
        <p className="pad-hlsub">Тысячи букетов в вашем городе. Оплата при встрече, отзывы взаимные.</p>
        <div className="pad-points">
          <div className="pad-pt"><span className="ic">{ic(A.spark,'pd-i16')}</span>Публикация букета за 2 минуты</div>
          <div className="pad-pt"><span className="ic">{ic(PdI.shield,'pd-i16')}</span>Оплата при встрече, без предоплаты</div>
          <div className="pad-pt"><span className="ic">{ic(A.star,'pd-i16')}</span>Рейтинги и реальные отзывы</div>
        </div>
      </aside>
      <div className="pad-main">
        <div className="pad-topnav">Уже с нами? <button>Войти</button></div>
        <div className="pad-card">{children}</div>
        {popup}
      </div>
    </div>
  );
}
function AuthDesktopChooser({ slots }) {
  return (
    <DeskShell>
      <div className="pa-hero" style={{paddingTop:0}}>
        <h1 className="pa-h2" style={{fontSize:26}}>Вход или регистрация</h1>
        <p className="pa-tag">Выберите удобный способ, за пару секунд.</p>
      </div>
      <OauthList plat="desktop" slots={slots}/>
      <div className="pa-or">или</div>
      <div className="pa-oauth"><OAuthBtn k="phone"/></div>
      <Consent/>
    </DeskShell>
  );
}
function AuthDesktopOAuth({ prov='ya', slots }) {
  const popup = (
    <div className="pad-popup">
      <div className="pad-popwin">
        <div className="pad-popbar"><span className="dot"/><span className="dot"/><span className="dot"/><span style={{marginLeft:8}}>{ic(PdI.lock,'pd-i12')} {PROV_HOST[prov]||'oauth.yandex.ru'}</span></div>
        <div style={{padding:22}}><ConsentBody k={prov}/></div>
      </div>
    </div>
  );
  return (
    <DeskShell popup={popup}>
      <div className="pa-hero" style={{paddingTop:0}}><h1 className="pa-h2" style={{fontSize:26}}>Вход или регистрация</h1><p className="pa-tag">Подтвердите вход в открывшемся окне.</p></div>
      <OauthList plat="desktop" slots={slots}/>
    </DeskShell>
  );
}
function AuthDesktopPhone({ state='rest' }) {
  return (
    <DeskShell>
      <div style={{marginBottom:16,marginTop:8}}><PhoneBody state={state}/></div>
      <PdBtn variant="primary" block lg>Получить код</PdBtn>
      <button className="pd-link" style={{display:'block',margin:'14px auto 0'}}>← Другие способы входа</button>
    </DeskShell>
  );
}
function AuthDesktopOtp({ state='typing' }) {
  return (
    <DeskShell>
      <div style={{marginBottom:20}}><OtpBody state={state}/></div>
      {state!=='locked' && <PdBtn variant="primary" block lg loading={state==='verifying'} disabled={state==='verifying'}>{state==='verifying'?'Входим…':'Войти'}</PdBtn>}
      {state==='locked' && <PdBtn variant="secondary" block lg disabled>Повторить через 58:00</PdBtn>}
    </DeskShell>
  );
}
function AuthDesktopRegister({ state='rest' }) {
  return (
    <DeskShell>
      <div style={{marginBottom:18}}><RegisterBody state={state}/></div>
      <PdBtn variant="primary" block lg loading={state==='submitting'} disabled={state==='submitting'}>{state==='submitting'?'Сохраняем…':'Сохранить и продолжить'}</PdBtn>
    </DeskShell>
  );
}
function AuthDesktopWelcome() {
  return <DeskShell><WelcomeBody/></DeskShell>;
}

// ── desktop variants of link / error / blocked (split layout, not plat="web") ──
function AuthDesktopLink() {
  return (
    <DeskShell>
      <div style={{textAlign:'center',margin:'4px 0 20px'}}>
        <div className="pa-logo" style={{background:'var(--pd-warn-soft)',color:'var(--pd-warn)'}}>{ic(PdI.shield,'pd-i28')}</div>
        <h2 className="pa-h2">Этот номер уже знаком</h2>
        <p className="pa-sub">Аккаунт с номером +7 999 •••-58-03 уже привязан к <b>Яндекс ID</b>. Войдите привычным способом, все объявления и сделки на месте.</p>
      </div>
      <div className="pa-account" style={{margin:'0 0 16px'}}>
        <div className="av"><img src="img/av/w4.jpg" alt=""/></div>
        <div><div className="nm">Екатерина Л.</div><div className="ph">Яндекс ID · последний вход 2 дня назад</div></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:9}}>
        <PdBtn variant="primary" block lg>Войти через Яндекс ID</PdBtn>
        <PdBtn variant="ghost" block>Продолжить по SMS-коду</PdBtn>
      </div>
    </DeskShell>
  );
}
function AuthDesktopError({ offline=false }) {
  return (
    <DeskShell>
      <div className="pd-empty" style={{height:'auto',paddingTop:24}}>
        <div className="glyph" style={{color:offline?'var(--pd-muted)':'var(--pd-danger)'}}>{ic(offline?A.wifi:PdI.alert,'pd-i28')}</div>
        <h3>{offline?'Нет соединения':'Не удалось войти'}</h3>
        <p>{offline
          ? 'Проверьте интернет. Как только связь вернётся, мы продолжим вход. Аккаунт и данные в безопасности.'
          : 'Сервис входа не ответил. Это бывает редко, попробуйте снова или войдите иначе.'}</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:9,marginTop:14}}>
        <PdBtn variant="primary" block lg icon={PdI.refresh}>Повторить вход</PdBtn>
        <PdBtn variant="ghost" block>Войти другим способом</PdBtn>
      </div>
    </DeskShell>
  );
}
function AuthDesktopBlocked() {
  return (
    <DeskShell>
      <div className="pd-empty pa-blocked" style={{height:'auto',paddingTop:20}}>
        <div className="glyph">{ic(PdI.lock,'pd-i28')}</div>
        <h3>Доступ ограничен</h3>
        <p>Аккаунт временно заблокирован после проверки безопасности. Активные сделки и данные защищены. Если это ошибка, отправьте обращение, и мы разберёмся в течение 24 часов.</p>
      </div>
      <div style={{margin:'4px 0 16px'}}><PdNotice kind="info">Причину сообщим в ответе на обращение. В целях безопасности не раскрываем детали проверки здесь.</PdNotice></div>
      <div style={{display:'flex',flexDirection:'column',gap:9}}>
        <PdBtn variant="primary" block lg icon={PdI.flag}>Обжаловать</PdBtn>
        <PdBtn variant="ghost" block>Выйти</PdBtn>
      </div>
    </DeskShell>
  );
}

export {
  OAuthBtn,
  OauthList,
  AuthChooser,
  AuthOAuthSheet,
  AuthPhone,
  AuthOtp,
  AuthRegister,
  AuthLink,
  AuthWelcome,
  AuthError,
  AuthBlocked,
  AuthDesktopChooser,
  AuthDesktopOAuth,
  AuthDesktopPhone,
  AuthDesktopOtp,
  AuthDesktopRegister,
  AuthDesktopWelcome,
  AuthDesktopLink,
  AuthDesktopError,
  AuthDesktopBlocked
};
