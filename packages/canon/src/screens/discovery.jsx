// @rebloom/canon · screens/discovery.jsx
// Converted from design source pd-scr-1.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PD_FRESH, PD_LIKED, PdAvatar, PdBottomNav, PdCard, PdFreshness, PdIc, PdLikeBtn, PdSectionHead, PdTopBar, pdMoney } from "../feed/feed";
import { PdBtn, PdChip, PdEmpty, PdGallery, PdI, PdNotice, PdScreen, PdSeg, PdSizeSel, PdSkelCard, PdStars } from "../primitives/kit";

// pd-scr-1.jsx — discovery screens: витрина states, карточка, поиск, профиль

const IMG = (id)=>`img/${id}.jpg`;

// 1a — витрина: загрузка (skeleton)
function VitrinaLoading() {
  return (
    <div className="pd-root" data-pd-theme="a">
      <PdTopBar safeTop={56} />
      <main className="pd-scroll">
        <PdSectionHead title="Самые свежие" sub="Куплены сегодня, рядом с вами" />
        <div className="pd-rail">{[0,1,2].map(i=><div key={i} style={{width:202}}><PdSkelCard/></div>)}</div>
        <PdSectionHead title="Самые залайканные" sub="Любимцы недели в Москве" />
        <div className="pd-grid">{[0,1,2,3].map(i=><PdSkelCard key={i}/>)}</div>
      </main>
      <PdBottomNav safeBottom={22} />
    </div>
  );
}

// 1b — витрина: пусто в городе (empty)
function VitrinaEmpty() {
  return (
    <div className="pd-root" data-pd-theme="a">
      <PdTopBar safeTop={56} />
      <main className="pd-scroll">
        <PdEmpty glyph={PdI.heartline} title="В Москве пока нет букетов"
          text="Будьте первым. Выставите букет, который вам подарили, и дайте ему вторую жизнь.">
          <PdBtn variant="primary" block icon={PdIc.plus}>Опубликовать букет</PdBtn>
          <PdBtn variant="secondary" block>Сменить город</PdBtn>
        </PdEmpty>
      </main>
      <PdBottomNav safeBottom={22} />
    </div>
  );
}

