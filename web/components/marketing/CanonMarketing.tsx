'use client';
// Client boundary for the canon marketing/SEO pages. The canon components
// (PdGeoPage/PdSafeDeal/PdBlogIndex/PdBlogArticle) are self-contained (own nav +
// catalog teaser + footer) and use React hooks, so they must render inside a
// 'use client' boundary. The wrapping server route owns metadata + JSON-LD + SSG;
// these wrappers only pick the responsive `platform` and pass data verbatim.
//
// SSR/SSG bakes the mobile tree (useIsDesktop()=false on the server and first paint),
// then upgrades to desktop on wide viewports after mount — same pattern as LandingHome,
// no hydration mismatch. Crawlers receive the full mobile HTML.
import { PdGeoPage, PdSafeDeal, PdBlogIndex, PdBlogArticle } from '@rebloom/canon/marketing';
import useIsDesktop from '@/lib/useIsDesktop';
import { GUEST_MENU_LINKS } from '@/components/marketing/MobileMenu';
import type { GeoCity } from '@/lib/geoCities';
import type { BlogArticle } from '@/lib/blogArticles';

function usePlatform(): 'desktop' | 'web' {
  return useIsDesktop() ? 'desktop' : 'web';
}

// canon 0.8.1 made `menuLinks` a required prop on the SEO shells (Shell→SeoNav→
// PdMobileMenu). Pass the real guest routes (shared with web's landing burger). The
// burger trigger itself is still hidden on `.pds`/`.pdc` via globals.css until the
// absolute-drawer containment is verified per-page — the links are wired and ready.
export function GeoPageView({ data }: { data: GeoCity }) {
  return <PdGeoPage data={data} platform={usePlatform()} menuLinks={GUEST_MENU_LINKS} />;
}

export function SafeDealView() {
  return <PdSafeDeal platform={usePlatform()} menuLinks={GUEST_MENU_LINKS} />;
}

export function BlogIndexView() {
  return <PdBlogIndex platform={usePlatform()} menuLinks={GUEST_MENU_LINKS} />;
}

export function BlogArticleView({ article }: { article: BlogArticle }) {
  return <PdBlogArticle article={article} platform={usePlatform()} menuLinks={GUEST_MENU_LINKS} />;
}
