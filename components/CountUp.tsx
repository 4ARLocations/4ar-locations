'use client';
import { useEffect, useRef, useState } from 'react';

export default function CountUp({
  to,
  duration = 700,
  delay = 0,
}: {
  to: number;
  duration?: number;
  delay?: number;
}) {
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const startAt = performance.now() + delay;
    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startAt);
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = setTimeout(() => requestAnimationFrame(tick), delay);
    return () => clearTimeout(id);
  }, [to, duration, delay]);

  return <>{val}</>;
}
