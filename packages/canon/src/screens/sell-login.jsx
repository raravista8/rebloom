// @rebloom/canon · screens/sell-login.jsx
// Converted from design source pd-scr-2.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";
import { PdI, PdBtn, PdField, PdInput, PdOtp, PdSeg, PdSizeSel, PdNotice, PdScreen, PdMetroPicker, PdFlowerPicker } from "../primitives/kit";

// pd-scr-2.jsx — Продать (форма + модерация) · Вход (phone + OTP + locked)
const IMG2 = (id)=>`img/${id}.jpg`;

// 2a — Продать (форма)
function Uploader() {
  return (
    <div className="pd-uploader">
      <div className="pd-upcell"><img src={IMG2('1561181286-d3fee7d55364')} alt=""/><button className="x">{PdI.x({className:'pd-i14',fill:'none',stroke:'currentColor'})}</button><span className="cover">Обложка</span></div>
      <div className="pd-upcell"><img src={IMG2('1567418938902-aa650a3eb346')} alt=""/><button className="x">{PdI.x({className:'pd-i14',fill:'none',stroke:'currentColor'})}</button></div>
      <div className="pd-upcell"><img src={IMG2('1581938165093-050aeb5ef218')} alt="" style={{filter:'brightness(.7)'}}/><div className="prog"><div className="bar"/></div></div>
      <button className="pd-upadd">{PdI.camera({className:'pd-i24',fill:'none',stroke:'currentColor'})}<span>Добавить<br/>3 из 5</span></button>
    </div>
  );
}
function SellForm() {
  const [metro,setMetro]=React.useState('Маяковская');
  const [flowers,setFlowers]=React.useState(['Пионовидные розы','Зелень и эвкалипт']);
  const footer = (<div className="pd-footerbar"><PdBtn variant="primary" block lg>Опубликовать букет</PdBtn></div>);
  return (
    <PdScreen title="Продать букет" footer={footer}>
      <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:20}}>
        <PdField label="Фото букета" hint="1–5 фото. Уберём метаданные и геоданные перед загрузкой.">
          <Uploader/>
        </PdField>
        <PdField label="Размер" hint="Считаем по числу стеблей — как принято во флористике."><PdSizeSel value="M"/></PdField>
        <PdField label="Когда букет подарили" hint="От этого дня считаем свежесть — её увидят в теге букета.">
          <PdSeg value="today" options={[{k:'today',label:'Сегодня'},{k:'d1_2',label:'1–2 дня'},{k:'d3_plus',label:'3+ дня'}]}/>
        </PdField>
        <PdField label="Цена">
          <PdInput prefix="₽" value="990" />
        </PdField>
        <PdField label="Станция метро" hint="Главный ориентир для покупателя. Точный адрес — в чате после договорённости.">
          <PdMetroPicker cityKey="msk" value={metro} onChange={setMetro} />
        </PdField>
        <PdField label="Какие цветы" opt="необязательно" hint="Помогает покупателю найти букет в фильтрах по типу цветов.">
          <PdFlowerPicker value={flowers} onChange={setFlowers} />
        </PdField>
        <PdField label="Описание" opt="необязательно" counter="84 / 600">
          <PdInput textarea rows={3} value="Подарили утром, пионовидные розы и эвкалипт. Очень свежие, стоят в воде." />
        </PdField>
      </div>
    </PdScreen>
  );
}

// 2b — Продать: текст не прошёл модерацию (content_blocked, инлайн, без эха слова)
function SellBlocked() {
  const footer = (<div className="pd-footerbar"><PdBtn variant="primary" block lg>Опубликовать букет</PdBtn></div>);
  return (
    <PdScreen title="Продать букет" footer={footer}>
      <div style={{padding:'16px',display:'flex',flexDirection:'column',gap:20}}>
        <PdNotice kind="warn" icon={PdI.shield}>Контакты из объявления убираем: общаться безопаснее внутри сделки.</PdNotice>
        <PdField label="Цена"><PdInput prefix="₽" value="990" /></PdField>
        <PdField label="Описание" error="В тексте есть запрещённые слова или контакты. Поправьте, пожалуйста." counter="38 / 600">
          <PdInput textarea rows={3} state="invalid" value="Свежий букет, пишите мне в телеграм @•••••" />
        </PdField>
        <p style={{fontSize:12.5,color:'var(--pd-muted)',marginTop:-6}}>Мы не подсвечиваем конкретное слово, чтобы не подсказывать обход. Уберите телефон, ник или ссылку и публикуйте.</p>
      </div>
    </PdScreen>
  );
}

