'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function Backdrop({ density = 44 }) {
  const reduce = useReducedMotion();

  const anim1 = reduce
    ? {}
    : {
        animate: { x: ['-8%', '10%', '-8%'], y: ['0%', '-6%', '0%'] },
        transition: { duration: 35, repeat: Infinity, ease: 'easeInOut' },
      };

  const anim2 = reduce
    ? {}
    : {
        animate: { x: ['10%', '-6%', '10%'], y: ['-4%', '6%', '-4%'] },
        transition: { duration: 45, repeat: Infinity, ease: 'easeInOut', delay: 4 },
      };

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        // Batasi dampak layout/paint/style ke kontainer ini saja (mengurangi reflow)
        contain: 'layout paint style',
      }}
    >
      {/* Spotlight/vignette ringan (aman di mobile) */}
      <div className="absolute inset-0 bg-[radial-gradient(700px_350px_at_50%_-5%,rgba(59,130,246,0.24),transparent)]" />

      {/* Grid & dotted: HANYA di md+ (mask-image & repaint cukup berat di mobile) */}
      <div
        className="absolute inset-0 opacity-[0.14] hidden md:block"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: `${density}px ${density}px`,
          maskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 60%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] hidden md:block"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,.35) 1px, transparent 1.5px)',
          backgroundSize: '4px 4px',
          maskImage:
            'radial-gradient(ellipse at center, black 55%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 55%, transparent 100%)',
        }}
      />

      {/* Aurora: 
         - Mobile: statis + blur lebih kecil (tidak pakai motion)
         - md+: animasi pelan + blur besar
      */}
      {/* Kiri */}
      <div className="absolute -left-1/3 top-1/4 h-[60vmax] w-[60vmax] rounded-full bg-gradient-to-tr from-blue-500/30 via-cyan-400/30 to-transparent blur-xl md:hidden" />
      <motion.div
        {...anim1}
        className="absolute -left-1/3 top-1/4 hidden md:block h-[60vmax] w-[60vmax] rounded-full bg-gradient-to-tr from-blue-500/30 via-cyan-400/30 to-transparent blur-3xl will-change-transform"
      />

      {/* Kanan */}
      <div className="absolute -right-1/4 top-1/3 h-[50vmax] w-[50vmax] rounded-full bg-gradient-to-tr from-indigo-500/25 via-fuchsia-400/25 to-transparent blur-xl md:hidden" />
      <motion.div
        {...anim2}
        className="absolute -right-1/4 top-1/3 hidden md:block h-[50vmax] w-[50vmax] rounded-full bg-gradient-to-tr from-indigo-500/25 via-fuchsia-400/25 to-transparent blur-3xl will-change-transform"
      />

      {/* Vignette bawah: bantu kontras teks */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
    </div>
  );
}
