import { type Variants } from "framer-motion";

// Shared motion config aligned with design_system.motion

export const EMERALD_EASE: [number, number, number, number] = [
  0.25, 0.46, 0.45, 0.94,
];

// Sections & hero content → fade_up
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      delay,
    },
  }),
};

// Simple fade in (no vertical movement)
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
      delay,
    },
  }),
};

// Cards → scale_in
export const scaleInItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Feature grids → stagger container
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Hover interactions for cards
export const cardHoverTransition = {
  duration: 0.2,
};

export const cardHoverWhileHover = {
  y: -6,
  scale: 1.01,
};

// Button tap interaction
export const buttonTapWhileTap = {
  scale: 0.96,
};