// 1c — карточка букета (loaded)
const LISTING = {
  photos:['1561181286-d3fee7d55364','1567418938902-aa650a3eb346','1581938165093-050aeb5ef218'],
  price:990, size:'M', fresh:'today', district:'Москва · Патрики', likes:47, liked:true,
  seller:{ n:'Аня', r:4.9, av:'w1', deals:23 },
};
function ListingActions() {
  return (<div style={{display:'flex',gap:4}}>
    <button className="pd-iconbtn" aria-label="Поделиться">{PdI.send({className:'pd-i20',fill:'none',stroke:'currentColor'})}</button>
    <button className="pd-iconbtn" aria-label="Пожаловаться">{PdI.flag({className:'pd-i20',fill:'none',stroke:'currentColor'})}</button>
  </div>);
}
function ListingBody({ sold }) {
  return (<>
    <div style={{position:'relative'}}>
      <PdGallery photos={LISTING.photos} count={3} idx={0} />
      {sold && <div style={{position:'absolute',inset:0,background:'rgba(35,32,27,.45)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{background:'#fff',color:'var(--pd-text)',fontWeight:700,fontSize:15,padding:'10px 18px',borderRadius:999}}>Уже продано</span>
      </div>}
    </div>
    <div style={{padding:'16px'}}>
      <div className="pd-price-row" style={{marginBottom:10}}>
        <span className="pd-price" style={{fontSize:26}}>{pdMoney(LISTING.price)}</span>
        <PdLikeBtn liked={LISTING.liked} count={LISTING.likes} />
      </div>
      <div className="pd-chiprow" style={{marginBottom:14}}>
        <PdFreshness kind="today" />
        <span className="pd-chip" style={{pointerEvents:'none'}}>Размер {LISTING.size} · 7–15 шт.</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:5,color:'var(--pd-muted)',fontSize:13.5,marginBottom:16}}>
        {PdIc.pin({className:'pd-i16',fill:'none',stroke:'currentColor'})}{LISTING.district}
      </div>

      {sold
        ? <PdNotice kind="info" icon={PdI.info}>Этот букет уже купили. Посмотрите другие свежие букеты рядом, их добавляют каждый день.</PdNotice>
        : <PdNotice kind="ok" icon={PdI.shield}><b>Безопасная сделка.</b> Деньги в эскроу ЮKassa. Продавец получит их только после того, как вы подтвердите получение.</PdNotice>}

      {/* seller */}
      <div style={{display:'flex',alignItems:'center',gap:11,padding:'14px 0',marginTop:6,borderTop:'1px solid var(--pd-border)',borderBottom:'1px solid var(--pd-border)'}}>
        <PdAvatar seller={LISTING.seller} size={44} />
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15}}>{LISTING.seller.n}</div>
          <div style={{display:'flex',alignItems:'center',gap:5,color:'var(--pd-muted)',fontSize:12.5,marginTop:2}}>
            <PdStars value={5} /> {LISTING.seller.r} · {LISTING.seller.deals} сделки
          </div>
        </div>
        {PdI.fwd({className:'pd-i18',fill:'none',stroke:'var(--pd-faint)'})}
      </div>

      {/* delivery */}
      <div style={{marginTop:16}}>
        <div className="pd-label" style={{marginBottom:8}}>Как забрать</div>
        <div style={{display:'flex',alignItems:'center',gap:11,padding:'13px 14px',border:'1px solid var(--pd-border)',borderRadius:14}}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--pd-primary)',flex:'none'}}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>Самовывоз рядом</div>
            <div style={{fontSize:12.5,color:'var(--pd-muted)',marginTop:1}}>Заберёте букет у продавца — обычно двор или метро поблизости</div>
          </div>
        </div>
        <p style={{fontSize:12.5,color:'var(--pd-muted)',marginTop:8}}>Точный адрес появится в чате после оплаты. Двор или станцию выбирает продавец.</p>
      </div>

      <div style={{marginTop:18}}>
        <div className="pd-label" style={{marginBottom:6}}>Описание</div>
        <p style={{fontSize:14,lineHeight:1.55,color:'var(--pd-text)'}}>Подарили утром на день рождения: пионовидные розы и эвкалипт, очень свежие, стоят в воде. Отдаю недорого, жалко выбрасывать. Заберите сегодня 🌿</p>
      </div>
    </div>
  </>);
}
function Listing() {
  const footer = (
    <div className="pd-footerbar">
      <div style={{display:'flex',gap:10}}>
        <PdBtn variant="secondary" style={{flex:1}}>Предложить цену</PdBtn>
        <PdBtn variant="primary" icon={PdI.cart} style={{flex:1.4}}>Купить · {pdMoney(LISTING.price)}</PdBtn>
      </div>
    </div>
  );
  return <PdScreen title="Букет" center action={<ListingActions/>} footer={footer}><ListingBody/></PdScreen>;
}
// 1d — карточка: продано / недоступно
function ListingSold() {
  const footer = (<div className="pd-footerbar"><PdBtn variant="secondary" block icon={PdI.back}>Смотреть свежие букеты</PdBtn></div>);
  return <PdScreen title="Букет" center action={<ListingActions/>} footer={footer}><ListingBody sold/></PdScreen>;
}

