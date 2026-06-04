// @rebloom/canon · screens/deal-notifications.jsx
// Converted from design source pd-scr-3.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdAvatar, PdIc, pdMoney } from "../feed/feed";
import { PdBtn, PdBubble, PdField, PdI, PdInput, PdNotice, PdScreen, PdStars, PdStepper } from "../primitives/kit";

// pd-scr-3.jsx — Сделка (paid_held / disputed / released), оплата-сбой, отзыв, уведомления, offline

const IMG3 = (id)=>`img/${id}.jpg`;

const DealMini = ({ status }) => (
  <div style={{display:'flex',alignItems:'center',gap:11,padding:'12px 16px',borderBottom:'1px solid var(--pd-border)',background:'var(--pd-surface)'}}>
    <img src={IMG3('1561181286-d3fee7d55364')} alt="" style={{width:48,height:48,borderRadius:12,objectFit:'cover'}}/>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontWeight:700,fontSize:14}}>Букет M · Патрики</div>
      <div style={{fontSize:12.5,color:'var(--pd-muted)',marginTop:2}}>Продавец Аня · 4,9 ★</div>
    </div>
    <div style={{textAlign:'right'}}>
      <div className="pd-price" style={{fontSize:16}}>{pdMoney(990)}</div>
      <div style={{fontSize:11,color:'var(--pd-muted)'}}>{status}</div>
    </div>
  </div>
);

function ChatInput() {
  return <div className="pd-chatinput">
    <div className="pd-input" style={{flex:1,padding:'9px 14px'}}><input placeholder="Сообщение…"/></div>
    <button className="send">{PdI.send({className:'pd-i20',fill:'none',stroke:'currentColor'})}</button>
  </div>;
}

