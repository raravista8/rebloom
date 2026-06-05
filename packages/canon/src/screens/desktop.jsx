// @rebloom/canon · screens/desktop.jsx
// Converted from design source pd-scr-desktop.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PD_FRESH, PD_LIKED, PdAvatar, PdCard, PdFreshness, PdIc, PdLikeBtn, pdMoney } from "../feed/feed";
import { PdBtn, PdBubble, PdField, PdGallery, PdI, PdInput, PdNotice, PdSeg, PdSizeSel, PdStars, PdStepper } from "../primitives/kit";

// pd-scr-desktop.jsx — «Передарим» десктопные клиентские экраны (адаптив web).
// Reuse shared kit. Exports Listing/Profile/Deal/Sell/Notifications/Search desktop.

const wic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});

function WebShell({ active, children }) {
  const Bell=(p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
  return (
    <div className="pd-root pd-web" data-pd-theme="a">
      <header className="pdw-nav">
        <div className="pdw-nav-in">
          <span className="pd-brand pdw-brand">Передарим</span>
          <div className="pdw-navmid">
            <button className="pd-city pdw-city">{wic(PdIc.pin,'pd-i16')}Москва{wic(PdIc.chev,'pd-i14')}</button>
            <div className="pd-search pdw-search">{wic(PdIc.search,'pd-i18')}<span className="pd-search-ph">Поиск свежих букетов в Москве</span></div>
          </div>
          <nav className="pdw-navright">
            <button className="pdw-iconbtn">{wic(Bell,'pd-i20')}</button>
            <button className="pdw-iconbtn">{wic(PdIc.deals,'pd-i20')}</button>
            <span className="pdw-avatar">М</span>
            <button className="pdw-cta">{wic(PdIc.plus,'pd-i18')}Продать букет</button>
          </nav>
        </div>
      </header>
      <main className="pd-scroll pdw-scroll">{children}</main>
    </div>
  );
}
const Back = ({ children }) => <button className="pdw-back">{wic(PdI.back,'pd-i16')}{children}</button>;

// ── Карточка букета (desktop) ───────────────────────────────────────────────
function ListingDesktop() {
  const ph=['1561181286-d3fee7d55364','1567418938902-aa650a3eb346','1581938165093-050aeb5ef218'];
  return (
    <WebShell>
      <div className="pdw-detailwrap">
        <Back>Свежие букеты Москвы</Back>
        <div className="pdw-2col">
          <div className="pdw-gallery">
            <div className="hero"><img src={`img/${ph[0]}.jpg`} alt=""/></div>
            <div className="pdw-thumbs">{ph.map((p,i)=><div className={`t${i===0?' on':''}`} key={p}><img src={`img/${p}.jpg`} alt=""/></div>)}</div>
            <div className="pdw-card" style={{marginTop:8}}>
              <div className="pd-label" style={{marginBottom:8}}>Описание</div>
              <p style={{fontSize:14.5,lineHeight:1.6}}>Подарили утром на день рождения: пионовидные розы и эвкалипт, очень свежие, стоят в воде. Отдаю недорого, жалко выбрасывать. Заберите сегодня 🌿</p>
            </div>
          </div>
          <div className="pdw-buy">
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span className="price">{pdMoney(990)}</span><PdLikeBtn liked count={47}/>
            </div>
            <div className="pd-chiprow" style={{margin:'14px 0'}}><PdFreshness kind="today"/><span className="pd-chip" style={{pointerEvents:'none'}}>Размер M · 7–15 шт.</span></div>
            <div style={{display:'flex',alignItems:'center',gap:5,color:'var(--pd-muted)',fontSize:13.5}}>{wic(PdIc.pin,'pd-i16')}Москва · Патрики</div>
            <div className="pdw-sellerrow">
              <PdAvatar seller={{n:'Аня',av:'w1'}} size={44}/>
              <div style={{flex:1}}><div style={{fontWeight:700}}>Аня</div><div style={{display:'flex',alignItems:'center',gap:5,color:'var(--pd-muted)',fontSize:12.5,marginTop:2}}><PdStars value={5}/>4,9 · 23 сделки</div></div>
              {wic(PdI.fwd,'pd-i18')}
            </div>
            <div className="pd-label" style={{marginBottom:8}}>Как забрать</div>
            <div style={{display:'flex',alignItems:'center',gap:11,padding:'13px 14px',border:'1px solid var(--pd-border)',borderRadius:14}}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--pd-primary)',flex:'none'}}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>Самовывоз рядом</div>
                <div style={{fontSize:12.5,color:'var(--pd-muted)',marginTop:1}}>Заберёте букет у продавца — обычно двор или метро поблизости</div>
              </div>
            </div>
            <div style={{margin:'16px 0'}}><PdNotice kind="ok" icon={PdI.shield}><b>Безопасная сделка.</b> Деньги в эскроу. Продавец получит их после подтверждения получения.</PdNotice></div>
            <div style={{display:'flex',gap:10}}>
              <PdBtn variant="secondary" style={{flex:1}}>Предложить цену</PdBtn>
              <PdBtn variant="primary" icon={PdI.cart} style={{flex:1.4}}>Купить · {pdMoney(990)}</PdBtn>
            </div>
          </div>
        </div>
      </div>
    </WebShell>
  );
}

