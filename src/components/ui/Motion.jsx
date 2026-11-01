import React, { useEffect, useRef, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  return reduced;
}

export function useInView({ threshold = 0.18, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (reduced || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (!once) setInView(false);
          return;
        }
        setInView(true);
        if (once) observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, reduced, rootMargin, threshold]);

  return [ref, inView];
}

export function WordRise({ text, className = '', stagger = 70, delay = 0, as: Tag = 'span', ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  const words = String(text).split(/\s+/).filter(Boolean);
  return (
    <Tag ref={ref} className={`word-rise ${inView ? 'is-erected' : ''} ${className}`} {...rest}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="word-rise-word"
          style={{ '--word-delay': `${delay + index * stagger}ms` }}
        >
          <span className="word-rise-inner">{word}{index < words.length - 1 ? '\u00A0' : ''}</span>
        </span>
      ))}
    </Tag>
  );
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div', style, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function ImageReveal({ children, className = '', delay = 0, style, ...rest }) {
  const [ref, inView] = useInView({ threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  return (
    <div
      ref={ref}
      className={`image-reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </div>
  );
}


export function TiltCard({ children, className = '', max = 2.2, ...rest }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  function onMove(event) {
    if (reduced || event.pointerType !== 'mouse' || !ref.current) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty('--tilt-x', `${(-py * max).toFixed(2)}deg`);
    ref.current.style.setProperty('--tilt-y', `${(px * max).toFixed(2)}deg`);
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.setProperty('--tilt-x', '0deg');
    ref.current.style.setProperty('--tilt-y', '0deg');
  }

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      {children}
    </div>
  );
}

export function AnimatedNumber({ value, duration = 300, className = '' }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      previous.current = value;
      return undefined;
    }

    const from = previous.current;
    const delta = value - from;
    previous.current = value;
    if (!delta) {
      setDisplay(value);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, reduced, value]);

  return <span className={className}>{display.toLocaleString('fr-FR')}</span>;
}

export function ScrollProgress() {
  const barRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !window.matchMedia('(min-width: 640px)').matches) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? Math.min(1, root.scrollTop / max) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [reduced]);

  return (
    <div className="scroll-progress hidden sm:block" aria-hidden="true">
      <span ref={barRef} style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
