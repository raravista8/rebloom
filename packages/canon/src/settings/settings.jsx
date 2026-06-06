// @rebloom/canon · settings/settings.jsx
// Converted from design source pd-settings.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdIc } from "../feed/feed";
import { PdBtn, PdField, PdI, PdInput, PdNotice, PdOtp } from "../primitives/kit";

// pd-settings.jsx — «Передарим» · Настройки аккаунта (все платформы).
// Reuses pd-kit / pd-feed components. Switch is a new base component.
// Screens: hub, profile, logins(привязки), notifications, privacy,
//   security(sessions), delete-account(FLOW-9). Площадка не проводит денег — payments/self-employed убраны.
const sic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});

const S = {
  card:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9h18M7 15h4"/></svg>,
  link:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M9 15l6-6M10 7l1-1a4 4 0 0 1 6 6l-1 1M14 17l-1 1a4 4 0 0 1-6-6l1-1"/></svg>,
  trash:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/></svg>,
  logout:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M14 4h5v16h-5M14 12H4m0 0 3.5-3.5M4 12l3.5 3.5"/></svg>,
  globe:(p)=><svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"/></svg>,
  device:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M10 18h4"/></svg>,
  laptop:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 20h20"/></svg>,
  mail:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>,
  doc:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/></svg>,
  moon:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M20 14a8 8 0 1 1-9.5-9 6.5 6.5 0 0 0 9.5 9Z"/></svg>,
  briefcase:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5h8v2M3 12h18"/></svg>,
  key:(p)=><svg viewBox="0 0 24 24" {...p}><circle cx="8" cy="8" r="4"/><path d="m11 11 8 8M16 16l2-2M19 19l1.5-1.5"/></svg>,
  chevR:(p)=><svg viewBox="0 0 24 24" {...p}><path d="m9 5 7 7-7 7"/></svg>,
};
const PROVMK = { ya:{c:'#FC3F1D',t:'Я'}, sber:{c:'#21A038',t:'С'}, vk:{c:'#0077FF',t:'VK',fs:11}, tid:{c:'#FFDD2D',t:'Т',col:'#222'}, apple:{c:'#111',t:''} };

// ── base: Switch ───────────────────────────────────────────────────────────
function Switch({ on }) { return <button className={`pd-switch${on?' on':''}`} role="switch" aria-checked={on}><i/></button>; }

// ── settings shell (consistent across platforms; only top inset differs) ────
function SetShell({ plat='ios', title, back=true, footer, action, children }) {
  const top = plat==='ios'?54:plat==='android'?8:12;
  return (
    <div className="pd-root" data-pd-theme="a">
      <header className="pd-appbar" style={{paddingTop:top}}>
        {back ? <button className="pd-iconbtn">{sic(PdI.back,'pd-i22')}</button> : <div style={{width:6}}/>}
        <div className="pd-appbar-title center">{title}</div>
        {action || <div style={{width:38}}/>}
      </header>
      <main className="pd-scroll pds-scroll">{children}</main>
      {footer}
    </div>
  );
}
function SRow({ icon, iconKind, title, sub, value, right, danger, chev=true, mark }) {
  return (
    <div className={`pds-row${danger?' danger':''}`} role="button" tabIndex={0}>
      {mark ? <span className="pds-link-mk" style={{background:mark.c,color:mark.col||'#fff',fontSize:mark.fs||14}}>{mark.t || sic(S.device,'pd-i18')}</span>
            : icon && <span className={`ic ${iconKind||''}`}>{sic(icon,'pd-i18')}</span>}
      <span className="mid"><span className="ttl">{title}</span>{sub && <span className="sub">{sub}</span>}</span>
      {value && <span className="val">{value}</span>}
      {right}
      {chev && !right && <span className="chev">{sic(S.chevR,'pd-i18')}</span>}
    </div>
  );
}
const Group = ({ head, children }) => (
  <div className="pds-group"><div className="pds-ghead">{head}</div><div className="pds-card">{children}</div></div>
);