// ── Профиль продавца (desktop) ──────────────────────────────────────────────
function ProfileDesktop() {
  const reviews=[
    {n:'Марина',av:'w2',r:5,tm:'2 дня назад',t:'Букет был свежий, как на фото. Аня всё рассказала, встретились у метро, очень удобно. Спасибо!'},
    {n:'Катя',av:'w4',r:5,tm:'неделю назад',t:'Прекрасные розы, простояли ещё 5 дней. Рекомендую!'},
  ];
  return (
    <WebShell>
      <div className="pdw-detailwrap">
        <Back>Назад</Back>
        <div className="pdw-prof">
          <span className="big"><img src="img/av/w1.jpg" alt=""/></span>
          <div style={{flex:1}}>
            <h2>Аня</h2>
            <div style={{display:'flex',alignItems:'center',gap:6,marginTop:5}}><PdStars value={5}/><b>4,9</b><span style={{color:'var(--pd-muted)',fontSize:13}}>· 23 сделки</span></div>
            <div className="pdw-statrow"><span><b>12</b> объявлений</span><span><b>с 2025</b> на площадке</span><span><b>97%</b> сделок без спора</span></div>
          </div>
          <PdBtn variant="secondary">Пожаловаться</PdBtn>
        </div>
        <div className="pd-sechead" style={{padding:'4px 0 16px'}}><div><div className="pd-sectitle" style={{fontSize:20}}>Активные объявления</div></div></div>
        <div className="pdw-grid">{PD_FRESH.slice(0,4).map(d=><PdCard d={d} variant="grid" key={d.id}/>)}</div>
        <div className="pd-sechead" style={{padding:'24px 0 16px'}}><div><div className="pd-sectitle" style={{fontSize:20}}>Отзывы</div><div className="pd-secsub">23 отзыва · 4,9 ★</div></div></div>
        <div className="pdw-twocol">{reviews.map((rv,i)=>(
          <div className="pdw-card" key={i}>
            <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:8}}><PdAvatar seller={rv} size={30}/><span style={{fontWeight:700,fontSize:14}}>{rv.n}</span><PdStars value={rv.r}/><span style={{marginLeft:'auto',fontSize:12,color:'var(--pd-muted)'}}>{rv.tm}</span></div>
            <p style={{fontSize:14,lineHeight:1.55}}>{rv.t}</p>
          </div>
        ))}</div>
      </div>
    </WebShell>
  );
}

