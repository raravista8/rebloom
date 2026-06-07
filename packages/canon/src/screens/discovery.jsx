// @rebloom/canon · screens/discovery.jsx
// Converted from design source pd-scr-1.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdCard, PdAvatar, PdFreshness, PdLikeBtn, PdSectionHead, PdTopBar, PdBottomNav, PdIc, pdMoney, PD_FRESH, PD_LIKED, PdMetroLabel } from "../feed/feed";
import { PdI, PdBtn, PdChip, PdStars, PdNotice, PdEmpty, PdSkelCard, PdGallery, PdScreen } from "../primitives/kit";

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
  price:990, size:'M', fresh:'today', city:'Москва', metro:'Курская', district:'Басманный',
  flowers:['Пионовидные розы','Зелень и эвкалипт'], likes:47, liked:true,
  seller:{ n:'Аня', r:4.9, av:'w1', deals:23 },
};
function ListingActions() {
  return (<div style={{display:'flex',gap:6,alignItems:'center'}}>
    <button className="pd-sharebtn" aria-label="Поделиться">{PdI.share({className:'pd-i18',fill:'none',stroke:'currentColor'})}</button>
    <button className="pd-iconbtn" aria-label="Пожаловаться">{PdI.flag({className:'pd-i20',fill:'none',stroke:'currentColor'})}</button>
  </div>);
}
function SellerCard({ s }) {
  return (
    <button className="pd-sellercard">
      <PdAvatar seller={s} size={46} />
      <div className="pd-seller-main">
        <div className="pd-seller-name">Продаёт {s.n}</div>
        <div className="pd-seller-rating"><PdStars value={5} /><b>{s.r.toFixed(1).replace('.', ',')}</b><span className="lbl">рейтинг продавца</span></div>
      </div>
      <div className="pd-seller-deals"><b>{s.deals}</b><span>сделки</span></div>
      {PdI.fwd({className:'pd-i18 pd-seller-chev',fill:'none',stroke:'currentColor'})}
    </button>
  );
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
      <div className="pd-buy-meta">
        <PdFreshness kind="today" />
        <div className="pd-buy-spec"><b>Размер {LISTING.size}</b> · 7–15 стеблей</div>
        <div className="pd-buy-loc">
          <span className="loc-city">{PdIc.pin({className:'pd-i16',fill:'none',stroke:'currentColor'})}{LISTING.city}</span>
          <PdMetroLabel station={LISTING.metro} />
        </div>
      </div>

      {sold
        ? <PdNotice kind="info" icon={PdI.info}>Этот букет уже купили. Посмотрите другие свежие букеты рядом, их добавляют каждый день.</PdNotice>
        : <PdNotice kind="ok" icon={PdI.shield}><b>Оплата при встрече.</b> Договоритесь в чате и заберите букет рядом. Платите, когда увидели цветы.</PdNotice>}

      {/* продавец — явно подписан */}
      <div className="pd-label" style={{marginTop:18,marginBottom:8}}>Продавец</div>
      <SellerCard s={LISTING.seller} />

      {/* состав букета — справочно, просто текст */}
      <div style={{marginTop:18}}>
        <div className="pd-label" style={{marginBottom:8}}>Цветы в букете</div>
        <div className="pd-flowerlist">{LISTING.flowers.join(' · ')}</div>
      </div>

      {/* как забрать — ориентир по метро */}
      <div style={{marginTop:18}}>
        <div className="pd-label" style={{marginBottom:8}}>Как забрать</div>
        <div style={{display:'flex',alignItems:'center',gap:11,padding:'13px 14px',border:'1px solid var(--pd-border)',borderRadius:14}}>
          <span className="pd-mglyph" style={{width:24,height:24,fontSize:14}}>М</span>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>Самовывоз у м. {LISTING.metro}</div>
            <div style={{fontSize:13,color:'var(--pd-muted)',marginTop:1}}>Заберёте букет рядом со станцией</div>
          </div>
        </div>
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
        <PdBtn variant="primary" icon={PdI.send} style={{flex:1.4}}>Написать продавцу</PdBtn>
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
          <div className="stat"><span><b>12</b> объявлений</span><span><b>10 месяцев</b> на площадке</span></div>
        </div>
      </div>
      <div style={{padding:'0 16px'}}><PdNotice kind="ok" icon={PdI.shield}>Проверенный продавец · 97% сделок без жалоб. Реальные отзывы и рейтинг.</PdNotice></div>
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

export { VitrinaLoading, VitrinaEmpty, Listing, ListingSold, SearchNoResults, Profile };
