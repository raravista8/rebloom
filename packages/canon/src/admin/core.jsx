// @rebloom/canon · admin/core.jsx
// Converted from design source pd-admin.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdIc, pdMoney } from "../feed/feed";
import { PdBtn, PdI } from "../primitives/kit";

// pd-admin.jsx — админ-панель оператора (desktop): Обзор (KPI) + Модерация.
// Side / Spark / AdminShell / Toast are exported for the other admin view files.

const aic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});

function Side({ active }) {
  const items=[
    ['dash','Обзор',PdIc.home,null],['users','Пользователи',PdIc.user,null],
    ['list','Объявления',PdIc.search,null],['deals','Сделки',PdIc.deals,null],
    ['fin','Финансы',PdI.wallet,null],['fraud','Антифрод',PdI.shield,'7'],
    ['mod','Модерация',PdI.alert,'12'],['reports','Жалобы',PdI.flag,'3'],
  ];
  return (
    <aside className="pda-side">
      <div className="pda-brand">Передарим · admin</div>
      {items.map(([k,l,Ic,ct])=>(
        <button key={k} className={`pda-nav${active===k?' on':''}`}>{Ic({className:'pd-i18',fill:'none',stroke:'currentColor'})}{l}{ct&&<span className="ct">{ct}</span>}</button>
      ))}
      <div className="pda-side-foot"><span className="av">О</span><div style={{fontSize:12.5}}><div style={{fontWeight:600}}>Оператор</div><div style={{color:'var(--pd-muted)',fontSize:11}}>moderator</div></div></div>
    </aside>
  );
}
const Spark = ({ pts, color })=>(
  <svg className="pda-spark" viewBox="0 0 100 34" preserveAspectRatio="none" style={{width:'100%',height:34}}>
    <polyline points={pts} fill="none" stroke={color||'var(--pd-primary)'} strokeWidth="2.5" vectorEffect="non-scaling-stroke"/>
  </svg>
);

// Shared shell: sidebar + main with top bar. `overlay` renders drill/modal/toast.
function AdminShell({ active, title, top, overlay, children }) {
  return (
    <div className="pda-app" style={{position:'relative'}}>
      <Side active={active}/>
      <div className="pda-main">
        <div className="pda-top">
          <h1>{title}</h1>
          {top}
          <span className="pda-2fa" style={top?undefined:{marginLeft:'auto'}}>{aic(PdI.lock,'pd-i13')}2FA · действия в audit-log</span>
        </div>
        <div className="pda-body">{children}</div>
      </div>
      {overlay}
    </div>
  );
}
// Toast (bottom-right)
function AdminToast({ kind='ok', children }) {
  return <div className="pd-toast" style={{position:'absolute',right:24,bottom:24,zIndex:80}}>{aic(kind==='ok'?PdI.check:PdI.alert,'pd-i18')}{children}</div>;
}