// 2c — Продать: опубликовано (success по умолчанию — сразу в ленте, без pre-moderation гейта)
function SellPublished() {
  const footer = (<div className="pd-footerbar" style={{display:'flex',gap:10}}>
    <PdBtn variant="secondary" style={{flex:1}}>В мои объявления</PdBtn>
    <PdBtn variant="primary" style={{flex:1}}>К букету</PdBtn></div>);
  return (
    <PdScreen title="Готово" center footer={footer}>
      <div className="pd-empty" style={{height:'auto',paddingTop:48}}>
        <div className="glyph" style={{color:'var(--pd-fresh)'}}>{PdI.check({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>
        <h3>Букет опубликован</h3>
        <p>Уже в ленте Москвы, покупатели рядом видят его прямо сейчас. Свежесть тает со временем, поэтому хорошее фото и честная цена помогают продать быстрее.</p>
      </div>
      <div style={{padding:'0 16px'}}>
        <PdNotice kind="info" icon={PdI.info}>Если с фото или текстом что-то не так, мы проверим по сигналу и подскажем. Объявление остаётся в ленте.</PdNotice>
      </div>
    </PdScreen>
  );
}

// 2c′ — Продать: объявление снято реактивной модерацией (редко) + апелляция (FLOW-5)
function SellRemoved() {
  const footer = (<div className="pd-footerbar" style={{display:'flex',gap:10}}>
    <PdBtn variant="ghost" style={{flex:1}}>Не согласен</PdBtn>
    <PdBtn variant="primary" style={{flex:1}}>Отредактировать и вернуть</PdBtn></div>);
  return (
    <PdScreen title="Объявление" center footer={footer}>
      <div className="pd-empty" style={{height:'auto',paddingTop:48}}>
        <div className="glyph" style={{color:'var(--pd-warn)'}}>{PdI.alert({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>
        <h3>Объявление снято с публикации</h3>
        <p>После проверки по сигналу мы скрыли это объявление из ленты. Возможно, на фото попало лицо или в тексте оказались контакты. Поправьте и верните в ленту.</p>
      </div>
      <div style={{padding:'0 16px'}}>
        <PdNotice kind="info" icon={PdI.info}>Считаете, что это ошибка? Нажмите «Не согласен», и мы отправим объявление на повторную проверку.</PdNotice>
      </div>
    </PdScreen>
  );
}

// 2d — Вход: телефон + согласие 152-ФЗ
const Consent = ({ on }) => (
  <label className={`pd-check${on?' on':''}`}>
    <span className="box">{on && PdI.check({className:'pd-i16',fill:'none',stroke:'currentColor'})}</span>
    <span className="t">Соглашаюсь с <a>условиями</a> и <a>политикой обработки персональных данных</a> (ФЗ-152).</span>
  </label>
);
function LoginShell({ children, footer }) {
  return (
    <div className="pd-root" data-pd-theme="a">
      <header className="pd-appbar pd-appbar--plain" style={{paddingTop:56}}>
        <button className="pd-iconbtn">{PdI.back({className:'pd-i22',fill:'none',stroke:'currentColor'})}</button>
        <div style={{flex:1}}/>
      </header>
      <main className="pd-scroll" style={{padding:'8px 22px'}}>{children}</main>
      {footer}
    </div>
  );
}
function LoginPhone() {
  const footer=(<div className="pd-footerbar"><PdBtn variant="primary" block lg>Получить код</PdBtn></div>);
  return (
    <LoginShell footer={footer}>
      <div style={{textAlign:'center',margin:'10px 0 26px'}}>
        <div className="pd-brand" style={{fontSize:30,marginBottom:10}}>Передарим</div>
        <p style={{color:'var(--pd-muted)',fontSize:14,lineHeight:1.5}}>Свежие букеты со скидкой<br/>и вторая жизнь для подаренных цветов.</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <PdField label="Номер телефона" hint="Пришлём код подтверждения по SMS.">
          <PdInput prefix="+7" value="999 124-58-03" state="focus" />
        </PdField>
        <Consent on />
      </div>
    </LoginShell>
  );
}
// 2e — Вход: ввод кода (OTP typing)
function OtpVerify() {
  const footer=(<div className="pd-footerbar"><PdBtn variant="primary" block lg>Войти</PdBtn></div>);
  return (
    <LoginShell footer={footer}>
      <div style={{textAlign:'center',margin:'16px 0 26px'}}>
        <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>Введите код</h2>
        <p style={{color:'var(--pd-muted)',fontSize:14}}>Отправили на +7 999 124-58-03</p>
      </div>
      <PdOtp value="4127" cur={4} />
      <p style={{textAlign:'center',color:'var(--pd-muted)',fontSize:13,marginTop:20}}>Отправить код снова через 0:42</p>
      <p style={{textAlign:'center',marginTop:8}}><button className="pd-link">Изменить номер</button></p>
    </LoginShell>
  );
}
// 2f — Вход: слишком много попыток (otp_locked)
function OtpLocked() {
  const footer=(<div className="pd-footerbar"><PdBtn variant="secondary" block lg disabled>Повторить через 58:00</PdBtn></div>);
  return (
    <LoginShell footer={footer}>
      <div style={{textAlign:'center',margin:'16px 0 24px'}}>
        <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>Введите код</h2>
        <p style={{color:'var(--pd-muted)',fontSize:14}}>Отправили на +7 999 124-58-03</p>
      </div>
      <PdOtp value="0000" state="locked" />
      <div style={{marginTop:20}}>
        <PdNotice kind="danger" icon={PdI.lock}><b>Слишком много попыток.</b> Введите код позже, повторная отправка будет доступна через 1 час. Так мы защищаем ваш аккаунт.</PdNotice>
      </div>
    </LoginShell>
  );
}

export { SellForm, SellBlocked, SellPublished, SellRemoved, LoginPhone, OtpVerify, OtpLocked };
