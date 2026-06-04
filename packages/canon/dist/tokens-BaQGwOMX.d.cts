import preset from './tailwind-preset.cjs';
import { b as motion } from './motion-DU8j13e4.cjs';

declare const tokens_motion: typeof motion;
declare namespace tokens {
  export { tokens_motion as motion, preset as tailwindPreset };
}

export { tokens as t };
