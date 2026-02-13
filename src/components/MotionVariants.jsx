import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Card Component
 */
export const AnimatedCard = motion.div;

/**
 * Fade In Animation
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide Up Animation
 */
export const slideUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Scale In Animation
 */
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Stagger Container
 */
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Hover Scale Effect
 */
export const hoverScaleVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};

/**
 * Button Hover Variants
 */
export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.3)',
  },
  tap: { scale: 0.98 },
};

/**
 * Animated Container with auto scroll reset
 */
export const AnimatedContainer = ({ children, variants = staggerContainerVariants, ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={variants}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Tab Animation Variants
 */
export const tabVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

/**
 * Bounce In Animation
 */
export const bounceInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
      duration: 0.5,
    },
  },
};

/**
 * Rotate In Animation
 */
export const rotateInVariants = {
  hidden: { opacity: 0, rotate: -20 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default {
  fadeInVariants,
  slideUpVariants,
  scaleInVariants,
  staggerContainerVariants,
  hoverScaleVariants,
  buttonHoverVariants,
  tabVariants,
  bounceInVariants,
  rotateInVariants,
};
