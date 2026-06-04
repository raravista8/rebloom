'use client';
// Admin chrome — desktop-first sidebar + content (ADMIN_DESIGN_BRIEF). Only the
// built sections appear in the nav; more land in follow-up PRs.
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV: { href: string; label: string }[] = [
  { href: '/admin', label: 'Обзор' },
  { href: '/admin/moderation', label: 'Модерация' },
  { href: '/admin/deals', label: 'Сделки' },
  { href: '/admin/users', label: 'Пользователи' },
  { href: '/admin/finance', label: 'Финансы' },
  { href: '/admin/fraud', label: 'Антифрод' },
  { href: '/admin/reports', label: 'Жалобы' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <div className="pda-app" style={{ display: 'flex', minHeight: '100vh', background: 'var(--pd-bg)', color: 'var(--pd-text)' }}>
      <aside
        style={{
          width: 220,
          flex: 'none',
          borderRight: '1px solid var(--pd-border)',
          background: 'var(--pd-surface)',
          padding: '20px 12px',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 17, padding: '4px 10px 18px' }}>Передарим</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              style={{
                display: 'block',
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active(n.href) ? 700 : 500,
                color: active(n.href) ? 'var(--pd-on-primary)' : 'var(--pd-text)',
                background: active(n.href) ? 'var(--pd-primary)' : 'transparent',
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: '24px 28px', maxWidth: 1200 }}>{children}</main>
    </div>
  );
}
