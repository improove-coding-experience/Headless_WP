import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

function TypingEffect({ text, speed = 50, className = '', delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [ref, isInView] = useInView();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;

    hasStarted.current = true;
    let currentIndex = 0;
    let timeoutId;

    const type = () => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(type, speed);
      }
    };

    // Add delay before starting
    const delayTimeoutId = setTimeout(type, delay);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(delayTimeoutId);
    };
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {displayedText}
      <motion.span
        className="inline-block w-0.5 h-[1em] bg-indigo-500 ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </span>
  );
}

export default TypingEffect;
