// components/MultiIcon.jsx
"use client";
import { useState } from "react";

/**
 * Render ikon dengan fallback multi-format.
 * Prioritas default: svg → webp → png → avif → jpg → jpeg
 *
 * Pakai:
 * <MultiIcon base="/icons/games/hsr" title="HSR" size={20} />
 * atau jika ingin paksa satu file:
 * <MultiIcon src="/icons/games/hsr.svg" title="HSR" />
 */
export default function MultiIcon({
  base,
  src,
  title = "",
  size = 20,
  className = "object-contain",
  order = ["svg", "webp", "png", "avif", "jpg", "jpeg"],
}) {
  // daftar kandidat sumber gambar
  const candidates = src ? [src] : (base ? order.map((ext) => `${base}.${ext}`) : []);
  const [idx, setIdx] = useState(0);

  if (!candidates.length) return null;
  const current = candidates[Math.min(idx, candidates.length - 1)];

  return (
    <img
      src={current}
      alt={title}
      title={title}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size }}
      className={className}
      onError={() => {
        // coba kandidat berikutnya jika ada
        setIdx((i) => (i < candidates.length - 1 ? i + 1 : i));
      }}
    />
  );
}