function AdminDashboard() {
  const kpis=[
    {lab:'Онлайн сейчас',val:'342',d:'+5%',up:true,sp:'0,28 14,24 28,26 42,18 56,20 70,12 84,14 100,8'},
    {lab:'DAU / MAU',val:'4 870',sub:'/ 51 200',d:'+8%',up:true,sp:'0,30 16,26 32,22 48,24 64,16 80,14 100,9'},
    {lab:'Оборот сделок',val:'3,24 млн ₽',d:'+14%',up:true,sp:'0,32 16,28 32,24 48,20 64,17 80,11 100,7'},
    {lab:'Сделок за месяц',val:'1 142',d:'+12%',up:true,sp:'0,31 16,27 32,25 48,19 64,16 80,12 100,8'},
  ];
  const months=['Янв','Фев','Мар','Апр','Май','Июн'];
  const dataW=[40,52,60,72,84,96], dataA=[26,30,40,52,64,78];
  const max=180;
  const cities=[['Москва',2870,'var(--pd-primary)'],['Санкт-Петербург',1120,'#5B8C68'],['Новосибирск',430,'#D29A33'],['Екатеринбург',310,'#9B7BB8']];
  const cmax=2870;
  const deals=[
    ['Марина → Аня','Москва',990,90,'done'],['Катя → Лена','Москва',1190,107,'meeting'],
    ['Соня → Юля','СПб',850,76,'problem'],['Вера → Ольга','Казань',590,53,'done'],
  ];
  const DEAL_LBL={done:'завершена',meeting:'идёт',problem:'жалоба'};
  return (
    <div className="pda-app">
      <Side active="dash"/>
      <div className="pda-main">
        <div className="pda-top">
          <h1>Обзор</h1>
          <div className="pda-period"><button>День</button><button>Неделя</button><button className="on">Месяц</button><button>Период</button></div>
          <span className="pda-2fa">{PdI.lock({className:'pd-i13',fill:'none',stroke:'currentColor'})}2FA · доступ логируется</span>
        </div>
        <div className="pda-body">
          <div className="pda-kpis">
            {kpis.map((k,i)=>(
              <div className="pda-kpi" key={i}>
                <div className="lab">{k.lab}</div>
                <div className="val">{k.val}{k.sub&&<span style={{fontSize:15,color:'var(--pd-muted)',fontWeight:600}}> {k.sub}</span>}</div>
                {k.d&&<div className={`delta ${k.up?'up':'down'}`}>↑ {k.d} к прошлому периоду</div>}
                <Spark pts={k.sp} color={i>=2?'#5B8C68':'var(--pd-primary)'}/>
              </div>
            ))}
          </div>
          <div className="pda-row2">
            <div className="pda-panel">
              <h3>Прирост пользователей</h3>
              <div className="psub">Новые регистрации по месяцам · web vs приложение</div>
              <div className="pda-bars">
                {months.map((m,i)=>(
                  <div className="b" key={m}>
                    <div className="bset">
                      <div className="bar" style={{height:(dataA[i]/max*100)+'%',background:'var(--pd-surface-3)'}}/>
                      <div className="bar" style={{height:(dataW[i]/max*100)+'%',background:'var(--pd-primary)'}}/>
                    </div>
                    <div className="t">{m}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:16,marginTop:14,fontSize:12,color:'var(--pd-muted)'}}>
                <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i style={{width:10,height:10,borderRadius:3,background:'var(--pd-primary)'}}/>Web</span>
                <span style={{display:'inline-flex',alignItems:'center',gap:6}}><i style={{width:10,height:10,borderRadius:3,background:'var(--pd-surface-3)'}}/>Приложение (iOS+Android)</span>
              </div>
            </div>
            <div className="pda-panel">
              <h3>Пользователи по городам</h3>
              <div className="psub">Топ-4 из 10 городов</div>
              <div className="pda-legend">
                {cities.map(([n,v,c])=>(
                  <div className="pda-leg" key={n}>
                    <span className="dot" style={{background:c}}/>
                    <span className="nm">{n}</span>
                    <span className="vl">{v.toLocaleString('ru-RU').replace(/,/g,' ')}</span>
                    <span className="track"><i style={{width:(v/cmax*100)+'%',background:c}}/></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pda-panel" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'16px 18px 12px'}}><h3>Последние сделки</h3><div className="psub" style={{margin:0}}>Суммы сделок в ₽</div></div>
            <table className="pda-table">
              <thead><tr><th>Участники</th><th>Город</th><th>Сумма</th><th>Статус</th></tr></thead>
              <tbody>{deals.map((d,i)=>(
                <tr key={i}><td>{d[0]}</td><td>{d[1]}</td><td style={{fontWeight:700}}>{pdMoney(d[2])}</td>
                  <td><span className={`pda-badge ${d[4]}`}>{DEAL_LBL[d[4]]}</span></td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Модерация — РЕАКТИВНАЯ очередь кейсов на живом контенте (ML-риск / жалобы / антифрод), а не весь поток
function AdminModeration() {
  const cards=[
    {photo:'1565695951564-007d8f297e48',type:'Объявление',seller:'Катя',reason:'ML-риск: возможно лицо на фото',txt:'Большой букет пионов, очень свежий. Самовывоз сегодня.'},
    {photo:'1531120364508-a6b656c3e78d',type:'Объявление',seller:'Юля',reason:'Жалоба: контакт в описании',txt:'Свежие розы, пишите для деталей…'},
    {photo:null,type:'Отзыв',seller:'Аноним → Лена',reason:'Антифрод: подозрение на накрутку',txt:'«…» · текст скрыт до решения модератора'},
  ];
  return (
    <div className="pda-app">
      <Side active="mod"/>
      <div className="pda-main">
        <div className="pda-top">
          <h1>Модерация</h1>
          <span className="pda-2fa" style={{marginLeft:'auto'}}>{PdI.lock({className:'pd-i13',fill:'none',stroke:'currentColor'})}2FA · действия в audit-log</span>
        </div>
        <div className="pda-body">
          <div className="pda-filter">
            <div className="pda-srch">{PdIc.search({className:'pd-i16',fill:'none',stroke:'currentColor'})}Поиск по очереди</div>
            <button className="pd-chip pd-chip--on">ML-риск · 5</button>
            <button className="pd-chip">Жалобы · 4</button>
            <button className="pd-chip">Антифрод · 2</button>
            <button className="pd-chip">Апелляции · 1</button>
            <span style={{marginLeft:'auto',fontSize:13,color:'var(--pd-muted)',fontWeight:600}}>Реактивная очередь · контент живой, не весь поток</span>
          </div>
          <div className="pda-modgrid">
            {cards.map((c,i)=>(
              <div className="pda-modcard" key={i}>
                <div className="ph">
                  {c.photo ? <img src={`img/${c.photo}.jpg`} alt=""/> : <div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--pd-faint)'}}>{PdI.alert({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>}
                  <span className="tag">на ревью · живое</span>
                </div>
                <div className="bd">
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <b style={{fontSize:13.5}}>{c.type} · {c.seller}</b>
                    <span className="pda-flag">{PdI.alert({className:'pd-i13',fill:'none',stroke:'currentColor'})}{c.reason}</span>
                  </div>
                  <p style={{fontSize:13,color:'var(--pd-muted)',lineHeight:1.45,margin:0}}>{c.txt}</p>
                </div>
                <div className="acts">
                  <button className="pd-btn pd-btn--secondary pda-mini-act danger" style={{flex:1}}>Снять…</button>
                  <button className="pd-btn pda-mini-act ok" style={{flex:1}}>Оставить в ленте</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  Side as AdminSide,
  AdminShell,
  AdminToast,
  aic as adminIc,
  AdminDashboard,
  AdminModeration,
  Spark as AdminSpark
};
