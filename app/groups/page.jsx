'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MessageCircle, Users } from 'lucide-react';
import { groups } from '../../data/groups';

/* =========================================================
   SMALL UI PRIMS
   ========================================================= */
function Card({ children, className = '' }) {
  // padding kanan diperlebar supaya teks tidak ketutup badge icon
  return (
    <div
      className={`group relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 pr-28 shadow-xl shadow-black/40 transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}

function Pill({ children, icon, dot = false }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      {dot && (
        <span className="inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(74,222,128,0.2)]" />
      )}
      {icon}
      <span className="font-mono tabular-nums min-w-[5ch] text-right">{children}</span>
    </span>
  );
}

function formatCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function seed01(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return (h >>> 0) / 2 ** 32;
}

// pause angka “aktif” saat user scroll biar halus
function useIsScrolling(timeout = 200) {
  const [scrolling, setScrolling] = useState(false);
  const toRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);
      if (toRef.current) clearTimeout(toRef.current);
      toRef.current = setTimeout(() => setScrolling(false), timeout);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (toRef.current) clearTimeout(toRef.current);
    };
  }, [timeout]);

  return scrolling;
}

function Medal({ rank, hm = false }) {
  if (hm) {
    return (
      <span className="absolute right-3 top-3 z-20 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] text-white/80">
        Honorable Mention
      </span>
    );
  }
  if (!rank) return null;
  const emoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
  return (
    <span className="absolute right-3 top-3 z-20 text-xl" aria-label={`Rank ${rank}`}>
      {emoji}
    </span>
  );
}

/* =========================================================
   ICON BADGE HELPERS
   ========================================================= */
 const ICON_BASE = '/icons/games';
 const ICON_EXT  = 'png';
 // alias slug → nama file yang ADA di /public/icons/games
 const ICON_FILE_ALIAS = {
   gi: 'gi',            // Genshin
   'guardian-tales': 'guardiantales',
   'neural-cloud': 'nc',
   'limbus-company': 'limbus',
   'grand-order': 'fgo',     // kalau ada yang masih pakai label "grand-order"
   gfl2: 'gfl',
 };
 const iconPath = (key) => {
   const fileKey = ICON_FILE_ALIAS[key] ?? key;
   return `${ICON_BASE}/${fileKey}.${ICON_EXT}`;
 };

// mapping nama/kategori → icon
// mapping nama/kategori → daftar icon (harus cocok dg nama file di /public/icons/games/*.png)
const ICON_MAP = [
 { test: /\bdante\b/i,                        icons: ['limbus'] },
 { test: /velvet\s*room/i,                    icons: ['persona'] },
 { test: /penembak\s*jitu|pubg/i,             icons: ['valorant','pubg','df'] },
 { test: /paimon|genshin|gi\b/i,              icons: ['gi'] },          // → genshin.png via alias
 { test: /penafkah\s*husbu/i,                 icons: ['tot','lads'] },
 { test: /chaldea|fate\s*grand\s*order|fgo/i, icons: ['fgo'] },
 { test: /mayling|girls'? frontline/i,        icons: ['gfl'] },
 { test: /penjaga\s*anomali|guardian\s*tales/i, icons: ['guardiantales'] },
 { test: /gamefreak|pok(e|é)mon/i,            icons: ['pokemon'] },

 { test: /honkai:\s*star\s*rail|pom\s*pom/i,  icons: ['hsr'] },
 { test: /honkai\s*impact\s*3rd|kubis|hi3/i,  icons: ['hi3'] },
 { test: /zenless\s*zone\s*zero|eridu|zzz/i,  icons: ['zzz'] },
 { test: /reverse[:\s]*1999|arcanist/i,       icons: ['reverse-1999'] },
 { test: /kurogames|wuwa/i,                   icons: ['wuwa'] },

 { test: /mihoyo|hoyoverse/i,                 icons: ['gi','hsr','zzz','hi3'] },
 { test: /cygames/i,                          icons: ['gbf','umamusume'] },
 { test: /yostar/i,                           icons: ['ak','al','ba','ag','nc'] },

 { test: /rhythm|full\s*combo|bandori|pjsk/i, icons: ['bandori','pjsk'] },
 { test: /valorant/i,                         icons: ['valorant'] },
 { test: /\broblox\b/i,                       icons: ['roblox'] },
 { test: /pgr|punishing\s*gray\s*rav(en)?/i,  icons: ['pgr'] },
 { test: /limbus/i,                           icons: ['limbus'] },
 { test: /mlbb|moonton/i, icons: ['mlbb'] },

];

function dedupLimit(arr, n) {
  const seen = new Set();
  const out = [];
  for (const x of arr) {
    if (!x) continue;
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(x);
    if (out.length >= n) break;
  }
  return out;
}

// pilih icon dari properti data (g.icons) atau derive dari nama/kategori
function deriveIcons(g) {
  if (Array.isArray(g.icons) && g.icons.length) return dedupLimit(g.icons, 6);
  const hay = `${g.name || ''} ${g.category || ''}`;
  const found = new Set();
  ICON_MAP.forEach(({ test, icons }) => {
    if (test.test(hay)) icons.forEach(k => found.add(k));
  });
  return dedupLimit([...found], 6);
}


// badge icon (pojok kanan, di bawah medal)
function GroupIcons({ keys = [] }) {
  if (!keys.length) return null;
  return (
    <div
      className="
        pointer-events-none
        absolute right-4 top-12 z-10
        grid grid-cols-2 gap-2
      "
      aria-hidden
    >
      {keys.slice(0,6).map((k) => (
        <div key={k} className="h-8 w-8 overflow-hidden rounded-xl ring-1 ring-white/15 bg-white/5">
          <Image
            src={iconPath(k)}
            alt={k}
            width={32}
            height={32}
            className="h-full w-full object-cover"
            priority={false}
          />
        </div>
      ))}
    </div>
  );
}


/* =========================================================
   PAGE
   ========================================================= */
export default function GroupsPage() {
  const isScrolling = useIsScrolling(180);

  // ranking top 3 berdasarkan monthlyChats
  const rankMap = useMemo(() => {
    const withNum = groups.map((g) => ({ name: g.name, chats: g.monthlyChats ?? 0 }));
    withNum.sort((a, b) => b.chats - a.chats);
    const m = new Map();
    withNum.slice(0, 3).forEach((g, i) => m.set(g.name, i + 1));
    return m; // name -> 1|2|3
  }, []);

  // baseline statistik (fallback)
  const baseStats = useMemo(() => {
    return groups.map((g) => {
      const baseSeed = seed01(`${g.name}-${g.category}`);
      const msgs = g.monthlyChats ?? Math.floor(800 + baseSeed * 4000); // 0.8k - 4.8k
      const estimatedActive = Math.min(400, Math.max(40, Math.round(msgs * 0.03) + 60));
      return { msgs, active: estimatedActive };
    });
  }, []);

  // angka aktif sedikit “hidup”
  const [stats, setStats] = useState(baseStats);
  useEffect(() => {
    const tick = () => {
      if (typeof document !== 'undefined') {
        if (document.visibilityState !== 'visible' || isScrolling) return;
      }
      setStats((prev) =>
        prev.map((v) => {
          const j = Math.round((Math.random() - 0.5) * 4); // ±2
          const active = Math.max(30, Math.min(400, v.active + j));
          return { ...v, active };
        }),
      );
    };
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [isScrolling]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/20 px-3 py-1 text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>Grup WhatsApp</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold">
            Daftar Seluruh Grup Gachaverse.id
          </h1>
          <p className="text-white/70">
            Komunitas Gachaverse.id merupakan komunitas ramah bagi semua kalangan dengan
            banyaknya admin yang mengatur grup-grup.
          </p>
          <div className="mt-3 text-sm text-white/60">
            Total grup: <span className="text-white">{groups.length}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, idx) => {
            const rank = rankMap.get(g.name);
            const isHM = g.name?.toLowerCase() === 'casual talk'; // contoh HM
            const s = stats[idx];
            const iconKeys = deriveIcons(g);

            return (
              <div key={g.name} className="relative">
                <Card>
                  <Medal rank={rank} hm={isHM} />
                  <GroupIcons keys={iconKeys} />

                  <h3 className="text-lg font-semibold text-white">{g.name}</h3>
                  <p className="mt-1 text-white/70">{g.category}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Pill icon={<MessageCircle className="h-3.5 w-3.5" />}>
                      {formatCompact(baseStats[idx].msgs)} / bulan
                    </Pill>
                    <Pill dot icon={<Users className="h-3.5 w-3.5" />}>
                      {formatCompact(s.active)} aktif
                    </Pill>
                  </div>

                  <a
                    href={g.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                  >
                    Join Grup <ChevronRight className="h-4 w-4" />
                  </a>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Back */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block rounded-2xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
