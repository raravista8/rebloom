'use client';
// Generic screen shell. RESPONSIVE:
//  • mobile (<1024px) — canon's PdScreen: app bar (with router.back) + scroll +
//    optional footer / bottom-nav, exactly as before.
//  • desktop (≥1024px) — the shared global top nav (WebChrome) + the screen content
//    centred in a comfortable column (canon .pdw-narrow, or .pdw-detailwrap when
//    `wide`), a text «Назад» link instead of the phone app-bar, and NO bottom tab
//    strip. Screens with a bespoke desktop layout (e.g. the listing two-column) pass
//    it via `desktop`, replacing the default column.
// One layout tree is mounted at a time (useIsDesktop), so the 360px visual baselines
// are untouched.
import { useRouter } from 'next/navigation';
import { IconBack } from '@/components/icons';
import BottomNav from '@/components/shell/BottomNav';
import WebChrome from '@/components/shell/WebChrome';
import useIsDesktop from '@/lib/useIsDesktop';

export default function ScreenChrome({
  title,
  center = true,
  action,
  footer,
  onBack,
  back = true,
  tab = false,
  desktop,
  wide = false,
  children,
}: {
  title?: React.ReactNode;
  center?: boolean;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
  /** show the back button (false for bottom-nav tab screens). */
  back?: boolean;
  /** render the BottomNav as the footer (for tab screens) — mobile only. */
  tab?: boolean;
  /** bespoke desktop content (≥1024px); when omitted, children render in a centred column. */
  desktop?: React.ReactNode;
  /** use the wide detail column (.pdw-detailwrap) instead of the narrow one. */
  wide?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const goBack = onBack ?? (() => router.back());

  if (isDesktop) {
    return (
      // `.pdl` gives PdWebNav (in WebChrome) its container-query + drawer containment.
      <div className="pd-root pd-web pdl" data-pd-theme="a">
        <WebChrome />
        <main className="pd-scroll pdw-scroll">
          {desktop ?? (
            <div className={wide ? 'pdw-detailwrap' : 'pdw-narrow'}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                {back ? (
                  <button className="pdw-back" onClick={goBack}>
                    <IconBack className="pd-i18" /> Назад
                  </button>
                ) : (
                  <span />
                )}
                {action}
              </div>
              {title && <h1 className="pdw-h1">{title}</h1>}
              {children}
              {footer && <div className="pdw-foot">{footer}</div>}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="pd-root" data-pd-theme="a">
      <header className="pd-appbar" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
        {back ? (
          <button className="pd-iconbtn" aria-label="Назад" onClick={goBack}>
            <IconBack className="pd-i22" />
          </button>
        ) : (
          <div style={{ width: 6 }} />
        )}
        <div className={`pd-appbar-title${center ? ' center' : ''}`}>{title}</div>
        {action ?? <div style={{ width: 38 }} />}
      </header>
      <main className="pd-scroll">{children}</main>
      {tab ? <BottomNav /> : footer}
    </div>
  );
}
