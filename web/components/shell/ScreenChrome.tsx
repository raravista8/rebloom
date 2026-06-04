'use client';
// Generic mobile screen shell (app bar + scroll + optional footer), mirroring
// canon's PdScreen — but canon's back button has no handler, so we wire it to
// router.back(). Reused across detail screens (listing, deal, review…).
import { useRouter } from 'next/navigation';
import { IconBack } from '@/components/icons';
import BottomNav from '@/components/shell/BottomNav';

export default function ScreenChrome({
  title,
  center = true,
  action,
  footer,
  onBack,
  back = true,
  tab = false,
  children,
}: {
  title?: React.ReactNode;
  center?: boolean;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  onBack?: () => void;
  /** show the back button (false for bottom-nav tab screens). */
  back?: boolean;
  /** render the BottomNav as the footer (for tab screens). */
  tab?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="pd-root" data-pd-theme="a">
      <header className="pd-appbar" style={{ paddingTop: 'max(8px, env(safe-area-inset-top))' }}>
        {back ? (
          <button className="pd-iconbtn" aria-label="Назад" onClick={onBack ?? (() => router.back())}>
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
