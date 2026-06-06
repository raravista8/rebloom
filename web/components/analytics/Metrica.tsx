'use client';
// Yandex Metrica loader + SPA route tracking. Inert unless NEXT_PUBLIC_YM_COUNTER_ID
// is set at build time. Uses Metrica's standard (non-defer) init, so the tag fires the
// FIRST pageview automatically; we then send a `hit` on every SUBSEQUENT App-Router
// navigation (skipping the initial render so the first page isn't double-counted).
// ФЗ-152: data stays in RF. ⚠️ webvisor records session replays — turn OFF
// "запись содержимого полей" in the Metrica dashboard so phone/OTP/address/chat inputs
// are not captured (T-10 / PRIVACY_152FZ), or mask them with `ym-hide-content`.
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { YM_ID, ymHit } from '@/lib/ym';

export default function Metrica() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false; // the init snippet already counts the first pageview
      return;
    }
    if (pathname) ymHit(pathname);
  }, [pathname]);

  if (!YM_ID) return null;
  return (
    <Script
      id="yandex-metrica"
      strategy="afterInteractive"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<e.scripts.length;j++){if(e.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}","ym");ym(${YM_ID},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",accurateTrackBounce:true,trackLinks:true});`,
      }}
    />
  );
}
