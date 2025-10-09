"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Music2 } from "lucide-react";

const CDN_BASES = [
  "https://cdn.jsdelivr.net/gh/sigitars9-hue/lagu-profile-admin@main",
  "https://cdn.jsdelivr.net/gh/sigitars9-hue/lagu-profile-admin-b@main",
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const fmt = (s) => `${Math.floor((s || 0) / 60)}:${String(Math.floor((s || 0) % 60)).padStart(2, "0")}`;

function buildCandidates({ slug, src }) {
  if (src) {
    const b = src.replace(/\.\w+$/, "");
    return [
      { url: b + ".webm", type: "audio/webm" },
      { url: b + ".m4a",  type: "audio/mp4"  },
      { url: b + ".mp3",  type: "audio/mpeg" }
    ];
  }
  if (!slug) return [];
  const list = [];
  for (const base of CDN_BASES) {
    const b = `${base}/${slug}`;
    list.push(
      { url: b + ".webm", type: "audio/webm" },
      { url: b + ".m4a",  type: "audio/mp4"  },
      { url: b + ".mp3",  type: "audio/mpeg" }
    );
  }
  return list;
}

export default function TinyMusicButton({ slug, src, autoHideMs = 3500 }) {
  const aRef = useRef(null);
  const hideRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(0.8);
  const [prog, setProg] = useState(0);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  }, []);

  // ====== SIMPAN PREFERENSI ======
  useEffect(() => {
    try {
      const m = localStorage.getItem("gv:dock:muted");
      const v = localStorage.getItem("gv:dock:vol");
      if (m != null) setMuted(m === "1");
      if (v != null) setVol(clamp(parseFloat(v)));
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("gv:dock:muted", muted ? "1" : "0"); } catch {} }, [muted]);
  useEffect(() => { try { localStorage.setItem("gv:dock:vol", String(vol)); } catch {} }, [vol]);

  // ====== LOAD AUDIO ======
  useEffect(() => {
    const candidates = buildCandidates({ slug, src });
    if (!candidates.length) { setVisible(false); return; }

    const a = new Audio();
    a.loop = true;
    a.preload = "metadata";
    a.crossOrigin = "anonymous";
    a.muted = muted;
    a.volume = vol;

    let idx = -1;
    const tryNext = () => {
      idx++;
      if (idx >= candidates.length) { setVisible(false); return; }
      const c = candidates[idx];
      if (c.type && a.canPlayType && a.canPlayType(c.type) === "") { tryNext(); return; }
      setReady(false);
      a.src = c.url;
      a.load();
    };

    const onMeta = () => setDur(a.duration || 0);
    const onCanPlay = () => { setReady(true); setVisible(true); };
    const onTime = () => { setCur(a.currentTime || 0); setProg(a.duration ? a.currentTime / a.duration : 0); };
    const onEnd = () => setPlaying(false);
    const onErr = () => tryNext();

    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    a.addEventListener("error", onErr);

    aRef.current = a;
    tryNext();

    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("canplay", onCanPlay);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("error", onErr);
      aRef.current = null;
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [slug, src, muted, vol]);

  const armAutoHide = () => {
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setOpen(false), autoHideMs);
  };
  const gentlyOpen = () => { setOpen(true); armAutoHide(); };

  const toggle = async () => {
    const a = aRef.current; if (!a) return;
    if (playing) { a.pause(); setPlaying(false); setOpen(false); }
    else {
      try { await a.play(); setPlaying(true); setOpen(true); armAutoHide(); }
      catch { gentlyOpen(); }
    }
  };
  const toggleMute = () => { setMuted(m => !m); gentlyOpen(); };
  const onVol = e => { const v = clamp(parseFloat(e.target.value)); setVol(v); if (aRef.current) aRef.current.volume = v; gentlyOpen(); };
  const onSeek = e => { const a = aRef.current; if (!a || !dur) return; const v = clamp(parseFloat(e.target.value)); a.currentTime = v * dur; setProg(v); gentlyOpen(); };

  if (!visible) return null;

 // ...bagian atas komponen tetap sama

return (
<div
  className="fixed left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
  style={{ top: "max(env(safe-area-inset-top), 8px)" }}
  onMouseEnter={gentlyOpen}
  onTouchStart={gentlyOpen}
>
    <div
      className={[
        "flex items-center gap-1 sm:gap-2 rounded-full",
        "bg-white/[0.06] backdrop-blur-xl ring-1 ring-white/15",
        "shadow-[0_10px_25px_rgba(0,0,0,0.45)]",
        "transition-all duration-300",
        // ↓ PERPENDEK di mobile: 78vw & max-w 260px (sebelumnya 88vw/340px)
        //   desktop tetap lega: sm:max-w 420px
        open
  ? "px-2 py-1 sm:px-2.5 sm:py-1.5 w-[68vw] max-w-[220px] sm:max-w-[340px]"
  : "p-0 w-[34px] h-[34px] justify-center sm:w-[42px] sm:h-[42px]"

      ].join(" ")}
    >
      {/* tombol play/pause */}
      <button
        onClick={toggle}
        className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/15 transition h-8 w-8 sm:h-9 sm:w-9"
      >
        {!ready ? (
          <Music2 className="h-4 w-4 text-white/80" />
        ) : playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>

      {/* isi saat terbuka */}
      {open && (
        <>
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            {!prefersReducedMotion && <MiniEq active={playing && ready} />}
            {/* waktu dipersempit 24px */}
            <span className="text-[10px] text-white/60 w-[24px] text-right tabular-nums">
              {fmt(cur)}
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={prog}
              onChange={onSeek}
              className="w-full h-1 accent-white/90"
            />
            <span className="text-[10px] text-white/60 w-[24px] tabular-nums">
              {fmt(dur)}
            </span>
          </div>

          {/* volume tetap hanya muncul di ≥sm */}
          <div className="hidden sm:flex items-center gap-1 shrink-0 w-20 sm:w-24">
            <button
              onClick={toggleMute}
              className="p-1 bg-white/10 hover:bg-white/20 rounded-full ring-1 ring-white/15"
              aria-label={muted ? "Unmute" : "Mute"}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? (
                <VolumeX className="h-3.5 w-3.5 text-white" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-white" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={vol}
              onChange={onVol}
              className="w-full h-1 accent-white/90"
            />
          </div>
        </>
      )}
    </div>

    {/* keyframes eq tetap */}
    <style jsx global>{`
      @keyframes tiny-eq {
        0% { transform: scaleY(0.35); }
        25% { transform: scaleY(1); }
        50% { transform: scaleY(0.55); }
        75% { transform: scaleY(0.95); }
        100% { transform: scaleY(0.35); }
      }
    `}</style>
  </div>
);

}

function MiniEq({ active }) {
  const bar = "h-2.5 w-[2px] bg-sky-400/85 rounded-sm";
  return (
    <div className="flex items-end gap-[2px] sm:gap-[3px]">
      {[0, 1, 2, 3, 4].map(i => (
        <span
          key={i}
          className={`${bar} ${active ? "animate-[tiny-eq_900ms_ease-in-out_infinite]" : "opacity-50"}`}
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}
