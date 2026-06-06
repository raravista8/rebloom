# OTP keyboard + SMS-code AutoFill — implementation guide

`@rebloom/canon` 0.8.0 · surface: **registration & login** (`auth`) · step: **OTP / code entry**

This document is the source of truth for the “keyboard raised + SMS code autofills” state on the
phone-code step. Read it fully before touching the OTP screen — there is a hard split between
**what the prototype draws** (a mock, to *specify* the UX) and **what `web/` actually implements**
(no hand-drawn keyboard at all — the OS does it).

---

## 1. The intended UX (what the user experiences)

1. User lands on **«Введите код»** after requesting an SMS code.
2. The OS keyboard is **already up** (the code field is autofocused).
3. The SMS arrives. The platform surfaces the code as a **one-tap AutoFill suggestion** in the
   keyboard’s own suggestion area:
   - **iOS** — the QuickType bar above the keyboard shows the code (`4127`) with the label
     **«Из сообщений»** (“From Messages”). One tap fills all cells.
   - **Android** — Gboard shows a **suggestion chip** `✉ 4127 · Из сообщений`. One tap fills.
4. The OTP cells fill, verification runs (`verifying`), success routes onward.

The keyboard the user sees is the **stock system keyboard** for that platform. It is **never** a
bespoke/branded keypad. This is a deliberate constraint (see §4) — users trust and read the OS
keyboard instantly; a custom one looks wrong and breaks AutoFill.

---

## 2. Prototype harness — how the mock is built (`reference/prototypes/*`)

The prototype can’t run a real OS keyboard, so it **renders a faithful static replica** of the
system keyboard purely to communicate the state in the design canvas. Three moving parts:

### 2a. `AuthOtpFill` — the screen (`pd-auth.jsx`)
A chrome-light variant of the OTP step, sized to sit **above** a raised keyboard:

```jsx
function AuthOtpFill({ plat='ios', code='4127' }) {
  return (
    <div className={`pd-root pa pa--${plat}`} data-pd-theme="a" style={{position:'relative'}}>
      <div className="pa-top"><button className="pd-iconbtn">{ic(PdI.back,'pd-i22')}</button></div>
      <div className="pa-body">
        <div style={{textAlign:'center',margin:'10px 0 24px'}}>
          <h2 className="pa-h2">Введите код</h2>
          <p className="pa-sub">Отправили на +7 999 124-58-03</p>
        </div>
        <PdOtp value={code} cur={code.length}/>
        <p style={{textAlign:'center',color:'var(--pd-muted)',fontSize:13,marginTop:20}}>Отправить код снова через 0:42</p>
        <p style={{textAlign:'center',marginTop:8}}><button className="pd-link">Изменить номер</button></p>
      </div>
    </div>
  );
}
```

Key decision: **no `pa-foot` / submit button.** On a real device the keyboard covers the bottom
inset; a pinned «Войти» would be hidden behind it. The regular `AuthOtp` (keyboard *down*) keeps its
footer — `AuthOtpFill` is specifically the keyboard-*up* moment.

### 2b. Device frame forwards two props (`ios-frame.jsx` / `android-frame.jsx`)
`IOSDevice` / `AndroidDevice` already had a boolean `keyboard`. 0.8.0 adds **`kbdAutofill`**
(a string — the code to show) which is forwarded to the keyboard component:

```jsx
// IOSDevice(... keyboard, kbdAutofill = null ) →
{keyboard && <IOSKeyboard dark={dark} autofill={kbdAutofill} />}
// AndroidDevice(... keyboard, kbdAutofill = null ) →
{keyboard && <AndroidKeyboard autofill={kbdAutofill} />}
```

> Note: a `kbdNumeric` prop also exists from an earlier draft but is **unused/ignored** — the OTP
> uses the full system QWERTY (see §4). Do not wire screens to it.

### 2c. The keyboard renders the code in its **suggestion strip**
The keyboards are the same stock-system replicas used everywhere else; the only addition is: when
`autofill` is set, the **suggestion row** swaps its default content for the SMS suggestion.

- **`IOSKeyboard`** (iOS 26 “liquid glass” QWERTY): the QuickType bar (normally `"The" / the / to`)
  becomes a single centered suggestion — bold code (`letterSpacing:2`) над a 11.5px «Из сообщений»
  caption. The QWERTY rows, shift/123/return, glass background — unchanged.
- **`AndroidKeyboard`** (Gboard / Material 3 QWERTY): the top suggestion strip (normally empty
  spacer) renders a pill chip — envelope glyph + bold code (`letterSpacing:2`) + muted
  «· Из сообщений», on `secondaryContainer`. The QWERTY rows below — unchanged.

