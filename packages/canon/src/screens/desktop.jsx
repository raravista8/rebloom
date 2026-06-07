// @rebloom/canon · screens/desktop.jsx
// Converted from design source pd-scr-desktop.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdCard, PdAvatar, PdFreshness, PdLikeBtn, PdIc, PdHeart, pdMoney, PD_FRESH, PD_LIKED, PdMetroLabel } from "../feed/feed";
import { PdI, PdBtn, PdField, PdInput, PdSeg, PdSizeSel, PdStepper, PdBubble, PdStars, PdNotice, PdMetroPicker, PdFlowerPicker } from "../primitives/kit";

// ── brand mark «Соцветие» — лепестки = currentColor (подхватывают тему), центр янтарный
const PETAL = 'M50 50C38 41 36 21 50 10C64 21 62 41 50 50Z';
const Mark = ({ size=22, center='#E8A93B', style, className, title='Передарим' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} style={{ display:'block', flex:'none', ...style }}>
    {[0,72,144,216,288].map((a)=><path key={a} d={PETAL} fill="currentColor" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="8" fill={center}/>
  </svg>
);

// pd-scr-desktop.jsx — «Передарим» десктопные клиентские экраны (адаптив web).
// Reuse shared kit. Exports Listing/Profile/Deal/Sell/Notifications/Search desktop.
const wic = (Fn,cls='pd-i18')=>Fn({className:cls,fill:'none',stroke:'currentColor'});

function WebShell({ active, children }) {
  const Bell=(p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
  const Heart=(p)=>PdHeart({className:p.className});
  return (
    <div className="pd-root pd-web" data-pd-theme="a">
      <header className="pdw-nav">
        <div className="pdw-nav-in">
          <span className="pd-brand pdw-brand"><Mark size={24} />Передарим</span>
          <div className="pdw-navmid">
            <button className="pd-city pdw-city">{wic(PdIc.pin,'pd-i16')}Москва{wic(PdIc.chev,'pd-i14')}</button>
            <div className="pd-search pdw-search">{wic(PdIc.search,'pd-i18')}<span className="pd-search-ph">Поиск свежих букетов в Москве</span></div>
          </div>
          <nav className="pdw-navright">
            <button className="pdw-iconbtn" aria-label="Уведомления">{wic(Bell,'pd-i20')}</button>
            <button className="pdw-iconbtn" aria-label="Избранное">{wic(Heart,'pd-i20')}</button>
            <span className="pdw-avatar">М</span>
            <button className="pdw-cta">{wic(PdIc.plus,'pd-i18')}Опубликовать букет</button>
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
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
              <span className="price">{pdMoney(990)}</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <button className="pd-sharebtn" aria-label="Поделиться">{PdI.share({className:'pd-i18',fill:'none',stroke:'currentColor'})}</button>
                <PdLikeBtn liked count={47}/>
              </div>
            </div>
            <div className="pd-buy-meta">
              <PdFreshness kind="today"/>
              <div className="pd-buy-spec"><b>Размер M</b> · 7–15 стеблей</div>
              <div className="pd-buy-loc">
                <span className="loc-city">{wic(PdIc.pin,'pd-i16')}Москва</span>
                <PdMetroLabel station="Курская"/>
              </div>
            </div>
            <div className="pd-label" style={{margin:'18px 0 8px'}}>Продавец</div>
            <button className="pd-sellercard">
              <PdAvatar seller={{n:'Аня',av:'w1'}} size={46}/>
              <div className="pd-seller-main">
                <div className="pd-seller-name">Продаёт Аня</div>
                <div className="pd-seller-rating"><PdStars value={5}/><b>4,9</b><span className="lbl">рейтинг продавца</span></div>
              </div>
              <div className="pd-seller-deals"><b>23</b><span>сделки</span></div>
              {wic(PdI.fwd,'pd-i18 pd-seller-chev')}
            </button>
            <div className="pd-label" style={{margin:'18px 0 8px'}}>Цветы в букете</div>
            <div className="pd-flowerlist">{['Пионовидные розы','Зелень и эвкалипт'].join(' · ')}</div>
            <div className="pd-label" style={{margin:'18px 0 8px'}}>Как забрать</div>
            <div style={{display:'flex',alignItems:'center',gap:11,padding:'13px 14px',border:'1px solid var(--pd-border)',borderRadius:14}}>
              <span className="pd-mglyph" style={{width:24,height:24,fontSize:14}}>М</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>Самовывоз у м. Курская</div>
                <div style={{fontSize:13,color:'var(--pd-muted)',marginTop:1}}>Заберёте букет рядом со станцией</div>
              </div>
            </div>
            <div style={{margin:'16px 0'}}><PdNotice kind="ok" icon={PdI.shield}><b>Оплата при встрече.</b> Договоритесь в чате и заберите букет рядом. Платите, когда увидели цветы.</PdNotice></div>
            <div style={{display:'flex',gap:10}}>
              <PdBtn variant="secondary" style={{flex:1}}>Предложить цену</PdBtn>
              <PdBtn variant="primary" icon={PdI.send} style={{flex:1.4}}>Написать продавцу</PdBtn>
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
            <div className="pdw-statrow"><span><b>12</b> объявлений</span><span><b>10 месяцев</b> на площадке</span><span><b>97%</b> сделок без жалоб</span></div>
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
                <div style={{flex:1}}><div style={{fontWeight:700,fontSize:16}}>Букет M</div><div style={{fontSize:13,color:'var(--pd-muted)',marginTop:2}}>Продавец Аня · 4,9 ★</div></div>
                <div style={{textAlign:'right'}}><div className="pd-price" style={{fontSize:20}}>{pdMoney(990)}</div><div style={{fontSize:12,color:'var(--pd-muted)'}}>договорились</div></div>
              </div>
              <PdStepper status="meeting"/>
              <div style={{margin:'16px 0'}}><PdNotice kind="ok" icon={PdI.shield}><b>Оплата при встрече.</b> Договоритесь о времени, заберите букет и расплатитесь на месте.</PdNotice></div>
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',border:'1px solid var(--pd-border)',borderRadius:13}}>
                {wic(PdI.walk,'pd-i20 ')}<div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>Самовывоз · м. Маяковская</div><div style={{fontSize:12,color:'var(--pd-muted)'}}>Двор, Тверская 12, после договорённости</div></div>
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
              <PdBubble kind="sys">Чат сделки открыт · договоритесь о встрече</PdBubble>
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
  const [metro,setMetro]=React.useState('Маяковская');
  const [flowers,setFlowers]=React.useState(['Пионовидные розы','Зелень и эвкалипт']);
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
            <PdField label="Цена"><PdInput prefix="₽" value="990"/></PdField>
          </div>
          <PdField label="Когда букет подарили" hint="От этого дня считаем свежесть — её увидят в теге букета."><PdSeg value="today" options={[{k:'today',label:'Сегодня'},{k:'d1_2',label:'1–2 дня'},{k:'d3_plus',label:'3+ дня'}]}/></PdField>
          <PdField label="Станция метро" hint="Главный ориентир для покупателя в Москве. Точный адрес — в чате после договорённости.">
            <PdMetroPicker cityKey="msk" value={metro} onChange={setMetro}/>
          </PdField>
          <PdField label="Какие цветы" opt="необязательно" hint="Помогает покупателю найти букет в фильтрах по типу цветов.">
            <PdFlowerPicker value={flowers} onChange={setFlowers}/>
          </PdField>
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
    {ic:PdI.check,unread:true,t:'Сделка завершена',s:'«Букет M · Патрики», покупатель подтвердил получение',tm:'5 мин'},
    {ic:PdI.heartline,unread:true,t:'Ваш букет залайкали',s:'уже 47 лайков, он в топе «Самые залайканные»',tm:'1 ч'},
    {ic:PdIc.search,unread:false,t:'Похожий букет рядом',s:'пионовидные розы в Патриках за 890 ₽',tm:'3 ч'},
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

export { ListingDesktop, ProfileDesktop, DealDesktop, SellDesktop, NotificationsDesktop, SearchDesktop };
