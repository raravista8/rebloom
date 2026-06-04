'use client';
// Scaffold proof: render the canon витрина demo screen to verify the whole pipeline
// (canon ESM transpile, 'use client' boundary, framer-motion, CSS-var tokens, Golos
// Text) renders inside Next.js. This is TEMPORARY — replaced by data-wired screens
// composed from canon primitives. (Demo images resolve to relative img/ paths that
// don't exist yet; the styling/layout is what we're proving here.)
import { PdFeed } from '@rebloom/canon/feed';

export default function CanonProof() {
  return <PdFeed theme="a" platform="ios" />;
}