// ════════════════════════════════════════════════════════════════════════
// 1 · HUB
// ════════════════════════════════════════════════════════════════════════
function SettingsHub({ plat='ios' }) {
  return (
    <SetShell plat={plat} title="Настройки">
      <div className="pds-prof">
        <div className="big"><img src="img/av/w4.jpg" alt=""/></div>
        <div><div className="nm">Екатерина Л.</div>
          <div className="meta">{sic(PdIc.pin,'pd-i13')}Москва · {sic(PdIc.star,'pd-i13')}<b style={{color:'var(--pd-text)'}}>4.9</b> · 23 сделки</div></div>
        <button className="pd-iconbtn pd-iconbtn--ring edit">{sic(PdI.camera,'pd-i18')}</button>
      </div>
      <Group head="Аккаунт">
        <SRow icon={PdIc.user} title="Профиль" sub="Имя, фото, город, о себе"/>
        <SRow icon={S.key} title="Способы входа" sub="Телефон, email, привязки" value="3 привязки"/>
      </Group>
      <Group head="Приложение">
        <SRow icon={PdI.bell} title="Уведомления" sub="Push, email, Telegram"/>
        <SRow icon={S.globe} title="Язык" value="Русский"/>
        <SRow icon={S.moon} title="Тема" value="Системная"/>
      </Group>
      <Group head="Безопасность и данные">
        <SRow icon={PdI.shield} title="Сессии и устройства" value="3 активные"/>
        <SRow icon={PdI.lock} title="Приватность и данные" sub="Согласия 152-ФЗ, экспорт"/>
      </Group>
      <Group head=" ">
        <SRow icon={S.logout} title="Выйти" chev={false}/>
        <SRow icon={S.trash} iconKind="danger" title="Удалить аккаунт" danger chev={false}/>
      </Group>
      <p style={{textAlign:'center',color:'var(--pd-faint)',fontSize:12,marginTop:18}}>Передарим · версия 1.4.0</p>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 2 · PROFILE (rest / saving)
// ════════════════════════════════════════════════════════════════════════
function SettingsProfile({ plat='ios', state='rest' }) {
  const foot = <div className="pd-footerbar"><PdBtn variant="primary" block lg loading={state==='saving'} disabled={state==='saving'}>{state==='saving'?'Сохраняем…':'Сохранить'}</PdBtn></div>;
  return (
    <SetShell plat={plat} title="Профиль" footer={foot}>
      <div style={{padding:'0 18px'}}>
        <div className="pds-avedit">
          <div className="ring"><img src="img/av/w4.jpg" alt=""/><span className="cam">{sic(PdI.camera,'pd-i16')}</span></div>
          <button className="pd-link">Изменить фото</button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <PdField label="Имя" hint="Так вас видят покупатели"><PdInput value="Екатерина" state="focus"/></PdField>
          <PdField label="Город"><div className="pa-citysel"><span>Москва</span><span className="chev">{sic(PdIc.chev,'pd-i18')}</span></div></PdField>
          <PdField label="О себе" opt="по желанию" counter="48 / 160"><PdInput textarea rows={3} value="Дарю букетам вторую жизнь 🌷 Самовывоз в центре."/></PdField>
        </div>
      </div>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3 · LOGINS / привязки
// ════════════════════════════════════════════════════════════════════════
function SettingsLogins({ plat='ios' }) {
  return (
    <SetShell plat={plat} title="Способы входа">
      <div style={{padding:'14px 18px 4px'}}><PdNotice kind="info">Хотя бы один способ входа должен оставаться активным. Привязки ускоряют вход и подтверждают личность.</PdNotice></div>
      <Group head="Контакты">
        <SRow icon={S.device} title="Телефон" value="+7 999 ···-58-03" right={<span className="pds-pill ok">{sic(PdI.check,'pd-i13')}основной</span>} chev={false}/>
        <SRow icon={S.mail} title="Email" sub="Для чеков и важных писем" right={<span className="pd-link" style={{fontSize:13}}>Добавить</span>} chev={false}/>
      </Group>
      <Group head="Сервисы">
        <SRow mark={PROVMK.ya} title="Яндекс ID" sub="Привязан · katya@ya.ru" right={<span className="pd-link" style={{fontSize:13}}>Отвязать</span>} chev={false}/>
        <SRow mark={PROVMK.vk} title="VK ID" sub="Привязан" right={<span className="pd-link" style={{fontSize:13}}>Отвязать</span>} chev={false}/>
        <SRow mark={PROVMK.sber} title="Сбер ID" right={<span className="pds-pill off">подключить</span>} chev={false}/>
        <SRow mark={PROVMK.tid} title="T-ID" right={<span className="pds-pill off">подключить</span>} chev={false}/>
      </Group>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4 · PAYMENTS
// ════════════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════════════
// 5 · NOTIFICATIONS (toggles)
// ════════════════════════════════════════════════════════════════════════
function SettingsNotifications({ plat='ios' }) {
  const row = (icon,title,sub,on) => <SRow icon={icon} title={title} sub={sub} right={<Switch on={on}/>} chev={false}/>;
  return (
    <SetShell plat={plat} title="Уведомления">
      <Group head="Сделки">
        {row(PdI.wallet,'Статусы сделок','Договорённость, встреча, завершение',true)}
        {row(PdI.bell,'Сообщения в чате',null,true)}
        {row(PdIc.star,'Новые отзывы',null,true)}
      </Group>
      <Group head="Активность">
        {row(PdI.heartline,'Лайки на ваших букетах',null,false)}
        {row(PdIc.search,'Похожие букеты рядом',null,true)}
      </Group>
      <Group head="Каналы">
        {row(S.device,'Push','На этом устройстве',true)}
        {row(S.mail,'Email','katya@ya.ru',false)}
        {row(PdI.send,'Telegram','Бот @peredarim_bot',true)}
      </Group>
      <Group head="Прочее">
        {row(PdI.info,'Новости и акции','Не чаще раза в неделю',false)}
      </Group>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 6 · PRIVACY (152-ФЗ)
// ════════════════════════════════════════════════════════════════════════
function SettingsPrivacy({ plat='ios' }) {
  return (
    <SetShell plat={plat} title="Приватность и данные">
      <Group head="Согласия 152-ФЗ">
        <SRow icon={PdI.shield} title="Обработка персональных данных" right={<span className="pds-pill ok">дано</span>} chev={false}/>
        <SRow icon={PdIc.pin} title="Геолокация" sub="Показывать букеты рядом" right={<Switch on/>} chev={false}/>
        <SRow icon={PdIc.user} title="Показывать профиль в поиске" right={<Switch on/>} chev={false}/>
      </Group>
      <Group head="Ваши данные">
        <SRow icon={S.doc} title="Скачать мои данные" sub="Выгрузка в течение 30 дней"/>
        <SRow icon={PdI.info} title="Политика конфиденциальности"/>
        <SRow icon={S.doc} title="Условия использования"/>
      </Group>
      <Group head=" ">
        <SRow icon={S.trash} iconKind="danger" title="Удалить аккаунт" sub="Удаление по запросу (DSR)" danger chev/>
      </Group>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 7 · SECURITY / sessions
// ════════════════════════════════════════════════════════════════════════
function SettingsSecurity({ plat='ios' }) {
  const foot = <div className="pd-footerbar"><PdBtn variant="secondary" block lg>Завершить все другие сессии</PdBtn></div>;
  return (
    <SetShell plat={plat} title="Сессии и устройства" footer={foot}>
      <Group head="Активные сейчас">
        <SRow icon={S.device} title="iPhone 15 · это устройство" sub="Москва · только что" right={<span className="pds-pill ok">текущее</span>} chev={false}/>
        <SRow icon={S.laptop} title="Web · Chrome, macOS" sub="Москва · 2 часа назад" right={<span className="pd-link" style={{fontSize:13}}>Выйти</span>} chev={false}/>
        <SRow icon={S.device} title="Android · приложение" sub="СПб · 3 дня назад" right={<span className="pd-link" style={{fontSize:13}}>Выйти</span>} chev={false}/>
      </Group>
      <div style={{padding:'4px 18px 0'}}><PdNotice kind="warn" icon={PdI.shield}>Не узнаёте устройство? Завершите сессию и смените способ входа. Действие логируется.</PdNotice></div>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 9 · DELETE ACCOUNT (FLOW-9): warn → otp-confirm
// ════════════════════════════════════════════════════════════════════════
function SettingsDelete({ plat='ios', state='warn' }) {
  if (state==='otp') {
    const foot = <div className="pd-footerbar"><PdBtn variant="danger" block lg>Подтвердить удаление</PdBtn></div>;
    return (
      <SetShell plat={plat} title="Удаление аккаунта" footer={foot}>
        <div style={{padding:'24px 20px',textAlign:'center'}}>
          <h2 style={{fontSize:21,fontWeight:700,marginBottom:8}}>Подтвердите по коду</h2>
          <p style={{color:'var(--pd-muted)',fontSize:14,lineHeight:1.5,marginBottom:24}}>Отправили код на +7 999 ···-58-03. Это последний шаг, после подтверждения аккаунт отключается сразу.</p>
          <PdOtp value="41" cur={2}/>
        </div>
      </SetShell>
    );
  }
  const foot = <div className="pd-footerbar" style={{display:'flex',flexDirection:'column',gap:9}}>
    <PdBtn variant="danger" block lg>Удалить аккаунт</PdBtn>
    <PdBtn variant="ghost" block>Отмена</PdBtn>
  </div>;
  return (
    <SetShell plat={plat} title="Удаление аккаунта" footer={foot}>
      <div className="pds-confirm">
        <div className="glyph">{sic(S.trash,'pd-i28')}</div>
        <h2>Удалить аккаунт?</h2>
        <p>Действие необратимо. Профиль, объявления и история будут удалены или обезличены по закону.</p>
      </div>
      <div style={{padding:'0 20px'}}>
        <div className="pds-keeplist">
          <div className="li" style={{color:'var(--pd-danger)'}}>{sic(S.trash,'pd-i16')}<span>Профиль, фото, объявления и лайки удаляются</span></div>
          <div className="li">{sic(PdI.lock,'pd-i16')}<span>Данные завершённых сделок и чеки хранятся по 54-ФЗ/152-ФЗ</span></div>
          <div className="li" style={{color:'var(--pd-warn)'}}>{sic(PdI.alert,'pd-i16')}<span>Активные сделки нужно завершить до удаления</span></div>
        </div>
      </div>
    </SetShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// DESKTOP — two-pane settings
// ════════════════════════════════════════════════════════════════════════
const DNAV = [
  ['profile','Профиль',PdIc.user],['logins','Способы входа',S.key],
  ['notif','Уведомления',PdI.bell],['privacy','Приватность и данные',PdI.lock],['security','Сессии',PdI.shield],
];
function SettingsDesktop({ screen='profile' }) {
  return (
    <div className="pdss pd-root" data-pd-theme="a">
      <aside className="pdss-side">
        <div className="h">Настройки</div>
        {DNAV.map(([k,l,Ic])=>(
          <button key={k} className={`pdss-nav${screen===k?' on':''}`}><span className="ic">{sic(Ic,'pd-i18')}</span>{l}</button>
        ))}
        <button className="pdss-nav danger"><span className="ic">{sic(S.trash,'pd-i18')}</span>Удалить аккаунт</button>
      </aside>
      <main className="pdss-main"><div className="pdss-wrap">{DESKBODY[screen] ? DESKBODY[screen]() : DESKBODY.profile()}</div></main>
    </div>
  );
}
const dRow = (icon,title,sub,right,opts={}) => (
  <div className={`pds-row${opts.danger?' danger':''}`} role="button" style={{borderRadius:0}}>
    {opts.mark ? <span className="pds-link-mk" style={{background:opts.mark.c,color:opts.mark.col||'#fff',fontSize:opts.mark.fs||14}}>{opts.mark.t}</span>
              : <span className={`ic ${opts.iconKind||''}`}>{sic(icon,'pd-i18')}</span>}
    <span className="mid"><span className="ttl">{title}</span>{sub&&<span className="sub">{sub}</span>}</span>
    {right}
  </div>
);
const DESKBODY = {
  profile: () => (<>
    <h1 className="pdss-h1">Профиль</h1>
    <p className="pdss-sub">Так вас видят покупатели на витрине и в сделках</p>
    <div className="pdss-block" style={{padding:'22px'}}>
      <div className="pds-avedit" style={{flexDirection:'row',gap:18,padding:0,alignItems:'center'}}>
        <div className="ring" style={{width:78,height:78}}><img src="img/av/w4.jpg" alt=""/></div>
        <div><div style={{fontWeight:700,fontSize:17}}>Екатерина Л.</div><div style={{color:'var(--pd-muted)',fontSize:13,marginTop:3}}>katya@ya.ru</div>
          <div style={{marginTop:10,display:'flex',gap:8}}><PdBtn variant="secondary">Изменить фото</PdBtn><PdBtn variant="ghost">Удалить</PdBtn></div></div>
      </div>
    </div>
    <div className="pdss-block" style={{padding:'22px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'18px 22px'}}>
        <PdField label="Имя"><PdInput value="Екатерина" state="focus"/></PdField>
        <PdField label="Город"><div className="pa-citysel"><span>Москва</span><span className="chev">{sic(PdIc.chev,'pd-i18')}</span></div></PdField>
      </div>
      <div style={{marginTop:18}}><PdField label="О себе" opt="по желанию" counter="48 / 160"><PdInput textarea rows={3} value="Дарю букетам вторую жизнь 🌷 Самовывоз в центре."/></PdField></div>
      <div style={{marginTop:20}}><PdBtn variant="primary" lg>Сохранить</PdBtn></div>
    </div>
  </>),
  logins: () => (<>
    <h1 className="pdss-h1">Способы входа</h1>
    <p className="pdss-sub">Контакты и сервисы для быстрого входа. Хотя бы один способ должен оставаться активным</p>
    <div className="pdss-block"><div className="bh">Контакты</div><div style={{height:6}}/>
      {dRow(S.device,'Телефон','+7 999 ···-58-03',<span className="pds-pill ok">основной</span>)}
      {dRow(S.mail,'Email','Не добавлен',<span className="pd-link" style={{fontSize:13}}>Добавить</span>)}
    </div>
    <div className="pdss-block"><div className="bh">Сервисы</div><div style={{height:6}}/>
      {dRow(null,'Яндекс ID','Привязан · katya@ya.ru',<span className="pd-link" style={{fontSize:13}}>Отвязать</span>,{mark:PROVMK.ya})}
      {dRow(null,'VK ID','Привязан',<span className="pd-link" style={{fontSize:13}}>Отвязать</span>,{mark:PROVMK.vk})}
      {dRow(null,'Сбер ID',null,<span className="pds-pill off">подключить</span>,{mark:PROVMK.sber})}
      {dRow(null,'T-ID',null,<span className="pds-pill off">подключить</span>,{mark:PROVMK.tid})}
    </div>
  </>),
  notif: () => (<>
    <h1 className="pdss-h1">Уведомления</h1>
    <p className="pdss-sub">Что и куда присылать. Важные уведомления о сделках отключить нельзя</p>
    <div className="pdss-block"><div className="bh">Сделки</div><div style={{height:6}}/>
      {dRow(PdI.wallet,'Статусы сделок','Договорённость, встреча, завершение',<Switch on/>)}
      {dRow(PdI.bell,'Сообщения в чате',null,<Switch on/>)}
      {dRow(PdIc.star,'Новые отзывы',null,<Switch on/>)}
    </div>
    <div className="pdss-block"><div className="bh">Каналы</div><div style={{height:6}}/>
      {dRow(S.device,'Push','На этом устройстве',<Switch on/>)}
      {dRow(S.mail,'Email','katya@ya.ru',<Switch />)}
      {dRow(PdI.send,'Telegram','Бот @peredarim_bot',<Switch on/>)}
    </div>
  </>),
  security: () => (<>
    <h1 className="pdss-h1">Сессии и устройства</h1>
    <p className="pdss-sub">Где выполнен вход. Завершите незнакомые сессии, действие логируется</p>
    <div className="pdss-block"><div style={{height:8}}/>
      {dRow(S.laptop,'Web · Chrome, macOS','Москва · это устройство · только что',<span className="pds-pill ok">текущее</span>)}
      {dRow(S.device,'iPhone 15 · приложение','Москва · 2 часа назад',<span className="pd-link" style={{fontSize:13}}>Выйти</span>)}
      {dRow(S.device,'Android · приложение','СПб · 3 дня назад',<span className="pd-link" style={{fontSize:13}}>Выйти</span>)}
    </div>
    <PdBtn variant="secondary" lg>Завершить все другие сессии</PdBtn>
  </>),
  privacy: () => (<>
    <h1 className="pdss-h1">Приватность и данные</h1>
    <p className="pdss-sub">Согласия по 152-ФЗ и управление вашими данными</p>
    <div className="pdss-block"><div className="bh">Согласия</div><div style={{height:6}}/>
      {dRow(PdI.shield,'Обработка персональных данных',null,<span className="pds-pill ok">дано</span>)}
      {dRow(PdIc.pin,'Геолокация','Показывать букеты рядом',<Switch on/>)}
    </div>
    <div className="pdss-block"><div className="bh">Ваши данные</div><div style={{height:6}}/>
      {dRow(S.doc,'Скачать мои данные','Выгрузка в течение 30 дней',<span className="pd-link" style={{fontSize:13}}>Запросить</span>)}
    </div>
  </>),
};

export {
  Switch as PdSwitch,
  SettingsHub,
  SettingsProfile,
  SettingsLogins,
  SettingsNotifications,
  SettingsPrivacy,
  SettingsSecurity,
  SettingsDelete,
  SettingsDesktop
};