// 3a — Сделка: оплачено, деньги в эскроу (paid_held)
function DealPaidHeld() {
  const footer = (<div className="pd-footerbar"><div style={{display:'flex',gap:10}}>
    <PdBtn variant="secondary" icon={PdI.alert} style={{flex:1}}>Проблема</PdBtn>
    <PdBtn variant="primary" icon={PdI.check} style={{flex:1.5}}>Подтвердить получение</PdBtn>
  </div></div>);
  return (
    <PdScreen title="Сделка" center footer={footer}>
      <div style={{padding:'14px 16px 4px'}}><PdStepper status="paid_held"/></div>
      <DealMini status="в эскроу"/>
      <div style={{padding:'14px 16px'}}><PdNotice kind="ok" icon={PdI.shield}><b>Деньги в безопасности.</b> Аня получит {pdMoney(900)} после того, как вы подтвердите получение. Комиссия площадки {pdMoney(90)}.</PdNotice></div>
      <div style={{padding:'0 16px'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',border:'1px solid var(--pd-border)',borderRadius:13}}>
          {PdI.walk({className:'pd-i20',fill:'none',stroke:'var(--pd-primary)'})}
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>Самовывоз · м. Маяковская</div><div style={{fontSize:12,color:'var(--pd-muted)'}}>Двор, Тверская 12, появился после оплаты</div></div>
        </div>
      </div>
      <div className="pd-chat">
        <PdBubble kind="sys">Оплата прошла · {pdMoney(990)} в эскроу</PdBubble>
        <PdBubble kind="in" time="17:58">Здравствуйте! Можно забрать сегодня после 18:00 🌸</PdBubble>
        <PdBubble kind="out" time="18:01">Отлично, буду к 18:30</PdBubble>
        <PdBubble kind="in" time="18:02">Двор дома по Тверской, 12. Напишу, как выйду</PdBubble>
      </div>
      <ChatInput/>
    </PdScreen>
  );
}

// 3b — Сделка: спор (disputed)
function DealDisputed() {
  const footer = (<div className="pd-footerbar"><div style={{display:'flex',gap:10}}>
    <PdBtn variant="secondary" style={{flex:1}}>Отозвать спор</PdBtn>
    <PdBtn variant="primary" icon={PdI.image} style={{flex:1}}>Добавить фото</PdBtn>
  </div></div>);
  return (
    <PdScreen title="Спор по сделке" center footer={footer}>
      <div style={{padding:'14px 16px 4px'}}><PdStepper status="disputed"/></div>
      <DealMini status="заморожено"/>
      <div style={{padding:'14px 16px'}}><PdNotice kind="warn" icon={PdI.clock}><b>На рассмотрении.</b> Деньги заморожены. Поддержка ответит в течение 24 часов, осталось ~21 ч.</PdNotice></div>
      <div className="pd-chat">
        <PdBubble kind="sys">Открыт спор · 12 июня, 14:20 · причина: «не соответствует»</PdBubble>
        <div style={{alignSelf:'flex-end',maxWidth:'78%'}}>
          <img src={IMG3('1583228858294-6745cb25969e')} alt="" style={{width:140,borderRadius:14,display:'block',marginBottom:4,marginLeft:'auto'}}/>
          <PdBubble kind="out" time="14:21">Букет завял к вечеру, лепестки осыпались</PdBubble>
        </div>
        <PdBubble kind="sys">Поддержка «Передарим» подключилась</PdBubble>
        <PdBubble kind="in" time="14:35"><b style={{color:'var(--pd-primary)'}}>Поддержка</b><br/>Здравствуйте! Изучаем фото. Ответим с решением в течение 24 часов.</PdBubble>
      </div>
      <ChatInput/>
    </PdScreen>
  );
}

// 3c — Сделка: завершено (released)
function DealReleased() {
  const footer = (<div className="pd-footerbar"><PdBtn variant="primary" block lg icon={PdIc.star}>Оценить продавца</PdBtn></div>);
  return (
    <PdScreen title="Сделка" center footer={footer}>
      <div style={{padding:'14px 16px 4px'}}><PdStepper status="released"/></div>
      <DealMini status="завершено"/>
      <div style={{padding:'16px'}}><PdNotice kind="ok" icon={PdI.check}><b>Готово!</b> Вы подтвердили получение. {pdMoney(900)} отправлены Ане, чек придёт на e-mail.</PdNotice></div>
      <div className="pd-empty" style={{height:'auto',padding:'10px 30px 24px'}}>
        <div className="glyph" style={{color:'var(--pd-like)'}}>{PdI.heartline({className:'pd-i28',fill:'var(--pd-like)',stroke:'var(--pd-like)'})}</div>
        <h3>Как всё прошло?</h3>
        <p>Оставьте отзыв, это помогает другим покупателям и поднимает продавца в ленте.</p>
      </div>
    </PdScreen>
  );
}

// 3d — Оплата не прошла (payment_failed)
function PaymentFailed() {
  const footer=(<div className="pd-footerbar"><div style={{display:'flex',gap:10}}>
    <PdBtn variant="secondary" style={{flex:1}}>Сменить способ</PdBtn>
    <PdBtn variant="primary" icon={PdI.refresh} style={{flex:1}}>Повторить оплату</PdBtn></div></div>);
  return (
    <PdScreen title="Оплата" center footer={footer}>
      <div className="pd-empty" style={{height:'auto',paddingTop:54}}>
        <div className="glyph" style={{color:'var(--pd-danger)',background:'var(--pd-danger-soft)'}}>{PdI.alert({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>
        <h3>Оплата не прошла</h3>
        <p>Банк отклонил платёж. С вашей карты ничего не списано, букет всё ещё зарезервирован за вами.</p>
      </div>
      <div style={{padding:'4px 16px'}}>
        <PdNotice kind="ok" icon={PdI.shield}>Деньги в безопасности. Попробуйте ещё раз картой или через СБП.</PdNotice>
        <div style={{marginTop:12}}><PdInput icon={PdI.wallet} value="Карта •••• 4416" /></div>
      </div>
    </PdScreen>
  );
}

// 3e — Отзыв (форма)
function ReviewForm() {
  const footer=(<div className="pd-footerbar"><PdBtn variant="primary" block lg>Отправить отзыв</PdBtn></div>);
  return (
    <PdScreen title="Отзыв" center footer={footer}>
      <DealMini status="завершено"/>
      <div style={{padding:'22px 16px',display:'flex',flexDirection:'column',gap:22}}>
        <div style={{textAlign:'center'}}>
          <PdAvatar seller={{n:'Аня',av:'w1'}} size={56}/>
          <div style={{fontWeight:700,fontSize:17,marginTop:8}}>Оцените Аню</div>
          <div style={{marginTop:12,display:'flex',justifyContent:'center'}}><PdStars value={4} input/></div>
        </div>
        <PdField label="Отзыв" opt="необязательно" counter="0 / 500">
          <PdInput textarea rows={4} placeholder="Свежий ли был букет? Как прошла встреча?" />
        </PdField>
        <PdNotice kind="info" icon={PdI.info}>Контакты и грубые слова в отзыве не пропустим, это публичный текст.</PdNotice>
      </div>
    </PdScreen>
  );
}

// 3f — Уведомления (список)
const NOTIFS=[
  {ic:PdI.check,unread:true,t:'Покупатель подтвердил получение',s:'Сделка «Букет M · Патрики» завершена · 900 ₽ в пути',tm:'5 мин'},
  {ic:PdI.heartline,unread:true,t:'Ваш букет залайкали',s:'Уже 47 лайков, он в топе «Самые залайканные»',tm:'1 ч'},
  {ic:PdI.shield,unread:false,t:'Объявление прошло модерацию',s:'«Пионовидные розы» опубликовано в ленте Москвы',tm:'3 ч'},
  {ic:PdIc.star,unread:false,t:'Новый отзыв от Марины',s:'«Букет был свежий, как на фото» · 5 ★',tm:'вчера'},
];
function Notifications() {
  return (
    <PdScreen title="Уведомления" back={false}>
      <div className="pd-list">
        {NOTIFS.map((n,i)=>(
          <div className={`pd-row${n.unread?' unread':''}`} key={i}>
            <span className="ring">{n.ic({className:'pd-i20',fill:'none',stroke:'currentColor'})}</span>
            <div className="mid"><div className="ttl">{n.t}</div><div className="sub">{n.s}</div></div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}><span className="tm">{n.tm}</span>{n.unread&&<span className="udot"/>}</div>
          </div>
        ))}
      </div>
    </PdScreen>
  );
}
// 3g — Уведомления: пусто
function NotificationsEmpty() {
  return (
    <PdScreen title="Уведомления" back={false}>
      <div className="pd-empty">
        <div className="glyph">{PdI.bell({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>
        <h3>Пока тихо</h3>
        <p>Здесь появятся статусы сделок, лайки ваших букетов и новые отзывы.</p>
      </div>
    </PdScreen>
  );
}

// 3h — Нет сети (offline)
function Offline() {
  const banner=(<div className="pd-offline">{PdI.refresh({className:'pd-i16',fill:'none',stroke:'currentColor'})}Нет соединения<button className="retry">Повторить</button></div>);
  return (
    <div className="pd-root" data-pd-theme="a">
      {banner}
      <header className="pd-appbar"><span className="pd-brand">Передарим</span></header>
      <main className="pd-scroll">
        <div className="pd-empty">
          <div className="glyph">{PdI.refresh({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>
          <h3>Нет интернета</h3>
          <p>Не получилось загрузить ленту. Проверьте соединение, мы обновим всё автоматически, как только сеть вернётся.</p>
          <PdBtn variant="primary" block icon={PdI.refresh}>Повторить</PdBtn>
        </div>
      </main>
    </div>
  );
}

export {
  DealPaidHeld,
  DealDisputed,
  DealReleased,
  PaymentFailed,
  ReviewForm,
  Notifications,
  NotificationsEmpty,
  Offline
};
