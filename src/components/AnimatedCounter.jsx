import React, { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';

function AnimatedCounter({ targetNumber, duration = 2000, prefix = '', suffix = '', decimals = 0 }) {
  const [ref, isInView] = useInView();
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    hasAnimated.current = true;
    let currentNumber = 0;
    const increment = targetNumber / (duration / 16); // 60fps
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth acceleration/deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentNumber = targetNumber * easeOut;

      if (counterRef.current) {
        counterRef.current.textContent =
          prefix +
          currentNumber.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView, targetNumber, duration, prefix, suffix, decimals]);

  return (
    <span ref={counterRef} className="font-bold">
      {prefix}0{suffix}
    </span>
  );
}

export default AnimatedCounter;
