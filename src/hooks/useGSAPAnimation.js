import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Animate element on scroll into view
 * @param {string} selector - CSS selector for elements to animate
 * @param {object} animVars - GSAP animation variables
 * @param {object} triggerVars - ScrollTrigger configuration
 */
export function useScrollAnimation(selector, animVars = {}, triggerVars = {}) {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector);
    
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
          ...animVars.from,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          ...animVars.to,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'top 50%',
            markers: false,
            ...triggerVars,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, animVars, triggerVars]);
}

/**
 * Animate counter from 0 to target number
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in seconds
 */
export function useCounterAnimation(target, duration = 2) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const targets = { value: 0 };
    gsap.to(targets, {
      value: target,
      duration,
      ease: 'power1.out',
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(targets.value);
        }
      },
    });
  }, [target, duration]);

  return ref;
}

/**
 * Parallax scroll effect
 * @param {number} speed - Parallax speed multiplier
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: () => -window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [speed]);

  return ref;
}

/**
 * Stagger elements with GSAP
 * @param {string} selector - CSS selector for elements
 * @param {object} vars - GSAP animation variables
 */
export function useStaggerAnimation(selector, vars = {}) {
  useEffect(() => {
    gsap.to(selector, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      ...vars,
    });
  }, [selector, vars]);
}

export { gsap, ScrollTrigger };
