'use client';
import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function ToTopButton({ threshold = 400, className = '' }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollTop = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label="Kembali ke atas"
      className={[
        'fixed z-50 h-12 w-12 rounded-full',
        'bg-white/10 ring-1 ring-white/20 backdrop-blur',
        'text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-500',
        'transition-all duration-300',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none',
        // posisi default — aman untuk iOS safe area
        'md:bottom-8 md:right-8',
        className
      ].join(' ')}
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.25rem)',
        right:  'calc(env(safe-area-inset-right, 0px) + 1.25rem)',
      }}
    >
      <ChevronUp className="mx-auto h-6 w-6" />
    </button>
  );
}
