'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music2 } from 'lucide-react';

const clamp = (v, a=0, b=1) => Math.min(b, Math.max(a, v));
const fmt = (s) => `${Math.floor((s||0)/60)}:${String(Math.floor((s||0)%60)).padStart(2,'0')}`;

export default function AdminThemeSongDock({ admin, src, title='Theme', autoHideMs=3000 }) {
  const fallback = '/audio/theme.mp3';
  const envUrl = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_THEME_SONG : '';
  const url = src || admin?.themeSong || envUrl || fallback;

  const audioRef = useRef(null);
  const hideRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(0.8);
  const [prog, setProg] = useState(0);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  }, []);

  // load prefs
  useEffect(() => {
    try {
      const m = localStorage.getItem('gv:dock:muted');
      const v = localStorage.getItem('gv:dock:vol');
      if (m != null) setMuted(m === '1');
      if (v != null) setVol(clamp(parseFloat(v)));
    } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem('gv:dock:muted', muted ? '1' : '0'); } catch {} }, [muted]);
  useEffect(() => { try { localStorage.setItem('gv:dock:vol', String(vol)); } catch {} }, [vol]);

  // bind audio
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onMeta = () => setDur(el.duration || 0);
    const onTime = () => {
      setCur(el.currentTime || 0);
      setProg(el.duration ? el.currentTime/el.duration : 0);
    };
    const onEnd = () => setPlaying(false);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    el.muted = muted; el.volume = vol;
    return () => {
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnd);
    };
  }, [muted, vol]);

  // auto-hide
  const ping = () => {
    setOpen(true);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setOpen(false), autoHideMs);
  };

  const togglePlay = async () => {
    const el = audioRef.current; if (!el) return;
    ping();
    try {
      if (playing) { el.pause(); setPlaying(false); }
      else { await el.play(); setPlaying(true); }
    } catch {}
  };
  const toggleMute = () => { setMuted(m => !m); ping(); };
  const onVol = (e) => { const v = clamp(parseFloat(e.target.value)); setVol(v); const el = audioRef.current; if (el) el.volume = v; ping(); };
  const onSeek = (e) => { const el = audioRef.current; if (!el || !dur) return; const v = clamp(parseFloat(e.target.value)); el.currentTime = v*dur; setProg(v); ping(); };

  return (
    <div
      onMouseEnter={ping}
      onMouseMove={ping}
      onTouchStart={ping}
      className="fixed z-40 pointer-events-auto left-1/2 -translate-x-1/2 bottom-16 sm:bottom-4"
    >
      <div className={[
        'flex items-center gap-2 rounded-full',
        'bg-white/[0.06] backdrop-blur-xl ring-1 ring-white/15',
        'shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
        'transition-[width,height,opacity] duration-300',
        open
          ? 'w-[94vw] max-w-[480px] sm:max-w-[560px] px-3 py-2'
          : 'w-[46px] h-[46px] sm:w-[54px] sm:h-[54px] p-0 justify-center'
      ].join(' ')}>
        <audio ref={audioRef} src={url} preload="metadata" />

        {!open && (
          <button
            onClick={togglePlay}
            className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Play"
          >
            <Music2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {open && (
          <>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={togglePlay}
                className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
              <button
                onClick={toggleMute}
                className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 h-9 w-9 sm:h-10 sm:w-10"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-[12px] sm:text-sm text-white/85">{title}</span>
                {!prefersReducedMotion && (
                  <div className="flex gap-[3px] h-3 items-end">
                    {[0,1,2,3,4].map(i => (
                      <span
                        key={i}
                        className={`eq-bar w-[3px] rounded-sm ${playing ? 'animate-[eq_1s_ease-in-out_infinite]' : ''}`}
                        style={{ animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/60 w-[30px] sm:w-[34px] text-right tabular-nums">{fmt(cur)}</span>
                <input
                  type="range" min={0} max={1} step={0.001}
                  value={prog} onChange={onSeek}
                  className="w-full h-2 accent-white/90"
                  aria-label="Seek"
                />
                <span className="text-[10px] text-white/60 w-[30px] sm:w-[34px] tabular-nums">{fmt(dur)}</span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0 w-28">
              <input
                type="range" min={0} max={1} step={0.05}
                value={vol} onChange={onVol}
                className="w-full h-2 accent-white/90"
                aria-label="Volume"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