// ── Сделка + чат (desktop) ──────────────────────────────────────────────────
function DealDesktop() {
  return (
    <WebShell>
      <div className="pdw-detailwrap">
        <Back>Мои сделки</Back>
        <div className="pdw-deal">
          <div>
            <div className="pdw-card">
              <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:16}}>
                <img src="img/1561181286-d3fee7d55364.jpg" alt="" style={{width:64,height:64,borderRadius:14,objectFit:'cover'}}/>
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>Букет M · Патрики</div><div style={{fontSize:13,color:'var(--pd-muted)',marginTop:2}}>Продавец Аня · 4,9 ★</div></div>
                <div style={{textAlign:'right'}}><div className="pd-price" style={{fontSize:20}}>{pdMoney(990)}</div><div style={{fontSize:12,color:'var(--pd-muted)'}}>в эскроу</div></div>
              </div>
              <PdStepper status="paid_held"/>
              <div style={{margin:'16px 0'}}><PdNotice kind="ok" icon={PdI.shield}><b>Деньги в безопасности.</b> Аня получит {pdMoney(900)} после подтверждения. Комиссия {pdMoney(90)}.</PdNotice></div>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',border:'1px solid var(--pd-border)',borderRadius:13}}>
                {wic(PdI.walk,'pd-i20 ')}<div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>Самовывоз · м. Маяковская</div><div style={{fontSize:12,color:'var(--pd-muted)'}}>Двор, Тверская 12, после оплаты</div></div>
              </div>
              <div style={{display:'flex',gap:10,marginTop:16}}>
                <PdBtn variant="secondary" icon={PdI.alert} style={{flex:1}}>Проблема</PdBtn>
                <PdBtn variant="primary" icon={PdI.check} style={{flex:1.5}}>Подтвердить получение</PdBtn>
              </div>
            </div>
          </div>
          <div className="pdw-chatcard">
            <div style={{padding:'13px 16px',borderBottom:'1px solid var(--pd-border)',fontWeight:700,fontSize:14}}>Чат сделки · Аня</div>
            <div className="pd-chat">
              <PdBubble kind="sys">Оплата прошла · {pdMoney(990)} в эскроу</PdBubble>
              <PdBubble kind="in" time="17:58">Здравствуйте! Можно забрать сегодня после 18:00 🌸</PdBubble>
              <PdBubble kind="out" time="18:01">Отлично, буду к 18:30</PdBubble>
              <PdBubble kind="in" time="18:02">Двор дома по Тверской, 12. Напишу, как выйду</PdBubble>
            </div>
            <div className="pd-chatinput"><div className="pd-input" style={{flex:1,padding:'9px 14px'}}><input placeholder="Сообщение…"/></div><button className="send">{wic(PdI.send,'pd-i20')}</button></div>
          </div>
        </div>
      </div>
    </WebShell>
  );
}

// ── Продать (desktop) ───────────────────────────────────────────────────────
function SellDesktop() {
  return (
    <WebShell>
      <div className="pdw-narrow">
        <Back>Отмена</Back>
        <div className="pdw-h1">Продать букет</div>
        <p className="pdw-lead" style={{marginBottom:20}}>Опубликуется сразу и попадёт в ленту Москвы. Метаданные и геоданные уберём перед загрузкой.</p>
        <div className="pdw-card" style={{display:'flex',flexDirection:'column',gap:20}}>
          <PdField label="Фото букета" hint="1–5 фото."><div className="pd-uploader">
            <div className="pd-upcell"><img src="img/1561181286-d3fee7d55364.jpg" alt=""/><span className="cover">Обложка</span></div>
            <div className="pd-upcell"><img src="img/1567418938902-aa650a3eb346.jpg" alt=""/></div>
            <button className="pd-upadd">{wic(PdI.camera,'pd-i24')}<span>Добавить<br/>2 из 5</span></button>
          </div></PdField>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
            <PdField label="Размер"><PdSizeSel value="M"/></PdField>
            <PdField label="Цена" hint="Похожие: 700–1 300 ₽."><PdInput prefix="₽" value="990"/></PdField>
          </div>
          <PdField label="Свежесть"><PdSeg value="today" options={[{k:'today',label:'Сегодня'},{k:'d1_2',label:'1–2 дня'},{k:'d3_plus',label:'3+ дня'}]}/></PdField>
          <PdField label="Район" hint="Точный адрес виден только после оплаты."><PdInput icon={PdIc.pin} value="Москва · Патрики"/></PdField>
          <PdField label="Описание" opt="необязательно" counter="84 / 600"><PdInput textarea rows={3} value="Подарили утром, пионовидные розы и эвкалипт. Очень свежие, стоят в воде."/></PdField>
          <div><PdBtn variant="primary" lg>Опубликовать букет</PdBtn></div>
        </div>
      </div>
    </WebShell>
  );
}

