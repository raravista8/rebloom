import { __export } from './chunk-7P6ASYW6.mjs';

// tokens/motion.ts
var motion_exports = {};
__export(motion_exports, {
  default: () => motion_default,
  duration: () => duration,
  easing: () => easing,
  motion: () => motion,
  prefersReducedMotion: () => prefersReducedMotion,
  pressable: () => pressable,
  spring: () => spring,
  variants: () => variants
});
var duration = {
  fast: 0.16,
  // 160ms — taps, hovers, micro
  base: 0.24,
  // 240ms — entrances
  slow: 0.32
  // 320ms — screen transitions / sheets
};
var easing = {
  // cubic-bezier arrays (Framer-Motion friendly)
  standard: [0.2, 0.7, 0.3, 1],
  decelerate: [0, 0, 0.2, 1],
  // ease-out — for entering
  accelerate: [0.4, 0, 1, 1]
  // ease-in  — for exiting
};
var spring = {
  // physical springs (sheets/modals/cards/like-pop)
  sheet: { type: "spring", stiffness: 420, damping: 36, mass: 0.9 },
  pop: { type: "spring", stiffness: 600, damping: 14, mass: 0.6 }
};
var motion = {
  pressScale: 0.97,
  // tap/click tactile feedback
  cardHoverLift: -3,
  // px translateY on pointer hover
  staggerStep: 0.045
  // s — scroll-reveal cascade between cards
};
var prefersReducedMotion = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var variants = {
  /** Card / list entrance — soft rise. Reduced-motion => instant. */
  rise: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.decelerate } }
  },
  /** Staggered container for feed grids/rails. */
  staggerContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: motion.staggerStep } }
  },
  /** Bottom sheet / dialog. */
  sheet: {
    hidden: { y: "100%" },
    visible: { y: 0, transition: spring.sheet },
    exit: { y: "100%", transition: { duration: duration.fast, ease: easing.accelerate } }
  },
  /** Toast slide-in. */
  toast: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.standard } },
    exit: { opacity: 0, y: 16, transition: { duration: duration.fast, ease: easing.accelerate } }
  },
  /** Like-heart pop (optimistic). */
  likePop: {
    tap: { scale: [1, 1.34, 0.88, 1], transition: spring.pop }
  }
};
var pressable = { whileTap: { scale: motion.pressScale } };
var motion_default = { duration, easing, spring, motion, variants, pressable, prefersReducedMotion };

export { duration, easing, motion, motion_default, motion_exports, prefersReducedMotion, pressable, spring, variants };
