// @rebloom/canon · admin/mobile.jsx
// Converted from design source pd-admin-mobile.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdIc, pdMoney } from "../feed/feed";
import { PdBtn, PdI, PdOtp } from "../primitives/kit";

// pd-admin-mobile.jsx — «Передарим» админка на телефоне (полная).
// Просмотр + срочные действия с реальной микромеханикой (sheets с причиной,
// drill-down, фильтры, 2FA-вход, more-menu). Тяжёлые таблицы/сверка — десктоп.

const mic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});
const chevR = (p)=><svg viewBox="0 0 24 24" {...p}><path d="m9 5 7 7-7 7"/></svg>;
const back = (p)=><svg viewBox="0 0 24 24" {...p}><path d="m15 5-7 7 7 7"/></svg>;
const dots = (p)=><svg viewBox="0 0 24 24" {...p}><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>;
const gift = (p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 13h18M12 9v11M8.5 9C6 9 6 5 8.5 5S12 9 12 9s-.5-4 2-4 2.5 4 0 4"/></svg>;

const NAV = [['dash','Обзор',PdIc.home,null],['mod','Модерация',PdI.alert,'12'],['deals','Сделки',PdIc.deals,'1'],['fraud','Антифрод',PdI.shield,'7'],['more','Ещё',dots,'3']];
function MTab({ active }) {
  return (
    <nav className="pdam-tab">
      {NAV.map(([k,l,Ic,ct])=>(
        <button key={k} className={active===k?'on':''}>{ct&&<span className="ct">{ct}</span>}{mic(Ic,'pd-i22')}{l}</button>
      ))}
    </nav>
  );
}
function MShell({ active, title, back:bk, action, children, overlay, noTab }) {
  return (
    <div className="pdam">
      <div className="pdam-top">
        {bk && <button className="pd-iconbtn" style={{marginRight:2,marginLeft:-6}}>{mic(back,'pd-i22')}</button>}
        <div className="h">{title}</div>
        {action || <span className="badge">{mic(PdI.lock,'pd-i12')}2FA</span>}
      </div>
      <div className="pdam-body">{children}</div>
      {!noTab && <MTab active={active}/>}
      {overlay}
    </div>
  );
}
const Sheet = ({ children }) => <div className="pdam-scrim"><div className="pdam-sheet"><div className="grab"/>{children}</div></div>;

// ════════════════ LOGIN / 2FA ════════════════
function AdminMobileLogin({ step='login' }) {
  return (
    <div className="pdam">
      <div className="pdam-login">
        <div className="logo">{mic(gift,'pd-i28')}</div>
        {step==='login' ? <>
          <h2>Передарим · admin</h2>
          <p>Вход для операторов. Доступ по ролям, все действия логируются.</p>
          <div style={{display:'flex',flexDirection:'column',gap:13,textAlign:'left'}}>
            <div className="pd-field"><label className="pd-label">Рабочий email</label><div className="pd-input pd-input--focus"><input defaultValue="moderator@peredarim.ru"/></div></div>
            <div className="pd-field"><label className="pd-label">Пароль</label><div className="pd-input"><input type="password" defaultValue="········"/></div></div>
          </div>
          <div style={{marginTop:18}}><PdBtn variant="primary" block lg>Войти</PdBtn></div>
          <div className="pdam-rolepill">{mic(PdI.shield,'pd-i12')}Требуется 2FA (TOTP)</div>
        </> : <>
          <h2>Код двухфакторной</h2>
          <p>Введите 6-значный код из приложения-аутентификатора.</p>
          <PdOtp value="6041" cur={4}/>
          <div style={{marginTop:22}}><PdBtn variant="primary" block lg>Подтвердить вход</PdBtn></div>
          <p style={{marginTop:14,fontSize:12}}>Доступ оператора <b>moderator</b> · сессия 12 ч</p>
        </>}
      </div>
    </div>
  );
}

// ════════════════ 1 · ОБЗОР ════════════════
function AdminMobileDash() {
  const k=[['Онлайн','342','+5%'],['DAU','4 870','+8%'],['Оборот / мес','3,24 млн ₽','+14%'],['Сделок','1 142','+12%']];
  const att=[
    [PdI.alert,'var(--pd-warn)','Модерация','12 в очереди · 1 оспорено'],
    [PdI.shield,'var(--pd-danger)','Антифрод','7 сигналов · 2 высокого риска'],
    [PdIc.deals,'var(--pd-danger)','Жалобы на сделки','1 активная · SLA 24 ч'],
    [PdI.flag,'var(--pd-warn)','Жалобы','3 новых'],
  ];
  return (
    <MShell active="dash" title="Обзор">
      <div className="pdam-kpis">{k.map((x,i)=>(
        <div className="pdam-kpi" key={i}><div className="lab">{x[0]}</div><div className="val">{x[1]}</div><div className="delta">↑ {x[2]}</div></div>
      ))}</div>
      <div className="pdam-sec">
        <div className="sh">Требуют внимания</div>
        {att.map((a,i)=>(
          <div className="pdam-item" key={i}>
            <span className="ic" style={{background:a[1]==='var(--pd-danger)'?'var(--pd-danger-soft)':'var(--pd-warn-soft)',color:a[1]}}>{mic(a[0],'pd-i18')}</span>
            <div className="mid"><div className="t1">{a[2]}</div><div className="t2">{a[3]}</div></div>
            <span className="chev">{mic(chevR,'pd-i18')}</span>
          </div>
        ))}
      </div>
      <div className="pdam-readonly">Полные таблицы, графики и сверка ledger в десктопной версии.</div>
    </MShell>
  );
}

// ════════════════ 2 · МОДЕРАЦИЯ (+reject sheet) ════════════════
const MODCARDS=[
  ['1565695951564-007d8f297e48','Объявление · Катя','ML-риск: возможно лицо на фото','Большой букет пионов, очень свежий. Самовывоз сегодня.'],
  ['1531120364508-a6b656c3e78d','Объявление · Юля','Жалоба: контакт в описании','Свежие розы, пишите для деталей…'],
];
function ModQueue() {
  return (<>
    <div className="pdam-chips"><button className="pdam-chip on">ML-риск<span className="n">5</span></button><button className="pdam-chip">Жалобы<span className="n">4</span></button><button className="pdam-chip">Антифрод<span className="n">2</span></button><button className="pdam-chip">Апелляции<span className="n">1</span></button></div>
    {MODCARDS.map((c,i)=>(
      <div className="pdam-mod" key={i}>
        <div className="img"><img src={`img/${c[0]}.jpg`} alt=""/><span className="tag">на ревью · живое</span></div>
        <div className="bd">
          <div className="rw"><span className="who">{c[1]}</span><span className="pda-flag" style={{fontSize:11}}>{mic(PdI.alert,'pd-i12')}флаг</span></div>
          <div className="rsn">{mic(PdI.alert,'pd-i12')}{c[2]}</div>
          <p className="txt">{c[3]}</p>
        </div>
        <div className="acts"><PdBtn variant="secondary" block>Снять…</PdBtn><PdBtn variant="primary" block>Оставить в ленте</PdBtn></div>
      </div>
    ))}
  </>);
}
function AdminMobileMod() { return <MShell active="mod" title="Модерация"><ModQueue/></MShell>; }
function AdminMobileModReject() {
  const sheet = (
    <Sheet>
      <h3>Снять объявление с публикации</h3>
      <p className="sub">Объявление сейчас живое. Причина уйдёт продавцу и в audit-log, он сможет отредактировать и обжаловать.</p>
      <div className="pdam-reasons">
        <label className="pdam-reason on"><span className="rb"/>Контакты в описании</label>
        <label className="pdam-reason"><span className="rb"/>Не цветы / не та категория</label>
        <label className="pdam-reason"><span className="rb"/>Запрещённый контент на фото</label>
        <label className="pdam-reason"><span className="rb"/>Другое (указать)</label>
      </div>
      <textarea rows={2} placeholder="Комментарий продавцу (необязательно)"></textarea>
      <div className="sf"><PdBtn variant="ghost" block>Отмена</PdBtn><PdBtn variant="danger" block>Снять</PdBtn></div>
    </Sheet>
  );
  return <MShell active="mod" title="Модерация" overlay={sheet}><ModQueue/></MShell>;
}

// ════════════════ 3 · СДЕЛКИ (+cancel sheet, +dispute drill) ════════════════
const MDEALS=[['#10478','Соня → Юля',850,'problem','жалоба · SLA 24 ч'],['#10482','Марина → Аня',990,'meeting','идёт'],['#10481','Катя → Лена',1190,'done','завершена'],['#10475','Вера → Ольга',590,'cancelled','отменена']];
const STC={problem:['var(--pd-danger-soft)','#7e2c1e'],meeting:['var(--pd-warn-soft)','#7a5a16'],done:['var(--pd-fresh-soft)','#2f5a3c'],cancelled:['var(--pd-surface-3)','#7a6a52'],agreed:['#e9eefb','#33508f']};
function DealsList() {
  return (<>
    <div className="pdam-chips"><button className="pdam-chip on">Жалоба<span className="n">1</span></button><button className="pdam-chip">Идёт</button><button className="pdam-chip">Завершена</button><button className="pdam-chip">Отменена</button><button className="pdam-chip">Все</button></div>
    <div className="pdam-sec">
      <div className="sh">Жалобы <span className="ct">1</span></div>
      <div className="pdam-item">
        <span className="ic" style={{background:'var(--pd-danger-soft)',color:'var(--pd-danger)'}}>{mic(PdI.alert,'pd-i18')}</span>
        <div className="mid"><div className="t1">#10478 · Соня → Юля</div><div className="t2">Букет не соответствует фото · SLA 24 ч</div></div>
        <span className="amt">{pdMoney(850)}</span>
      </div>
      <div className="pdam-modact" style={{display:'flex',gap:8,padding:'11px 15px',borderTop:'1px solid var(--pd-border)'}}><PdBtn variant="secondary" block>Детали жалобы</PdBtn><PdBtn variant="primary" block>Разобрать</PdBtn></div>
    </div>
    <div className="pdam-sec">
      <div className="sh">Последние сделки</div>
      {MDEALS.map((d,i)=>(
        <div className="pdam-item" key={i}>
          <span className="ic" style={{background:STC[d[3]][0],color:STC[d[3]][1]}}>{mic(PdIc.deals,'pd-i18')}</span>
          <div className="mid"><div className="t1">{d[0]} · {d[1]}</div><div className="t2">{d[4]}</div></div>
          <span className="amt">{pdMoney(d[2])}</span>
        </div>
      ))}
    </div>
    <div className="pdam-readonly">Отмена сделки фиксируется в audit-log.</div>
  </>);
}
function AdminMobileDeals() { return <MShell active="deals" title="Сделки"><DealsList/></MShell>; }
function AdminMobileDealCancel() {
  const sheet = (
    <Sheet>
      <h3>Отменить сделку #10482?</h3>
      <p className="sub">Марина → Аня · 990 ₽. Отмена снимет сделку, стороны получат уведомление. Необратимо.</p>
      <div className="pd-field" style={{textAlign:'left'}}><label className="pd-label">Причина отмены *</label></div>
      <textarea rows={3} defaultValue="Продавец недоступен 48 ч, букет неактуален. Обращение #1902.">{}</textarea>
      <div className="pdam-4eyes">{mic(PdI.shield,'pd-i16')}Действие фиксируется в audit-log.</div>
      <div className="sf"><PdBtn variant="ghost" block>Отмена</PdBtn><PdBtn variant="danger" block>Отменить сделку</PdBtn></div>
    </Sheet>
  );
  return <MShell active="deals" title="Сделки" overlay={sheet}><DealsList/></MShell>;
}
function AdminMobileDispute() {
  return (
    <MShell active="deals" title="Жалоба #10478" back action={<button className="pd-iconbtn">{mic(dots,'pd-i20')}</button>}>
      <div className="pdam-sec" style={{padding:'14px 15px'}}>
        <div className="rw" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span className="pda-badge problem">жалоба</span><span style={{fontSize:12,color:'var(--pd-danger)',fontWeight:700}}>SLA 24 ч · осталось 18:42</span>
        </div>
        <div style={{fontSize:20,fontWeight:700,marginTop:10}}>{pdMoney(850)} <span style={{fontSize:13,color:'var(--pd-muted)',fontWeight:600}}>сумма сделки</span></div>
      </div>
      <div className="pdam-sec">
        <div className="pdam-kv"><span className="k">Покупатель</span><span className="v">Юля В.</span></div>
        <div className="pdam-kv"><span className="k">Продавец</span><span className="v">Соня Л.</span></div>
        <div className="pdam-kv"><span className="k">Причина жалобы</span><span className="v">Букет не соответствует фото</span></div>
        <div className="pdam-kv"><span className="k">Открыт</span><span className="v">02.06 19:41</span></div>
      </div>
      <div className="pdam-sec">
        <div className="sh">Доказательства</div>
        <div style={{display:'flex',gap:8,padding:'0 15px 14px'}}>
          <div style={{flex:1,aspectRatio:'1',borderRadius:10,overflow:'hidden',background:'var(--pd-surface-2)'}}><img src="img/1531120364508-a6b656c3e78d.jpg" style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/></div>
          <div style={{flex:1,aspectRatio:'1',borderRadius:10,overflow:'hidden',background:'var(--pd-surface-2)'}}><img src="img/1522748906645-95d8adfd52c7.jpg" style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/></div>
        </div>
      </div>
      <div className="pdam-actbar">
        <PdBtn variant="primary" block lg>Предупредить продавца</PdBtn>
        <PdBtn variant="secondary" block lg>Заблокировать продавца…</PdBtn>
        <PdBtn variant="ghost" block>Отклонить жалобу</PdBtn>
      </div>
    </MShell>
  );
}

// ════════════════ 4 · АНТИФРОД (+cluster drill) ════════════════
const SIG=[['hi',92,'Мульти-аккаунты по IP','2.18.··.41 · 3 аккаунта'],['hi',88,'Накрутка отзывов','цепочка из 3 аккаунтов'],['md',64,'Повторные жалобы','3 жалобы · 1 продавец'],['md',57,'Переиспользование фото','хэш 98% · 4 объявления'],['lo',34,'Аномалия цены','120 ₽ при медиане 950 ₽']];
function AdminMobileFraud() {
  return (
    <MShell active="fraud" title="Антифрод">
      <div className="pdam-kpis">
        <div className="pdam-kpi"><div className="lab">Открытых сигналов</div><div className="val">7</div></div>
        <div className="pdam-kpi"><div className="lab">Высокий риск</div><div className="val" style={{color:'var(--pd-danger)'}}>2</div></div>
      </div>
      <div className="pdam-chips"><button className="pdam-chip on">Высокий + средний</button><button className="pdam-chip">Все методики</button><button className="pdam-chip">30 дней</button></div>
      <div className="pdam-sec">
        <div className="sh">Сигналы</div>
        {SIG.map((s,i)=>(
          <div className="pdam-item" key={i}>
            <span className="ic" style={{background:s[0]==='hi'?'var(--pd-danger-soft)':s[0]==='md'?'var(--pd-warn-soft)':'var(--pd-fresh-soft)',color:s[0]==='hi'?'#7e2c1e':s[0]==='md'?'#7a5a16':'#2f5a3c',fontWeight:800,fontSize:14}}>{s[1]}</span>
            <div className="mid"><div className="t1">{s[2]}</div><div className="t2">{s[3]}</div></div>
            <span className="chev">{mic(chevR,'pd-i18')}</span>
          </div>
        ))}
      </div>
      <div className="pdam-readonly">Блокировка кластеров и граф связей в десктопной версии.</div>
    </MShell>
  );
}
function AdminMobileFraudDrill() {
  return (
    <MShell active="fraud" title="Сигнал · risk 92" back>
      <div className="pdam-sec" style={{padding:'14px 15px'}}>
        <div style={{display:'flex',gap:13,alignItems:'center'}}>
          <span style={{width:52,height:52,borderRadius:13,background:'var(--pd-danger-soft)',color:'#7e2c1e',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,flex:'none'}}>92</span>
          <div><div style={{fontWeight:700,fontSize:15}}>Мульти-аккаунты по IP</div><div style={{fontSize:12.5,color:'var(--pd-muted)',marginTop:3}}>IP 2.18.··.41 · взаимные лайки и отзывы</div></div>
        </div>
      </div>
      <div className="pdam-sec">
        <div className="sh">Связанные аккаунты</div>
        {[['w3.jpg','Соня Л.','flag'],['w5.jpg','Юля В.','flag'],['w2.jpg','Аккаунт #5120','']].map((u,i)=>(
          <div className="pdam-item" key={i}>
            <span className="ic" style={{padding:0,overflow:'hidden'}}><img src={`img/av/${u[0]}`} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/></span>
            <div className="mid"><div className="t1">{u[1]}</div><div className="t2">{u[2]?'помечен · высокий риск':'в наблюдении'}</div></div>
            {u[2] && <span className="pda-flag" style={{fontSize:11}}>{mic(PdI.alert,'pd-i12')}флаг</span>}
          </div>
        ))}
        <div className="pdam-kv"><span className="k">Взаимные отзывы</span><span className="v">6</span></div>
        <div className="pdam-kv"><span className="k">Общих устройств</span><span className="v">2</span></div>
      </div>
      <div className="pdam-actbar">
        <PdBtn variant="danger" block lg icon={PdI.shield}>Заблокировать кластер…</PdBtn>
        <PdBtn variant="secondary" block>Ограничить аккаунты</PdBtn>
      </div>
    </MShell>
  );
}

// ════════════════ ЕЩЁ + Пользователи / Объявления / Финансы / Жалобы ════════════════
function AdminMobileMore() {
  const rows=[['Пользователи',PdIc.user,null],['Объявления',PdIc.search,null],['Финансы',PdI.wallet,null],['Жалобы',PdI.flag,'3'],['Модерация',PdI.alert,'12']];
  return (
    <MShell active="more" title="Ещё">
      <div className="pdam-sec" style={{padding:'4px 16px'}}>
        <div className="pdam-more">
          {rows.map((r,i)=>(<div className="pdam-morerow" key={i}><span className="ic">{mic(r[1],'pd-i18')}</span>{r[0]}{r[2]&&<span className="ct">{r[2]}</span>}{!r[2]&&<span style={{marginLeft:'auto',color:'var(--pd-faint)'}}>{mic(chevR,'pd-i18')}</span>}</div>))}
        </div>
      </div>
      <div className="pdam-sec" style={{padding:'4px 16px'}}>
        <div className="pdam-more">
          <div className="pdam-morerow"><span className="ic">{mic(PdI.shield,'pd-i18')}</span>Роль и доступ<span style={{marginLeft:'auto',fontSize:12.5,color:'var(--pd-muted)'}}>moderator</span></div>
          <div className="pdam-morerow danger"><span className="ic">{mic(PdI.lock,'pd-i18')}</span>Выйти</div>
        </div>
      </div>
      <div className="pdam-readonly">Видимость разделов зависит от роли (RBAC). Часть действий доступна только на десктопе.</div>
    </MShell>
  );
}
const MUSERS=[['w1.jpg','Марина К.','Москва · iOS','active'],['w3.jpg','Соня Л.','СПб · Android','review'],['w5.jpg','Юля В.','Казань · Web','blocked'],['w4.jpg','Екатерина Л.','Москва · iOS','active'],['w6.jpg','Ольга Р.','Новосибирск','active']];
function UsersList() {
  const stb={active:['active','активен'],review:['held','на проверке'],blocked:['blocked','заблокирован']};
  return (<>
    <div className="pdam-search">{mic(PdIc.search,'pd-i16')}Поиск по имени, телефону, ID</div>
    <div className="pdam-chips"><button className="pdam-chip on">Активные</button><button className="pdam-chip">На проверке</button><button className="pdam-chip">Заблокированы</button><button className="pdam-chip">Мульти-IP</button></div>
    <div className="pdam-sec">
      {MUSERS.map((u,i)=>(
        <div className="pdam-item" key={i}>
          <span className="ic" style={{borderRadius:'50%',padding:0,overflow:'hidden'}}><img src={`img/av/${u[0]}`} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/></span>
          <div className="mid"><div className="t1">{u[1]}</div><div className="t2">{u[2]}</div></div>
          <span className={`pda-badge ${stb[u[3]][0]}`} style={{fontSize:11}}>{stb[u[3]][1]}</span>
        </div>
      ))}
    </div>
  </>);
}
function AdminMobileUsers() { return <MShell active="more" title="Пользователи" back><UsersList/></MShell>; }
function AdminMobileUserDrill() {
  return (
    <MShell active="more" title="Пользователь" back action={<span className="pdam-logged">{mic(PdI.lock,'pd-i12')}ПДн</span>}>
      <div className="pdam-sec" style={{padding:'14px 15px'}}>
        <div className="pdam-drillhead">
          <span className="av"><img src="img/av/w4.jpg" alt=""/></span>
          <div><div className="nm">Екатерина Л.</div><div className="mt">ID 48213 · Москва · iOS</div>
            <div style={{marginTop:6,display:'flex',gap:6}}><span className="pda-badge active" style={{fontSize:11}}>активен</span><span className="pda-risk lo" style={{fontSize:11}}>низкий риск</span></div></div>
        </div>
      </div>
      <div className="pdam-sec">
        <div className="pdam-kv"><span className="k">Телефон</span><span className="v">+7 999 ···-58-03</span></div>
        <div className="pdam-kv"><span className="k">Email</span><span className="v">katya@ya.ru</span></div>
        <div className="pdam-kv"><span className="k">Привязки</span><span className="v">Яндекс ID · VK ID</span></div>
        <div className="pdam-kv"><span className="k">Объявлений</span><span className="v">23 (4 активных)</span></div>
        <div className="pdam-kv"><span className="k">Сделок</span><span className="v">57 · 1 жалоба</span></div>
        <div className="pdam-kv"><span className="k">Рейтинг</span><span className="v">4.9 · 57 отзывов</span></div>
      </div>
      <div className="pdam-actbar">
        <PdBtn variant="secondary" block>Сбросить сессии</PdBtn>
        <PdBtn variant="danger" block icon={PdI.shield}>Заблокировать…</PdBtn>
      </div>
    </MShell>
  );
}
function AdminMobileBlock() {
  const sheet = (
    <Sheet>
      <h3>Заблокировать Екатерину Л.?</h3>
      <p className="sub">Пользователь не сможет входить и публиковать. Активные сделки замораживаются. Причина попадёт в audit-log.</p>
      <div className="pdam-reasons">
        <label className="pdam-reason on"><span className="rb"/>Мошенничество / антифрод</label>
        <label className="pdam-reason"><span className="rb"/>Спам и накрутка</label>
        <label className="pdam-reason"><span className="rb"/>Жалобы пользователей</label>
        <label className="pdam-reason"><span className="rb"/>Другое</label>
      </div>
      <textarea rows={2} placeholder="Комментарий (виден в audit-log)"></textarea>
      <div className="sf"><PdBtn variant="ghost" block>Отмена</PdBtn><PdBtn variant="danger" block>Заблокировать</PdBtn></div>
    </Sheet>
  );
  return <MShell active="more" title="Пользователь" back overlay={sheet}>
    <div className="pdam-sec" style={{padding:'14px 15px'}}>
      <div className="pdam-drillhead"><span className="av"><img src="img/av/w4.jpg" alt=""/></span>
        <div><div className="nm">Екатерина Л.</div><div className="mt">ID 48213 · Москва · iOS</div></div></div>
    </div>
  </MShell>;
}
const MLIST=[['1565695951564-007d8f297e48','Пионы, большой букет','Катя · Москва',1190,'active'],['1531120364508-a6b656c3e78d','Свежие розы 25 шт','Юля · Казань',990,'flagged'],['1522748906645-95d8adfd52c7','Тюльпаны микс','Соня · СПб',650,'active'],['1561181286-d3fee7d55364','Гортензия','Марина · Москва',2100,'sold']];
function AdminMobileListings() {
  const stb={active:['active','активно'],flagged:['held','живое · флаг'],sold:['sold','продано']};
  return (
    <MShell active="more" title="Объявления" back>
      <div className="pdam-search">{mic(PdIc.search,'pd-i16')}Поиск по объявлениям</div>
      <div className="pdam-chips"><button className="pdam-chip on">На ревью<span className="n">9</span></button><button className="pdam-chip">Активные</button><button className="pdam-chip">Продано</button></div>
      <div className="pdam-sec">
        {MLIST.map((l,i)=>(
          <div className="pdam-item" key={i}>
            <span className="ic" style={{borderRadius:9,padding:0,overflow:'hidden',width:42,height:42}}><img src={`img/${l[0]}.jpg`} style={{width:'100%',height:'100%',objectFit:'cover'}} alt=""/></span>
            <div className="mid"><div className="t1">{l[1]}</div><div className="t2">{l[2]} · {pdMoney(l[3])}</div></div>
            <span className={`pda-badge ${stb[l[4]][0]}`} style={{fontSize:11}}>{stb[l[4]][1]}</span>
          </div>
        ))}
      </div>
    </MShell>
  );
}
function AdminMobileFinance() {
  return (
    <MShell active="more" title="Финансы" back>
      <div style={{background:'linear-gradient(155deg,#CF5638,#A8402A)',color:'#fff',borderRadius:16,padding:18}}>
        <div style={{fontSize:12.5,color:'rgba(255,255,255,.85)',fontWeight:600}}>Оборот сделок за месяц</div>
        <div style={{fontSize:30,fontWeight:700,letterSpacing:'-.5px',marginTop:6}}>3,24 млн ₽</div>
        <div style={{fontSize:12.5,color:'rgba(255,255,255,.85)',marginTop:4}}>оценка по завершённым · ↑ 14%</div>
      </div>
      <div className="pdam-kpis">
        <div className="pdam-kpi"><div className="lab">Завершено</div><div className="val">1 142</div><div className="delta">↑ 12%</div></div>
        <div className="pdam-kpi"><div className="lab">Средний чек</div><div className="val">1 040 ₽</div></div>
      </div>
      <div className="pdam-sec">
        <div className="sh">Сделки по статусам</div>
        <div className="pdam-kv"><span className="k">Завершено</span><span className="v">1 142</span></div>
        <div className="pdam-kv"><span className="k">Идёт сейчас</span><span className="v">86</span></div>
        <div className="pdam-kv"><span className="k">Жалобы</span><span className="v" style={{color:'var(--pd-warn)'}}>3</span></div>
        <div className="pdam-kv"><span className="k">Отменено</span><span className="v">41</span></div>
      </div>
      <div className="pdam-readonly">Платежи проходят между пользователями напрямую — площадка их не обрабатывает. Комиссия и выплаты появятся после монетизации.</div>
    </MShell>
  );
}
function AdminMobileReports() {
  const reps=[['#R-882','Спам / контакты','Пионы, большой букет','new'],['#R-879','Оскорбления в чате','Юля В.','review'],['#R-877','Недостоверный отзыв','к сделке #10478','new']];
  const st={new:['problem','новая'],review:['held','в работе']};
  return (
    <MShell active="more" title="Жалобы" back>
      <div className="pdam-chips"><button className="pdam-chip on">Новые + в работе</button><button className="pdam-chip">Все</button></div>
      <div className="pdam-sec">
        {reps.map((r,i)=>(
          <div className="pdam-item" key={i}>
            <span className="ic" style={{background:'var(--pd-warn-soft)',color:'var(--pd-warn)'}}>{mic(PdI.flag,'pd-i18')}</span>
            <div className="mid"><div className="t1">{r[0]} · {r[1]}</div><div className="t2">{r[2]}</div></div>
            <span className={`pda-badge ${st[r[3]][0]}`} style={{fontSize:11}}>{st[r[3]][1]}</span>
          </div>
        ))}
      </div>
    </MShell>
  );
}

export {
  AdminMobileLogin,
  AdminMobileDash,
  AdminMobileMod,
  AdminMobileModReject,
  AdminMobileDeals,
  AdminMobileDealCancel,
  AdminMobileDispute,
  AdminMobileFraud,
  AdminMobileFraudDrill,
  AdminMobileMore,
  AdminMobileUsers,
  AdminMobileUserDrill,
  AdminMobileBlock,
  AdminMobileListings,
  AdminMobileFinance,
  AdminMobileReports
};
