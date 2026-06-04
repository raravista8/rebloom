// @rebloom/canon · admin/views.jsx
// Converted from design source pd-admin-views.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { AdminShell, AdminToast } from "./core";
import { PdIc, pdMoney } from "../feed/feed";
import { PdBtn, PdI } from "../primitives/kit";

// pd-admin-views.jsx — «Передарим» админка: Пользователи, Объявления, Сделки,
// Финансы, Антифрод, Жалобы + drill-down + ConfirmDestructiveModal + states.
// Reuses AdminShell / AdminToast from pd-admin.jsx.

const vic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});
const sortI = (p)=><svg viewBox="0 0 24 24" {...p}><path d="m8 9 4-4 4 4M8 15l4 4 4-4"/></svg>;
const cross = (p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>;
const usersGl = (p)=><svg viewBox="0 0 24 24" {...p}><circle cx="9" cy="9" r="3.5"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 7a3 3 0 0 1 0 6M22 19c0-2-1.3-3.6-3.5-4.3"/></svg>;

// ── shared bits ───────────────────────────────────────────────────────────
const Sel = ({ k, v, on }) => <button className={`pda-sel${on?' on':''}`}>{k&&<span className="k">{k}:</span>}{v}{vic(PdIc.chev,'pd-i14')}</button>;
const Th = ({ children, sort, num }) => <th className={(sort?'sortable ':'')+(num?'num':'')}>{sort?<span className="so">{children}{sortI({className:'pd-i13'})}</span>:children}</th>;
const Cbx = ({ on }) => <span className={`pda-cbx${on?' on':''}`}/>;
const Risk = ({ lvl }) => { const m={hi:'высокий',md:'средний',lo:'низкий'}; return <span className={`pda-risk ${lvl}`}><span className="pda-dot" style={{background:'currentColor'}}/>{m[lvl]}</span>; };
const Pager = ({ page=1, total=8 }) => (
  <div className="pda-pager">
    <span>Показаны 1–20 из 4 870</span>
    <div style={{marginLeft:'auto',display:'flex',gap:6}}>
      <button className="pg">‹</button>
      {[1,2,3].map(n=><button key={n} className={`pg${n===page?' on':''}`}>{n}</button>)}
      <span style={{alignSelf:'center',color:'var(--pd-faint)'}}>…</span>
      <button className="pg">244</button><button className="pg">›</button>
    </div>
  </div>
);
function SkRows({ cols=6, rows=7 }) {
  return [...Array(rows)].map((_,r)=>(
    <tr key={r}>{[...Array(cols)].map((_,c)=>(
      <td key={c}><div className="pda-sk" style={{width: c===0?'70%':c===1?'50%':'40%'}}/></td>
    ))}</tr>
  ));
}
function TableState({ kind }) {
  const map = {
    empty:{ic:usersGl,h:'Пока нет данных',p:'Здесь появятся записи, как только они возникнут в системе.'},
    noresults:{ic:PdIc.search,h:'Ничего не найдено',p:'Под текущие фильтры и поиск нет совпадений. Сбросьте фильтры или измените запрос.'},
    error:{ic:PdI.alert,h:'Не удалось загрузить',p:'Сервис данных не ответил. Повторите запрос. Если ошибка повторяется, проверьте статус API.',err:true},
    offline:{ic:PdI.refresh,h:'Нет соединения',p:'Проверьте интернет. Данные обновятся автоматически при восстановлении связи.'},
  }[kind];
  return (
    <div className={`pda-state${map.err?' error':''}`}>
      <div className="gl">{vic(map.ic,'pd-i28')}</div>
      <h3>{map.h}</h3><p>{map.p}</p>
      {(kind==='error'||kind==='offline') && <div style={{marginTop:16}}><PdBtn variant="secondary" icon={PdI.refresh}>Повторить</PdBtn></div>}
      {kind==='noresults' && <div style={{marginTop:16}}><PdBtn variant="ghost">Сбросить фильтры</PdBtn></div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ПОЛЬЗОВАТЕЛИ
// ════════════════════════════════════════════════════════════════════════
const USERS = [
  ['w1.jpg','Марина К.','Москва','iOS',12,4.9,38,'2.18.··.41',null,'active','12.01.25'],
  ['w2.jpg','Аня П.','Москва','Web',3,4.7,11,'95.71.··.06',null,'active','03.02.25'],
  ['w3.jpg','Соня Л.','СПб','Android',7,4.2,19,'2.18.··.41','multi','review','21.11.24'],
  ['w4.jpg','Екатерина Л.','Москва','iOS',23,4.9,57,'176.9.··.12',null,'active','08.09.24'],
  ['w5.jpg','Юля В.','Казань','Web',1,3.6,4,'2.18.··.41','multi','blocked','15.02.25'],
  ['w6.jpg','Ольга Р.','Новосибирск','iOS',9,4.8,26,'81.30.··.77',null,'active','29.12.24'],
];
function AdminUsers({ state='loaded', bulk=false, overlay }) {
  const top = (<>
    <div className="pda-srch" style={{marginLeft:0}}>{vic(PdIc.search,'pd-i16')}Поиск по имени, телефону или ID</div>
  </>);
  return (
    <AdminShell active="users" title="Пользователи" top={top} overlay={overlay}>
      <div className="pda-fbar">
        <Sel k="Город" v="Все"/><Sel k="Статус" v="Активные" on/><Sel k="Платформа" v="Все"/>
        <Sel k="Риск" v="Любой"/><Sel v="Ещё фильтры"/>
        <span className="pda-count">4 870 пользователей · отфильтровано 312</span>
      </div>
      {bulk && <div className="pda-bulk">Выбрано: 3{` `}<span style={{opacity:.7,fontWeight:500}}>· действия применяются к выбранным</span>
        <span className="b"><button>Сообщение</button><button>В очередь антифрода</button><button className="danger">Заблокировать…</button></span></div>}
      <div className="pda-tablewrap">
        <table className="pda-table">
          <thead><tr>
            <th className="pda-check-cell"><Cbx on={bulk}/></th>
            <Th sort>Пользователь</Th><Th>Город</Th><Th>Платформа</Th>
            <Th sort num>Объявл.</Th><Th sort num>Рейтинг</Th><Th sort num>Отзывы</Th>
            <Th>Последний IP</Th><Th sort>Статус</Th><Th sort>Регистрация</Th>
          </tr></thead>
          <tbody>
            {state==='loading' && <SkRows cols={10}/>}
            {state==='loaded' && USERS.map((u,i)=>(
              <tr key={i} className={`clickable${bulk&&i<3?' sel':''}`}>
                <td className="pda-check-cell"><Cbx on={bulk&&i<3}/></td>
                <td><div className="pda-u"><span className="av"><img src={`img/av/${u[0]}`} alt=""/></span><b>{u[1]}</b></div></td>
                <td>{u[2]}</td><td>{u[3]}</td>
                <td className="num">{u[4]}</td><td className="num">{u[5]}</td><td className="num">{u[6]}</td>
                <td><span className="pda-ip">{u[7]}</span>{u[8]==='multi'&&<div className="pda-flag" style={{marginTop:3}}>{vic(PdI.alert,'pd-i12')}мульти-IP</div>}</td>
                <td><span className={`pda-badge ${u[9]}`}>{ {active:'активен',review:'на проверке',blocked:'заблокирован'}[u[9]] }</span></td>
                <td style={{color:'var(--pd-muted)'}}>{u[10]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {state==='loaded' && <Pager page={1}/>}
        {['empty','noresults','error','offline'].includes(state) && <TableState kind={state}/>}
      </div>
    </AdminShell>
  );
}

// ── User drill-down (slide-over) ───────────────────────────────────────────
function AdminUserDrill() {
  const drill = (
    <div className="pda-drill-scrim">
      <div className="pda-drill">
        <div className="pda-drill-top"><b style={{fontSize:15}}>Карточка пользователя</b>
          <span className="pda-logged">{vic(PdI.lock,'pd-i12')}доступ к ПДн логируется</span>
          <button className="x">{cross({className:'pd-i18'})}</button></div>
        <div className="pda-drill-bd">
          <div className="pda-dhdr">
            <span className="av"><img src="img/av/w4.jpg" alt=""/></span>
            <div><div className="nm">Екатерина Л. <span className="pda-badge active" style={{marginLeft:6}}>активен</span></div>
              <div className="mt">ID 48213 · Москва · iOS · регистрация 08.09.24</div>
              <div style={{marginTop:7}}><Risk lvl="lo"/></div></div>
          </div>
          <div className="pda-dactions">
            <button className="pda-mini-act">Сбросить сессии</button>
            <button className="pda-mini-act warn">Редактировать данные…</button>
            <button className="pda-mini-act danger">Заблокировать…</button>
          </div>
          <div className="pda-dsec"><h4>Контакты <span className="pda-logged" style={{marginLeft:6}}>{vic(PdI.lock,'pd-i12')}ПДн</span></h4>
            <div className="pda-kv"><span className="k">Телефон</span><span className="v">+7 999 ···-58-03</span></div>
            <div className="pda-kv"><span className="k">Email</span><span className="v">katya@ya.ru</span></div>
            <div className="pda-kv"><span className="k">Привязки</span><span className="v">Яндекс ID · VK ID</span></div>
          </div>
          <div className="pda-dsec"><h4>Активность</h4>
            <div className="pda-kv"><span className="k">Объявлений</span><span className="v">23 (4 активных)</span></div>
            <div className="pda-kv"><span className="k">Сделок</span><span className="v">57 завершено · 1 спор</span></div>
            <div className="pda-kv"><span className="k">Рейтинг</span><span className="v">4.9 · 57 отзывов</span></div>
          </div>
          <div className="pda-dsec"><h4>IP и устройства</h4>
            <div className="pda-kv"><span className="k"><span className="pda-ip">176.9.··.12</span> · iPhone 15</span><span className="v">сейчас</span></div>
            <div className="pda-kv"><span className="k"><span className="pda-ip">176.9.··.12</span> · Chrome/macOS</span><span className="v">2 ч назад</span></div>
            <div className="pda-kv"><span className="k"><span className="pda-ip">2.18.··.41</span> · Android</span><span className="v">3 дня назад</span></div>
          </div>
          <div className="pda-dsec"><h4>История действий (audit)</h4>
            <div className="pda-audit">
              <div className="pda-aud"><span className="dt muted"/><div className="ct"><b>Вход выполнен</b> · Яндекс ID<div className="when">сегодня, 14:02 · 176.9.··.12</div></div></div>
              <div className="pda-aud"><span className="dt"/><div className="ct"><b>Изменён профиль</b> оператором <i>moderator</i><div className="when">02.06.25, 11:20 · причина: запрос поддержки #1841</div></div></div>
              <div className="pda-aud"><span className="dt danger"/><div className="ct"><b>Объявление отклонено</b> · контакт в описании<div className="when">28.05.25, 09:14</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return <AdminUsers state="loaded" overlay={drill}/>;
}

// ════════════════════════════════════════════════════════════════════════
// ОБЪЯВЛЕНИЯ
// ════════════════════════════════════════════════════════════════════════
const LISTINGS = [
  ['1565695951564-007d8f297e48','Пионы, большой букет','Катя','Москва',1190,'today','active'],
  ['1531120364508-a6b656c3e78d','Свежие розы 25 шт','Юля','Казань',990,'today','flagged'],
  ['1522748906645-95d8adfd52c7','Тюльпаны микс','Соня','СПб',650,'d1_2','active'],
  ['1567696911980-2eed69a46042','Ранункулюсы','Ольга','Новосибирск',1450,'today','active'],
  ['1561181286-d3fee7d55364','Гортензия','Марина','Москва',2100,'d3_plus','sold'],
];
function AdminListings({ state='loaded' }) {
  const fresh={today:['Сегодня','var(--pd-fresh)'],d1_2:['1–2 дня','var(--pd-aging)'],d3_plus:['3+ дня','var(--pd-old)']};
  const top = <div className="pda-srch" style={{marginLeft:0}}>{vic(PdIc.search,'pd-i16')}Поиск по объявлениям</div>;
  return (
    <AdminShell active="list" title="Объявления" top={top}>
      <div className="pda-fbar">
        <Sel k="Город" v="Все"/><Sel k="Статус" v="Все"/><Sel k="Свежесть" v="Любая"/>
        <Sel k="Модерация" v="На ревью (флаг) · 9" on/>
        <span className="pda-count">1 284 объявления · публикуются сразу</span>
      </div>
      <div className="pda-tablewrap">
        <table className="pda-table">
          <thead><tr><Th>Букет</Th><Th>Продавец</Th><Th>Город</Th><Th sort num>Цена</Th><Th>Свежесть</Th><Th sort>Статус</Th><th style={{width:120}}></th></tr></thead>
          <tbody>
            {state==='loading' && <SkRows cols={7}/>}
            {state==='loaded' && LISTINGS.map((l,i)=>(
              <tr key={i} className="clickable">
                <td><div className="pda-u"><span className="av" style={{borderRadius:8,width:40,height:32}}><img src={`img/${l[0]}.jpg`} alt=""/></span><b>{l[1]}</b></div></td>
                <td>{l[2]}</td><td>{l[3]}</td><td className="num" style={{fontWeight:700}}>{pdMoney(l[4])}</td>
                <td><span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12.5}}><span className="pda-dot" style={{background:fresh[l[5]][1]}}/>{fresh[l[5]][0]}</span></td>
                <td>{l[6]==='flagged'
                  ? <span className="pda-badge held">живое · флаг</span>
                  : <span className={`pda-badge ${l[6]==='active'?'active':'sold'}`}>{ {active:'активно',sold:'продано'}[l[6]] }</span>}</td>
                <td>{l[6]==='flagged'
                  ? <div style={{display:'flex',gap:6}}><button className="pda-mini-act danger">Снять…</button><button className="pda-mini-act ok">Оставить в ленте</button></div>
                  : <button className="pda-mini-act">Открыть</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {state==='loaded' && <Pager/>}
        {['empty','noresults','error','offline'].includes(state) && <TableState kind={state}/>}
      </div>
    </AdminShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// СДЕЛКИ + ConfirmDestructiveModal
// ════════════════════════════════════════════════════════════════════════
const DEALS = [
  ['#10482','Марина → Аня','Москва',990,99,'paid_held','03.06 14:02'],
  ['#10481','Катя → Лена','Москва',1190,119,'released','03.06 12:20'],
  ['#10478','Соня → Юля','СПб',850,85,'disputed','02.06 19:41'],
  ['#10475','Вера → Ольга','Казань',590,59,'refunded','02.06 10:08'],
  ['#10470','Лиза → Ника','Москва',1450,145,'created','01.06 21:15'],
  ['#10468','Ира → Поля','Уфа',720,72,'cancelled','01.06 16:33'],
];
const DEAL_ST = {created:'создана',paid_held:'в эскроу',released:'завершена',disputed:'спор',refunded:'возврат',cancelled:'отменена'};
function AdminDeals({ state='loaded', overlay }) {
  const top = <div className="pda-srch" style={{marginLeft:0}}>{vic(PdIc.search,'pd-i16')}Поиск по сделке, участнику или ID</div>;
  return (
    <AdminShell active="deals" title="Сделки" top={top} overlay={overlay}>
      <div className="pda-fbar">
        {Object.entries(DEAL_ST).map(([k,v],i)=><Sel key={k} v={v} on={k==='disputed'}/>)}
        <span className="pda-count">GMV за период: 3,24 млн ₽</span>
      </div>
      <div className="pda-tablewrap">
        <table className="pda-table">
          <thead><tr><Th sort>ID</Th><Th>Участники</Th><Th>Город</Th><Th sort num>Сумма</Th><Th num>Комиссия</Th><Th sort>Статус</Th><Th>Создана</Th><th style={{width:160}}></th></tr></thead>
          <tbody>
            {state==='loading' && <SkRows cols={8}/>}
            {state==='loaded' && DEALS.map((d,i)=>(
              <tr key={i} className="clickable">
                <td style={{fontWeight:700}}>{d[0]}</td><td>{d[1]}</td><td>{d[2]}</td>
                <td className="num" style={{fontWeight:700}}>{pdMoney(d[3])}</td><td className="num" style={{color:'var(--pd-muted)'}}>{pdMoney(d[4])}</td>
                <td><span className={`pda-badge ${d[5]}`}>{DEAL_ST[d[5]]}</span></td>
                <td style={{color:'var(--pd-muted)'}}>{d[6]}</td>
                <td>{['paid_held','created','disputed'].includes(d[5])
                  ? <div style={{display:'flex',gap:6}}><button className="pda-mini-act warn">Заморозить</button><button className="pda-mini-act danger">Отменить…</button></div>
                  : <button className="pda-mini-act">Детали</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {state==='loaded' && <Pager/>}
        {['empty','noresults','error','offline'].includes(state) && <TableState kind={state}/>}
      </div>
    </AdminShell>
  );
}

// ConfirmDestructiveModal — idle / inflight / success
function AdminDealConfirm({ phase='confirm' }) {
  let modal;
  if (phase==='success') {
    modal = (
      <div className="pda-modal-scrim"><div className="pda-modal success">
        <div className="pda-modal-ok"><div className="gl">{vic(PdI.check,'pd-i28')}</div>
          <h3 style={{marginBottom:6}}>Сделка отменена</h3>
          <p style={{color:'var(--pd-muted)',fontSize:13.5,lineHeight:1.5}}>Возврат 990 ₽ запущен, средства вернутся покупателю по правилам эквайринга. Запись добавлена в audit-log.</p>
        </div>
        <div className="mf" style={{paddingTop:0}}><PdBtn variant="secondary" block>Закрыть</PdBtn></div>
      </div></div>
    );
  } else {
    const inflight = phase==='inflight';
    modal = (
      <div className="pda-modal-scrim"><div className="pda-modal">
        <div className="mh"><div className="gl danger">{vic(PdI.alert,'pd-i24')}</div>
          <div><h3>Отменить сделку #10482?</h3><p>Марина → Аня · 990 ₽. Сделка в эскроу. Отмена запустит возврат покупателю. Действие необратимо.</p></div></div>
        <div className="mb">
          <label className="fl">Причина отмены <span style={{color:'var(--pd-danger)'}}>*</span> · попадёт в audit-log</label>
          <textarea rows={3} defaultValue="Продавец недоступен 48 ч, букет неактуален. Обращение покупателя #1902.">{}</textarea>
          <div className="pda-4eyes">{vic(PdI.shield,'pd-i16')}Денежная операция: нужно подтверждение второго оператора (4-eyes).</div>
        </div>
        <div className="mf">
          <PdBtn variant="ghost" block disabled={inflight}>Отмена</PdBtn>
          <PdBtn variant="danger" block loading={inflight} disabled={inflight}>{inflight?'Отменяем…':'Отменить сделку'}</PdBtn>
        </div>
      </div></div>
    );
  }
  return <AdminDeals state="loaded" overlay={<>{modal}{phase==='success'&&<AdminToast>Сделка #10482 отменена · возврат запущен</AdminToast>}</>}/>;
}

// ════════════════════════════════════════════════════════════════════════
// ФИНАНСЫ
// ════════════════════════════════════════════════════════════════════════
function AdminFinance({ state='loaded' }) {
  const top = <div className="pda-period" style={{marginLeft:'auto'}}><button>День</button><button>Неделя</button><button className="on">Месяц</button><button>Период</button></div>;
  const ledger = [
    ['Эквайринг (вход)','+3 240 000','ok'],['Выплаты продавцам','−2 856 000','ok'],
    ['Комиссия площадки','+318 400','ok'],['Заморожено (споры)','−54 600','warn'],['Возвраты','−11 000','ok'],
  ];
  return (
    <AdminShell active="fin" title="Финансы" top={top}>
      {state==='loading' ? <div className="pda-finrow">{[0,1,2].map(i=><div className="pda-finbig" key={i}><div className="pda-sk" style={{width:'50%',height:14}}/><div className="pda-sk" style={{width:'70%',height:30,marginTop:12}}/></div>)}</div> : <>
      <div className="pda-finrow">
        <div className="pda-finbig accent"><div className="lab">Оборот (GMV) за месяц</div><div className="val">3,24 млн ₽</div><div className="sub">↑ 14% к прошлому месяцу</div></div>
        <div className="pda-finbig"><div className="lab">Заработок на комиссии</div><div className="val">318 400 ₽</div><div className="sub">10% от GMV · ↑ 12%</div></div>
        <div className="pda-finbig"><div className="lab">Выплачено продавцам</div><div className="val">2,86 млн ₽</div><div className="sub">1 142 выплаты</div></div>
      </div>
      <div className="pda-row2">
        <div className="pda-panel">
          <h3>Оборот и комиссия по месяцам</h3><div className="psub">₽ · разделители разрядов</div>
          <div className="pda-bars">
            {['Янв','Фев','Мар','Апр','Май','Июн'].map((m,i)=>{const g=[55,62,70,80,88,100][i],c=[50,57,64,73,80,92][i];return(
              <div className="b" key={m}><div className="bset"><div className="bar" style={{height:c+'%',background:'var(--pd-surface-3)'}}/><div className="bar" style={{height:g+'%',background:'var(--pd-primary)'}}/></div><div className="t">{m}</div></div>
            );})}
          </div>
          <div style={{display:'flex',gap:16,marginTop:14,fontSize:12,color:'var(--pd-muted)'}}>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i style={{width:10,height:10,borderRadius:3,background:'var(--pd-primary)'}}/>GMV</span>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i style={{width:10,height:10,borderRadius:3,background:'var(--pd-surface-3)'}}/>Выплаты</span>
          </div>
        </div>
        <div className="pda-panel">
          <h3>Сверка ledger</h3><div className="psub">Двойная запись · расхождения</div>
          <div style={{display:'flex',flexDirection:'column',gap:0}}>
            {ledger.map(([n,v,st],i)=>(
              <div className="pda-kv" key={i} style={{borderBottom:'1px solid var(--pd-border)',padding:'10px 0'}}>
                <span className="k">{n}</span><span className="v" style={{color:v[0]==='−'?'var(--pd-danger)':'var(--pd-text)'}}>{v} ₽</span></div>
            ))}
          </div>
          <div style={{marginTop:14,display:'flex',alignItems:'center',gap:10}}><span className="pda-recon ok">{vic(PdI.check,'pd-i13')}Сходится</span><span style={{fontSize:12,color:'var(--pd-muted)'}}>расхождение 0,00 ₽ на 03.06 15:00</span></div>
        </div>
      </div>
      <div className="pda-panel" style={{display:'flex',alignItems:'center',gap:14}}>
        <div><h3 style={{marginBottom:2}}>Экспорт за период</h3><div className="psub" style={{margin:0}}>CSV / XLSX · проводки, комиссия, выплаты, возвраты</div></div>
        <div style={{marginLeft:'auto',display:'flex',gap:9}}><PdBtn variant="secondary">Экспорт CSV</PdBtn><PdBtn variant="secondary">Экспорт XLSX</PdBtn></div>
      </div>
      </>}
    </AdminShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// АНТИФРОД + IpCluster
// ════════════════════════════════════════════════════════════════════════
function AdminFraud({ state='loaded' }) {
  const top = <div className="pda-srch" style={{marginLeft:0}}>{vic(PdIc.search,'pd-i16')}Поиск по сигналам и кластерам</div>;
  const signals = [
    {lvl:'hi',sc:92,ttl:'Мульти-аккаунты по одному IP',tags:['IP-кластер','3 аккаунта'],desc:'На IP 2.18.··.41: Соня Л., Юля В. и ещё 1 аккаунт. Взаимные лайки и отзывы между связанными аккаунтами.'},
    {lvl:'hi',sc:88,ttl:'Накрутка отзывов (self-dealing)',tags:['Отзывы','граф сделок'],desc:'Цепочка сделок по кругу между 3 аккаунтами с положительными отзывами без реальных выплат на внешние карты.'},
    {lvl:'md',sc:64,ttl:'Концентрация выплат на одну карту',tags:['Выплаты','···7781'],desc:'5 разных продавцов выводят средства на одну карту ···7781 за последние 14 дней.'},
    {lvl:'md',sc:57,ttl:'Переиспользование фото',tags:['Фото','perceptual hash'],desc:'Одинаковые фото букета в 4 активных объявлениях разных продавцов (совпадение хэша 98%).'},
    {lvl:'lo',sc:34,ttl:'Аномалия цены',tags:['Цена'],desc:'Букет за 120 ₽ при медиане категории 950 ₽, возможная приманка.'},
  ];
  return (
    <AdminShell active="fraud" title="Антифрод" top={top}>
      <div className="pda-fbar"><Sel k="Риск" v="Высокий + средний" on/><Sel k="Тип" v="Все методики"/><Sel v="За 30 дней"/>
        <span className="pda-count">Открытых сигналов: 7 · кластеров: 2</span></div>
      <div className="pda-row2" style={{gridTemplateColumns:'1.5fr 1fr'}}>
        <div className="pda-fraudgrid">
          {state==='loading' ? [0,1,2].map(i=><div className="pda-signal" key={i}><div className="pda-sk" style={{width:52,height:52,borderRadius:13}}/><div style={{flex:1}}><div className="pda-sk" style={{width:'60%',height:15}}/><div className="pda-sk" style={{width:'90%',height:12,marginTop:8}}/></div></div>)
          : signals.map((s,i)=>(
            <div className={`pda-signal ${s.lvl}`} key={i}>
              <div className="sco">{s.sc}<small>RISK</small></div>
              <div className="mid">
                <div className="ttl">{s.ttl}</div>
                <div className="desc">{s.desc}</div>
                <div style={{display:'flex',gap:6,marginTop:8}}>{s.tags.map(t=><span className="pda-tag" key={t}>{t}</span>)}</div>
                <div className="acts"><button className="pda-mini-act">В очередь</button><button className="pda-mini-act warn">Ограничить</button><button className="pda-mini-act danger">Заблокировать…</button></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pda-panel">
          <h3>Кластер по IP</h3><div className="psub">Связка аккаунтов · 2.18.··.41</div>
          <div className="pda-cluster">
            <div className="hub"><span className="ipnode">{vic(PdI.shield,'pd-i14')}2.18.··.41</span></div>
            <span className="pda-clines"/>
            <div className="nodes">
              <div className="pda-cnode flag"><span className="av"><img src="img/av/w3.jpg" alt=""/></span>Соня Л.</div>
              <div className="pda-cnode flag"><span className="av"><img src="img/av/w5.jpg" alt=""/></span>Юля В.</div>
              <div className="pda-cnode"><span className="av"><img src="img/av/w2.jpg" alt=""/></span>Аккаунт #5120</div>
            </div>
            <div style={{marginTop:14,fontSize:12,color:'var(--pd-muted)',lineHeight:1.5}}>Взаимные отзывы: 6 · общих устройств: 2 · совпадение поведения: высокое.</div>
          </div>
          <div style={{marginTop:12}}><PdBtn variant="danger" block icon={PdI.shield}>Заблокировать кластер…</PdBtn></div>
        </div>
      </div>
    </AdminShell>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ЖАЛОБЫ
// ════════════════════════════════════════════════════════════════════════
function AdminReports({ state='loaded' }) {
  const reps = [
    ['#R-882','Объявление','Пионы, большой букет','Спам / контакты в описании','Аня П.','new','5 мин назад'],
    ['#R-879','Пользователь','Юля В.','Оскорбления в чате','Лена К.','review','1 ч назад'],
    ['#R-877','Отзыв','«…» к сделке #10478','Недостоверный отзыв','Соня Л.','new','3 ч назад'],
    ['#R-870','Объявление','Свежие розы 25 шт','Несоответствие фото','Марина К.','resolved','вчера'],
  ];
  const st={new:['новая','disputed'],review:['в работе','held'],resolved:['решена','released']};
  const top = <div className="pda-srch" style={{marginLeft:0}}>{vic(PdIc.search,'pd-i16')}Поиск по жалобам</div>;
  return (
    <AdminShell active="reports" title="Жалобы пользователей" top={top}>
      <div className="pda-fbar"><Sel k="Статус" v="Новые + в работе" on/><Sel k="На что" v="Все"/><Sel k="Причина" v="Любая"/>
        <span className="pda-count">Открытых жалоб: 3</span></div>
      <div className="pda-tablewrap">
        <table className="pda-table">
          <thead><tr><Th>ID</Th><Th>На что</Th><Th>Объект</Th><Th>Причина</Th><Th>Заявитель</Th><Th sort>Статус</Th><Th>Когда</Th><th style={{width:150}}></th></tr></thead>
          <tbody>
            {state==='loading' && <SkRows cols={8}/>}
            {state==='empty' ? null : state==='loaded' && reps.map((r,i)=>(
              <tr key={i} className="clickable">
                <td style={{fontWeight:700}}>{r[0]}</td><td>{r[1]}</td><td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r[2]}</td>
                <td>{r[3]}</td><td>{r[4]}</td>
                <td><span className={`pda-badge ${st[r[5]][1]}`}>{st[r[5]][0]}</span></td>
                <td style={{color:'var(--pd-muted)'}}>{r[6]}</td>
                <td>{r[5]!=='resolved'
                  ? <div style={{display:'flex',gap:6}}><button className="pda-mini-act">Открыть</button><button className="pda-mini-act ok">Решить</button></div>
                  : <button className="pda-mini-act">Открыть</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {state==='loaded' && <Pager/>}
        {state==='empty' && <TableState kind="empty"/>}
        {['noresults','error','offline'].includes(state) && <TableState kind={state}/>}
      </div>
    </AdminShell>
  );
}

export {
  AdminUsers,
  AdminUserDrill,
  AdminListings,
  AdminDeals,
  AdminDealConfirm,
  AdminFinance,
  AdminFraud,
  AdminReports
};