### 2d. Artboards (`Передарим · Вход.html`)
```jsx
const mobK = (id,label,el,code='4127') => (
  <DCArtboard ...><IOSDevice keyboard kbdAutofill={code}>{el}</IOSDevice></DCArtboard>);
const andrK = (id,label,el,code='4127') => (
  <DCArtboard ...><AndroidDevice keyboard kbdAutofill={code}>{el}</AndroidDevice></DCArtboard>);
...
{mobK('a-otp-kbd','Код · клавиатура + автоподстановка', <AuthOtpFill plat="ios"/>)}
{andrK('an-otp-kbd','Код · клавиатура + автоподстановка', <AuthOtpFill plat="android"/>)}
```

### Layout contract (why it doesn’t overlap)
The device frame is `flex-column`: `[status][nav?][content flex:1 overflow:auto][keyboard][nav]`.
`AuthOtpFill` is short and top-aligned, so it occupies the top of the scroll area and the keyboard
sits flush at the bottom with empty space between — exactly like a real device. **Never** give the
screen a pinned footer in this state.

---

## 3. The system-keyboard rule (do not violate)

> The OTP keyboard MUST be the **stock OS keyboard**, not a custom design.

- An earlier 0.8.0 draft drew a bespoke 3×4 numeric pad with the code in a custom accessory bar.
  It was **reverted**. Reasons: (a) it’s not what iOS/Android show for `one-time-code` fields,
  (b) a hand-drawn pad reads as “fake”, (c) real AutoFill lives in the OS suggestion strip, which a
  custom pad doesn’t have.
- If you extend the harness, keep the keyboard identical to the non-OTP keyboard; only the
  suggestion row may differ.

---

## 4. Production web — what to ACTUALLY implement (`web/`)

**You do not render a keyboard.** The OS does. Your job is to declare the field correctly so the
platform raises the right keyboard and offers the “From Messages” suggestion automatically.

### 4a. Markup (the whole trick)
```html
<!-- one input per visual cell, or one input behind cells; either way: -->
<input
  inputmode="numeric"
  autocomplete="one-time-code"
  maxlength="6"
  pattern="[0-9]*"
  aria-label="Код из SMS"
/>
```
- **`autocomplete="one-time-code"`** is the load-bearing attribute. On **iOS Safari/WebKit** it makes
  the **QuickType “From Messages” suggestion** appear over the keyboard with zero JS, as soon as an
  SMS with a recognizable code arrives. (iOS heuristically matches the code in the message.)
- **`inputmode="numeric"`** raises the numeric layout on platforms that honor it. (iOS still shows
  the QuickType bar; that’s where AutoFill lives.)
- Autofocus the first cell on mount so the keyboard is already up.

### 4b. Android — WebOTP API (progressive enhancement)
Android Chrome can fill programmatically via the **WebOTP API**; pair it with the server SMS format
(`@host #code`):
```js
if ('OTPCredential' in window) {
  const ac = new AbortController();
  navigator.credentials.get({ otp: { transport: ['sms'] }, signal: ac.signal })
    .then(otp => { fillCode(otp.code); /* auto-submit */ })
    .catch(() => {});
  // abort on unmount / manual entry
}
```
- SMS body must end with `@your.host #123456` for Chrome to surface the chip / fill.
- Always keep manual entry working; WebOTP is best-effort.

### 4c. Per the canon multi-cell `PdOtp`
The reference `PdOtp` paints cells. Back them with a real input (one hidden input with
`autocomplete="one-time-code"`, or N inputs). Per the existing OTP notes in
`CLAUDE_CODE_HANDOFF.md §5.3`: `maxlength=1` per cell, advance/backspace handling, paste splits
across cells, and **the first input carries `autocomplete="one-time-code"`** so AutoFill targets it.

### 4d. State machine (unchanged from prior canon)
`typing` → (code present) → `verifying` (`POST /api/auth/otp/verify`) → success route ·
`invalid` (retry count) · `locked` (resend timer). `AuthOtpFill` is the **`typing`-with-keyboard**
presentation only; it carries no new backend contract.

---

## 5. Files touched (0.8.0)

| File | Change |
|------|--------|
| `pd-auth.jsx` | `AuthOtpFill` added + exported |
| `ios-frame.jsx` | `IOSDevice` `kbdAutofill` prop; `IOSKeyboard({autofill})` QuickType suggestion; custom numpad removed |
| `android-frame.jsx` | `AndroidDevice` `kbdAutofill` prop; `AndroidKeyboard({autofill})` suggestion chip; custom numpad removed |
| `Передарим · Вход.html` | `mobK` / `andrK` helpers + `a-otp-kbd` / `an-otp-kbd` artboards |

## 6. Checklist for `web/`

- [ ] OTP input(s) carry `autocomplete="one-time-code"` + `inputmode="numeric"`.
- [ ] First cell autofocuses → keyboard up on entry.
- [ ] iOS: confirm QuickType “From Messages” appears (real device / SMS).
- [ ] Android: WebOTP wired + server SMS uses `@host #code` format; manual entry still works.
- [ ] No app-drawn keyboard or numeric pad anywhere.
- [ ] Submit affordance does not sit hidden behind the keyboard (validate, then advance).
