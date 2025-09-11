import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}