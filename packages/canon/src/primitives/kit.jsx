// @rebloom/canon · primitives/kit.jsx
// Converted from design source pd-kit.jsx (single source of truth — edited ONLY by Claude Design).
import React from "react";
import "../styles/canon.css";

// pd-kit.jsx — shared UI kit for «Передарим» screens (theme «Воздух»)
// Builds on pd-feed.jsx exports (window.PdIc, PdCard, PdAvatar, pdMoney…).
// Exports: window.PdI (icons) + PdBtn, PdField, PdInput, PdOtp, PdSizeSel,
//   PdSeg, PdChip, PdStepper, PdBubble, PdStars, PdNotice, PdEmpty, PdSkelCard,
//   PdScreen, PdGallery, PdToast.

const I = {
  back:  (p)=><svg viewBox="0 0 24 24" {...p}><path d="m15 5-7 7 7 7"/></svg>,
  fwd:   (p)=><svg viewBox="0 0 24 24" {...p}><path d="m9 5 7 7-7 7"/></svg>,
  x:     (p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>,
  check: (p)=><svg viewBox="0 0 24 24" {...p}><path d="m5 12.5 4.5 4.5L19 7"/></svg>,
  camera:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M3 8h3l1.5-2.5h9L18 8h3v12H3z"/><circle cx="12" cy="13.5" r="3.6"/></svg>,
  image: (p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>,
  send:  (p)=><svg viewBox="0 0 24 24" {...p}><path d="M4 12 20 5l-6 15-3-6-7-2Z"/></svg>,
  lock:  (p)=><svg viewBox="0 0 24 24" {...p}><rect x="5" y="11" width="14" height="9" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>,
  shield:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>,
  truck: (p)=><svg viewBox="0 0 24 24" {...p}><path d="M2 7h11v8H2zM13 10h4l3 3v2h-7z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/></svg>,
  walk:  (p)=><svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="4.5" r="2"/><path d="M12 8v6m0 0-3 6m3-6 3 6M8 11h8"/></svg>,
  alert: (p)=><svg viewBox="0 0 24 24" {...p}><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4.5M12 17.5v.5"/></svg>,
  info:  (p)=><svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></svg>,
  clock: (p)=><svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>,
  bell:  (p)=><svg viewBox="0 0 24 24" {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>,
  refresh:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M20 11a8 8 0 1 0-.5 4"/><path d="M20 5v6h-6"/></svg>,
  flag:  (p)=><svg viewBox="0 0 24 24" {...p}><path d="M5 21V4m0 1h12l-2.5 4L17 13H5"/></svg>,
  heartline:(p)=><svg viewBox="0 0 24 24" {...p}><path d="M12 20s-7-4.6-9.2-9C1.3 8 2.6 4.6 5.9 4.6c2 0 3.3 1.2 4.1 2.4.8-1.2 2.1-2.4 4.1-2.4 3.3 0 4.6 3.4 3.1 6.4C19 15.4 12 20 12 20Z"/></svg>,
  cart:  (p)=><svg viewBox="0 0 24 24" {...p}><path d="M3 4h2l2.2 11h10L20 7H6.5"/><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>,
  wallet:(p)=><svg viewBox="0 0 24 24" {...p}><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14h2"/></svg>,
};

const Sp = (p)=><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={'pd-spin '+(p.className||'')}><circle cx="12" cy="12" r="9" strokeOpacity=".25"/><path d="M21 12a9 9 0 0 0-9-9"/></svg>;

function PdBtn({ variant='primary', block, lg, loading, icon, children, ...rest }) {
  const Icon = icon;
  return (
    <button className={`pd-btn pd-btn--${variant}${block?' pd-btn--block':''}${lg?' pd-btn--lg':''}`} {...rest}>
      {loading ? <Sp/> : (Icon && <Icon className="pd-i18" fill="none" stroke="currentColor"/>)}
      {children}
    </button>
  );
}

function PdField({ label, opt, hint, error, counter, children }) {
  return (
    <div className="pd-field">
      {label && <label className="pd-label">{label}{opt && <span className="opt"> · {opt}</span>}</label>}
      {children}
      {(hint || error || counter) && (
        <div className="pd-fieldfoot">
          {error ? <span className="pd-err">{I.alert({className:'pd-i14',fill:'none',stroke:'currentColor'})}{error}</span>
                 : hint && <span className="pd-hint">{hint}</span>}
          {counter && <span className="pd-hint cnt">{counter}</span>}
        </div>
      )}
    </div>
  );
}

function PdInput({ state, prefix, icon, value, placeholder, textarea, rows=4 }) {
  const Icon = icon;
  return (
    <div className={`pd-input${state==='focus'?' pd-input--focus':''}${state==='invalid'?' pd-input--invalid':''}`}>
      {Icon && <Icon className="pd-i18" fill="none" stroke="currentColor" style={{color:'var(--pd-muted)',flex:'none'}}/>}
      {prefix && <span className="pre">{prefix}</span>}
      {textarea
        ? <textarea rows={rows} defaultValue={value} placeholder={placeholder}/>
        : <input defaultValue={value} placeholder={placeholder}/>}
    </div>
  );
}

function PdOtp({ value='', cur, state }) {
  const cells = Array.from({length:6}, (_,i)=>value[i]||'');
  return (
    <div className={`pd-otp${state==='invalid'?' invalid':''}${state==='locked'?' locked':''}`}>
      {cells.map((c,i)=>(
        <div key={i} className={`cell${c?' filled':''}${i===cur?' cur':''}`}>{c}</div>
      ))}
    </div>
  );
}

function PdSeg({ options, value }) {
  return <div className="pd-seg">{options.map(o=>(
    <button key={o.k} className={value===o.k?'on':''}>{o.icon && <o.icon className="pd-i16" fill="none" stroke="currentColor" style={{marginRight:5,verticalAlign:'-3px'}}/>}{o.label}</button>
  ))}</div>;
}

const PD_SIZES=[['S','до 7'],['M','7–15'],['L','15–25'],['XL','25+']];
function PdSizeSel({ value }) {
  return <div className="pd-sizes">{PD_SIZES.map(([s,l])=>(
    <button key={s} className={`pd-sizebtn${value===s?' on':''}`}><span className="s">{s}</span><span className="l">{l} шт.</span></button>
  ))}</div>;
}

function PdChip({ on, children, icon }) {
  const Icon=icon;
  return <button className={`pd-chip${on?' pd-chip--on':''}`}>{Icon&&<Icon className="pd-i14" fill="none" stroke="currentColor"/>}{children}</button>;
}

// deal status stepper — status: created|paid_held|released|disputed
const DEAL_STEPS=[['created','Оплата'],['paid_held','В эскроу'],['handover','Передача'],['released','Готово']];
function PdStepper({ status }) {
  const order=['created','paid_held','handover','released'];
  let curIdx = status==='disputed' ? 2 : order.indexOf(status==='released'?'released':status==='paid_held'?'handover':status);
  if(status==='paid_held') curIdx=2;
  if(status==='released') curIdx=3;
  if(status==='created') curIdx=1;
  return (
    <div className="pd-stepper">
      {DEAL_STEPS.map(([k,l],i)=>{
        let cls='';
        if(status==='disputed'){ cls = i<2?'done':(i===2?'warn':''); }
        else { cls = i<curIdx?'done':(i===curIdx?'cur':''); if(status==='released') cls=i<=3?'done':''; }
        return <div key={k} className={`pd-step ${cls}`}>
          <span className="dot">{(cls==='done')?I.check({className:'pd-i16',fill:'none',stroke:'currentColor'}):(cls==='warn'?'!':i+1)}</span>
          <span className="lab">{l}</span>
        </div>;
      })}
    </div>
  );
}

function PdBubble({ kind='in', children, time }) {
  return <div className={`pd-bubble pd-bubble--${kind}`}>{children}{time&&<div className="tm">{time}</div>}</div>;
}

function PdStars({ value=0, input }) {
  return <span className={`pd-stars pd-stars--${input?'input':'read'}`}>
    {[1,2,3,4,5].map(n=>(
      <svg key={n} viewBox="0 0 24 24" className={n<=value?'on':'off'}><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/></svg>
    ))}
  </span>;
}

function PdNotice({ kind='info', icon, children }) {
  const Icon = icon || (kind==='warn'?I.clock:kind==='ok'?I.shield:kind==='danger'?I.alert:I.info);
  return <div className={`pd-notice pd-notice--${kind}`}><span className="ic">{Icon({className:'pd-i18',fill:'none',stroke:'currentColor'})}</span><div>{children}</div></div>;
}

function PdEmpty({ glyph, title, text, children }) {
  const G = glyph || I.heartline;
  return <div className="pd-empty"><div className="glyph">{G({className:'pd-i28',fill:'none',stroke:'currentColor'})}</div>
    <h3>{title}</h3><p>{text}</p>{children && <div className="pd-suggest">{children}</div>}</div>;
}

function PdSkelCard(){ return <div className="pd-sk-card"><div className="pd-sk ph" style={{borderRadius:0}}/><div className="bd"><div className="pd-sk" style={{height:16,width:'60%'}}/><div className="pd-sk" style={{height:12,width:'40%'}}/><div className="pd-sk" style={{height:12,width:'72%'}}/></div></div>; }

function PdGallery({ photos, count, idx=0 }) {
  const PD_IMG=(id)=>`img/${id}.jpg`;
  return <div className="pd-gallery">
    <img src={PD_IMG(photos[idx])} alt="Букет"/>
    <span className="pd-gcount">{idx+1} / {count||photos.length}</span>
    <div className="pd-gdots">{Array.from({length:count||photos.length}).map((_,i)=><i key={i} className={i===idx?'on':''}/>)}</div>
  </div>;
}

// generic mobile screen shell (app bar + scroll + optional footer)
function PdScreen({ title, center, back=true, action, onBg, footer, banner, children, safeTop=56, noScroll }) {
  return (
    <div className="pd-root" data-pd-theme="a">
      {banner}
      <header className="pd-appbar" style={{paddingTop:safeTop}}>
        {back && <button className="pd-iconbtn" aria-label="Назад">{I.back({className:'pd-i22',fill:'none',stroke:'currentColor'})}</button>}
        {!back && <div style={{width:6}}/>}
        <div className={`pd-appbar-title${center?' center':''}`}>{title}</div>
        {action || <div style={{width:38}}/>}
      </header>
      {noScroll ? children : <main className="pd-scroll">{children}</main>}
      {footer}
    </div>
  );
}

function PdToast({ kind='ok', children }) {
  const Icon = kind==='ok'?I.check:I.info;
  return <div style={{position:'absolute',left:16,right:16,bottom:24,background:'#3A322A',color:'#fff',borderRadius:14,padding:'13px 15px',display:'flex',gap:10,alignItems:'center',fontSize:13.5,fontWeight:600,boxShadow:'0 12px 30px rgba(0,0,0,.25)',zIndex:30}}>
    {Icon({className:'pd-i18',fill:'none',stroke:'currentColor'})}{children}</div>;
}

export {
  I as PdI,
  PdBtn,
  PdField,
  PdInput,
  PdOtp,
  PdSeg,
  PdSizeSel,
  PdChip,
  PdStepper,
  PdBubble,
  PdStars,
  PdNotice,
  PdEmpty,
  PdSkelCard,
  PdGallery,
  PdScreen,
  PdToast
};