// ── Уведомления (desktop) ───────────────────────────────────────────────────
function NotificationsDesktop() {
  const N=[
    {ic:PdI.check,unread:true,t:'Покупатель подтвердил получение',s:'Сделка «Букет M · Патрики» завершена · 900 ₽ в пути',tm:'5 мин'},
    {ic:PdI.heartline,unread:true,t:'Ваш букет залайкали',s:'Уже 47 лайков, он в топе «Самые залайканные»',tm:'1 ч'},
    {ic:PdIc.search,unread:false,t:'Похожий букет рядом',s:'Пионовидные розы в Патриках за 890 ₽',tm:'3 ч'},
    {ic:PdIc.star,unread:false,t:'Новый отзыв от Марины',s:'«Букет был свежий, как на фото» · 5 ★',tm:'вчера'},
  ];
  return (
    <WebShell>
      <div className="pdw-narrow">
        <div className="pdw-h1" style={{marginBottom:18}}>Уведомления</div>
        <div className="pdw-card" style={{padding:0,overflow:'hidden'}}>
          <div className="pd-list">{N.map((n,i)=>(
            <div className={`pd-row${n.unread?' unread':''}`} key={i}>
              <span className="ring">{wic(n.ic,'pd-i20')}</span>
              <div className="mid"><div className="ttl">{n.t}</div><div className="sub">{n.s}</div></div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}><span className="tm">{n.tm}</span>{n.unread&&<span className="udot"/>}</div>
            </div>
          ))}</div>
        </div>
      </div>
    </WebShell>
  );
}

// ── Поиск (desktop) ─────────────────────────────────────────────────────────
function SearchDesktop() {
  return (
    <WebShell>
      <div className="pdw-detailwrap">
        <div className="pd-search pdw-search" style={{maxWidth:560,margin:'0 0 18px'}}>{wic(PdIc.search,'pd-i18')}<span style={{color:'var(--pd-text)'}}>пионы пионовидные</span></div>
        <div className="pd-chiprow" style={{marginBottom:20}}><span className="pd-chip pd-chip--on">Фильтры · 2</span><span className="pd-chip">до 1 000 ₽</span><span className="pd-chip">Размер M</span></div>
        <div className="pd-empty" style={{height:'auto',padding:'30px 24px'}}>
          <div className="glyph">{wic(PdIc.search,'pd-i28')}</div>
          <h3>Ничего не нашлось</h3>
          <p>По запросу «пионы пионовидные» с этими фильтрами пока нет букетов.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:6}}><PdBtn variant="primary">Сбросить фильтры</PdBtn><PdBtn variant="secondary">Искать во всех городах</PdBtn></div>
        </div>
        <div className="pd-sectitle" style={{fontSize:18,margin:'8px 0 16px'}}>Похожие свежие букеты</div>
        <div className="pdw-grid">{PD_LIKED.slice(0,4).map(d=><PdCard d={d} variant="grid" key={d.id}/>)}</div>
      </div>
    </WebShell>
  );
}

export {
  ListingDesktop,
  ProfileDesktop,
  DealDesktop,
  SellDesktop,
  NotificationsDesktop,
  SearchDesktop
};
