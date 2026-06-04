declare const duration: {
    readonly fast: 0.16;
    readonly base: 0.24;
    readonly slow: 0.32;
};
declare const easing: {
    readonly standard: readonly [0.2, 0.7, 0.3, 1];
    readonly decelerate: readonly [0, 0, 0.2, 1];
    readonly accelerate: readonly [0.4, 0, 1, 1];
};
declare const spring: {
    readonly sheet: {
        readonly type: "spring";
        readonly stiffness: 420;
        readonly damping: 36;
        readonly mass: 0.9;
    };
    readonly pop: {
        readonly type: "spring";
        readonly stiffness: 600;
        readonly damping: 14;
        readonly mass: 0.6;
    };
};
declare const motion: {
    readonly pressScale: 0.97;
    readonly cardHoverLift: -3;
    readonly staggerStep: 0.045;
};
/** True when the user asked for reduced motion (a11y). SSR-safe. */
declare const prefersReducedMotion: () => boolean;
declare const variants: {
    /** Card / list entrance — soft rise. Reduced-motion => instant. */
    readonly rise: {
        readonly hidden: {
            readonly opacity: 0;
            readonly y: 12;
        };
        readonly visible: {
            readonly opacity: 1;
            readonly y: 0;
            readonly transition: {
                readonly duration: 0.24;
                readonly ease: readonly [0, 0, 0.2, 1];
            };
        };
    };
    /** Staggered container for feed grids/rails. */
    readonly staggerContainer: {
        readonly hidden: {};
        readonly visible: {
            readonly transition: {
                readonly staggerChildren: 0.045;
            };
        };
    };
    /** Bottom sheet / dialog. */
    readonly sheet: {
        readonly hidden: {
            readonly y: "100%";
        };
        readonly visible: {
            readonly y: 0;
            readonly transition: {
                readonly type: "spring";
                readonly stiffness: 420;
                readonly damping: 36;
                readonly mass: 0.9;
            };
        };
        readonly exit: {
            readonly y: "100%";
            readonly transition: {
                readonly duration: 0.16;
                readonly ease: readonly [0.4, 0, 1, 1];
            };
        };
    };
    /** Toast slide-in. */
    readonly toast: {
        readonly hidden: {
            readonly opacity: 0;
            readonly y: 16;
        };
        readonly visible: {
            readonly opacity: 1;
            readonly y: 0;
            readonly transition: {
                readonly duration: 0.24;
                readonly ease: readonly [0.2, 0.7, 0.3, 1];
            };
        };
        readonly exit: {
            readonly opacity: 0;
            readonly y: 16;
            readonly transition: {
                readonly duration: 0.16;
                readonly ease: readonly [0.4, 0, 1, 1];
            };
        };
    };
    /** Like-heart pop (optimistic). */
    readonly likePop: {
        readonly tap: {
            readonly scale: readonly [1, 1.34, 0.88, 1];
            readonly transition: {
                readonly type: "spring";
                readonly stiffness: 600;
                readonly damping: 14;
                readonly mass: 0.6;
            };
        };
    };
};
/** Tap/press feedback for buttons & tappable cards. */
declare const pressable: {
    readonly whileTap: {
        readonly scale: 0.97;
    };
};
declare const _default: {
    duration: {
        readonly fast: 0.16;
        readonly base: 0.24;
        readonly slow: 0.32;
    };
    easing: {
        readonly standard: readonly [0.2, 0.7, 0.3, 1];
        readonly decelerate: readonly [0, 0, 0.2, 1];
        readonly accelerate: readonly [0.4, 0, 1, 1];
    };
    spring: {
        readonly sheet: {
            readonly type: "spring";
            readonly stiffness: 420;
            readonly damping: 36;
            readonly mass: 0.9;
        };
        readonly pop: {
            readonly type: "spring";
            readonly stiffness: 600;
            readonly damping: 14;
            readonly mass: 0.6;
        };
    };
    motion: {
        readonly pressScale: 0.97;
        readonly cardHoverLift: -3;
        readonly staggerStep: 0.045;
    };
    variants: {
        /** Card / list entrance — soft rise. Reduced-motion => instant. */
        readonly rise: {
            readonly hidden: {
                readonly opacity: 0;
                readonly y: 12;
            };
            readonly visible: {
                readonly opacity: 1;
                readonly y: 0;
                readonly transition: {
                    readonly duration: 0.24;
                    readonly ease: readonly [0, 0, 0.2, 1];
                };
            };
        };
        /** Staggered container for feed grids/rails. */
        readonly staggerContainer: {
            readonly hidden: {};
            readonly visible: {
                readonly transition: {
                    readonly staggerChildren: 0.045;
                };
            };
        };
        /** Bottom sheet / dialog. */
        readonly sheet: {
            readonly hidden: {
                readonly y: "100%";
            };
            readonly visible: {
                readonly y: 0;
                readonly transition: {
                    readonly type: "spring";
                    readonly stiffness: 420;
                    readonly damping: 36;
                    readonly mass: 0.9;
                };
            };
            readonly exit: {
                readonly y: "100%";
                readonly transition: {
                    readonly duration: 0.16;
                    readonly ease: readonly [0.4, 0, 1, 1];
                };
            };
        };
        /** Toast slide-in. */
        readonly toast: {
            readonly hidden: {
                readonly opacity: 0;
                readonly y: 16;
            };
            readonly visible: {
                readonly opacity: 1;
                readonly y: 0;
                readonly transition: {
                    readonly duration: 0.24;
                    readonly ease: readonly [0.2, 0.7, 0.3, 1];
                };
            };
            readonly exit: {
                readonly opacity: 0;
                readonly y: 16;
                readonly transition: {
                    readonly duration: 0.16;
                    readonly ease: readonly [0.4, 0, 1, 1];
                };
            };
        };
        /** Like-heart pop (optimistic). */
        readonly likePop: {
            readonly tap: {
                readonly scale: readonly [1, 1.34, 0.88, 1];
                readonly transition: {
                    readonly type: "spring";
                    readonly stiffness: 600;
                    readonly damping: 14;
                    readonly mass: 0.6;
                };
            };
        };
    };
    pressable: {
        readonly whileTap: {
            readonly scale: 0.97;
        };
    };
    prefersReducedMotion: () => boolean;
};

declare const motion$1_duration: typeof duration;
declare const motion$1_easing: typeof easing;
declare const motion$1_motion: typeof motion;
declare const motion$1_prefersReducedMotion: typeof prefersReducedMotion;
declare const motion$1_pressable: typeof pressable;
declare const motion$1_spring: typeof spring;
declare const motion$1_variants: typeof variants;
declare namespace motion$1 {
  export { _default as default, motion$1_duration as duration, motion$1_easing as easing, motion$1_motion as motion, motion$1_prefersReducedMotion as prefersReducedMotion, motion$1_pressable as pressable, motion$1_spring as spring, motion$1_variants as variants };
}

export { _default as _, pressable as a, motion$1 as b, duration as d, easing as e, motion as m, prefersReducedMotion as p, spring as s, variants as v };
