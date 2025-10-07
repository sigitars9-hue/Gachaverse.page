// components/CardBlur.jsx
export default function CardBlur({ bgSrc, className = "", children }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-black/30 ${className}`}>
      {/* BG: foto blur */}
      {bgSrc && (
        <>
          <img
            src={bgSrc}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-[18px] scale-110 opacity-25 -z-10"
          />
          {/* tint tipis biar kontras */}
          <div className="pointer-events-none absolute inset-0 bg-sky-400/5 -z-10" />
          {/* gradient ke hitam supaya teks kebaca */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black -z-10" />
        </>
      )}
      {/* konten kartu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
