import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

interface ScrambleTextProps {
  /** The text to animate */
  text: string;
  /** Optional CSS class name */
  className?: string;
  /** 
   * How fast the characters update during the scramble (in milliseconds). 
   * - Decrease this value (e.g., 10) for faster, more chaotic frame updates.
   * - Increase this value (e.g., 100) for slower, more visible character changes per frame.
   */
  scrambleSpeed?: number;
  /** 
   * How quickly the actual text is resolved and revealed per animation tick.
   * - Decrease this value (e.g., 0.1) to make the text reveal slower, spending more time in the scrambled state.
   * - Increase this value (e.g., 1.0) to make the text reveal faster, resolving to the original characters sooner.
   */
  revealSpeed?: number;
}

export const ScrambleText = ({
  text,
  className = '',
  scrambleSpeed = 60,
  revealSpeed = 0.4
}: ScrambleTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;

    hasAnimated.current = true;
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            if (char === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += revealSpeed;
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [text, isInView, scrambleSpeed, revealSpeed]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
};