// 1e — поиск: ничего не найдено (no-results)
function SearchNoResults() {
  const search = (
    <div className="pd-appbar" style={{paddingTop:56}}>
      <button className="pd-iconbtn">{PdI.back({className:'pd-i22',fill:'none',stroke:'currentColor'})}</button>
      <div className="pd-search" style={{flex:1}}>
        {PdIc.search({className:'pd-i18',fill:'none',stroke:'currentColor'})}
        <span style={{color:'var(--pd-text)',fontSize:14}}>пионы пионовидные</span>
        <span style={{marginLeft:'auto'}}>{PdI.x({className:'pd-i18',fill:'none',stroke:'var(--pd-muted)'})}</span>
      </div>
    </div>
  );
  return (
    <div className="pd-root" data-pd-theme="a">
      {search}
      <div className="pd-chiprow" style={{padding:'12px 16px',borderBottom:'1px solid var(--pd-border)'}}>
        <PdChip on icon={PdIc.sliders}>Фильтры · 2</PdChip>
        <PdChip>до 1 000 ₽</PdChip>
        <PdChip>Размер M</PdChip>
      </div>
      <main className="pd-scroll">
        <PdEmpty glyph={PdIc.search} title="Ничего не нашлось"
          text="По запросу «пионы пионовидные» в Москве с этими фильтрами пока нет букетов.">
          <PdBtn variant="primary" block>Сбросить фильтры</PdBtn>
          <PdBtn variant="secondary" block>Искать во всех городах</PdBtn>
        </PdEmpty>
        <div style={{padding:'4px 16px 20px'}}>
          <div className="pd-label" style={{marginBottom:10}}>Похожие свежие букеты</div>
          <div className="pd-grid" style={{padding:0}}>
            {PD_LIKED.slice(0,2).map(d=><div className="pd-rise" key={d.id}><PdCard d={d} variant="grid"/></div>)}
          </div>
        </div>
      </main>
    </div>
  );
}

// 1f — профиль продавца
function Profile() {
  const s={ n:'Аня', r:4.9, av:'w1' };
  const reviews=[
    {n:'Марина',av:'w2',r:5,tm:'2 дня назад',t:'Букет был свежий, как на фото. Аня всё рассказала, встретились у метро, очень удобно. Спасибо!'},
    {n:'Катя',av:'w4',r:5,tm:'неделю назад',t:'Прекрасные розы, простояли ещё 5 дней. Рекомендую!'},
  ];
  return (
    <PdScreen title="Профиль" center action={<button className="pd-iconbtn">{PdI.flag({className:'pd-i20',fill:'none',stroke:'currentColor'})}</button>}>
      <div className="pd-prof">
        <span className="big"><img src={'img/av/'+s.av+'.jpg'} alt=""/></span>
        <div>
          <h2>{s.n}</h2>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}><PdStars value={5}/><b style={{fontSize:14}}>{s.r}</b><span style={{color:'var(--pd-muted)',fontSize:13}}>· 23 сделки</span></div>
          <div className="stat"><span><b>12</b> объявлений</span><span><b>с 2025</b> на площадке</span></div>
        </div>
      </div>
      <div style={{padding:'0 16px'}}><PdNotice kind="ok" icon={PdI.shield}>Проверенный продавец · 97% сделок без спора. Деньги в защищённой сделке.</PdNotice></div>
      <PdSectionHead title="Активные объявления" sub="3 свежих букета" />
      <div className="pd-grid">
        {PD_FRESH.slice(0,2).map(d=><div className="pd-rise" key={d.id}><PdCard d={d} variant="grid"/></div>)}
      </div>
      <PdSectionHead title="Отзывы" sub="23 отзыва · 4,9 ★" />
      <div>{reviews.map((rv,i)=>(
        <div className="pd-review" key={i}>
          <div className="hd"><PdAvatar seller={rv} size={28}/><span className="nm">{rv.n}</span><PdStars value={rv.r}/><span className="tm">{rv.tm}</span></div>
          <p>{rv.t}</p>
        </div>
      ))}</div>
      <div style={{height:20}}/>
    </PdScreen>
  );
}

export {
  VitrinaLoading,
  VitrinaEmpty,
  Listing,
  ListingSold,
  SearchNoResults,
  Profile
};
