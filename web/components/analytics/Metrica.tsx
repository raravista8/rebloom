'use client';
// Yandex Metrica loader + SPA route tracking. Inert unless NEXT_PUBLIC_YM_COUNTER_ID
// is set (build-time). The App Router is a single-page app, so we send a `hit` on
// every route change — Metrica's `defer:true` init skips the auto first-hit, and the
// mount effect sends it, so there is no double count. ФЗ-152: data stays in RF.
import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { YM_ID, ymHit } from '@/lib/ym';

export default function Metrica() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) ymHit(pathname);
  }, [pathname]);

  if (!YM_ID) return null;
  return (
    <Script
      id="yandex-metrica"
      strategy="afterInteractive"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<e.scripts.length;j++){if(e.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${YM_ID},"init",{defer:true,clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
      }}
    />
  );
}
