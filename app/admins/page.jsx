// app/admins/page.jsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { admins } from '../../data/admins';
import SortModal from '../../components/SortModal';
import { normalizeDivisions } from '../../utils/normalizeDivisions';
import { byDivision, byGenderPriority, byName } from '../../utils/sorters';

/* ───────────────────────── Card dengan BG blur ───────────────────────── */
/* ───────────────────────── Card dengan BG blur ½ atas ───────────────────────── */
function Card({
  children,
  className = '',
  bgSrc,
  blur = 16,           // intensitas blur
  imgOpacity = 0.55,   // opasitas foto yang diblur
  topHeight = 0.25,    // proporsi area blur (0–1) → 58% atas
}) {
  const topH = Math.max(0.35, Math.min(topHeight, 0.8)) * 100; // guard 35–80%
  return (
    <div
      className={[
        'relative h-full overflow-hidden rounded-3xl border border-white/10',
        'shadow-xl shadow-black/40 backdrop-blur',
        '[content-visibility:auto] [contain:content]',
        className,
      ].join(' ')}
    >
      {/* LAYER: foto diblur hanya di bagian atas */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-0 left-0 w-full"
          style={{ height: `${topH}%` }}
        >
          {bgSrc ? (
            <>
              <img
                src={bgSrc}
                alt=""
                aria-hidden
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  filter: `blur(${blur}px)`,
                  transform: 'scale(1.06)',
                  opacity: imgOpacity,
                }}
              />
              {/* fade ke bawah supaya transisi halus */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-white/[0.03]" />
          )}
        </div>

        {/* LAYER global: tambahkan shading agar teks kebaca */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/45" />
      </div>

      {/* Konten: selalu center & konsisten */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────── UI helpers ─────────────────────────────── */
function Chip({ children }) {
  return (
    <span className="rounded-full bg-white/7 px-2.5 py-1 text-[11px] text-white/80 border border-white/10 max-w-[140px] truncate">
      {children}
    </span>
  );
}

function normalizeGender(g) {
  if (!g) return null;
  const s = String(g).trim().toLowerCase();
  const male = ['male', 'm', 'l', 'pria', 'cowok', 'l', 'laki', 'laki-laki', 'laki laki'];
  const female = ['female', 'f', 'p', 'wanita', 'cewek', 'perempuan'];
  if (male.includes(s)) return 'male';
  if (female.includes(s)) return 'female';
  return null;
}

function GenderBadge({ gender }) {
  const g = normalizeGender(gender);
  if (!g) return null;
  const isMale = g === 'male';
  const color = isMale
    ? 'text-blue-300 border-blue-400/30 bg-blue-400/10'
    : 'text-pink-300 border-pink-400/30 bg-pink-400/10';
  const symbol = isMale ? '♂' : '♀';
  const label = isMale ? 'Laki-laki' : 'Perempuan';
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border ${color} px-2 py-0.5 text-xs leading-none`}
      aria-label={label}
      title={label}
    >
      {symbol}
    </span>
  );
}

/* ------ helper: cek apakah admin punya platform tertentu (filter) ------ */
function hasPlatform(a, platform) {
  const p = String(platform || '').toLowerCase();
  if (!p) return false;

  // channels[].platform (standar baru)
  if (Array.isArray(a?.channels) && a.channels.some(c => String(c?.platform || '').toLowerCase() === p)) {
    return true;
  }

  // platforms[] (standar baru)
  if (Array.isArray(a?.platforms) && a.platforms.some(x => String(x).toLowerCase() === p)) {
    return true;
  }

  // fallback: field langsung
  if (p === 'whatsapp' && a?.whatsapp && a.whatsapp !== '#') return true;
  if (p === 'discord'  && a?.discord) return true;

  return false;
}
// ===== Hierarki peran (label -> urutan) =====
const ROLE_ALIASES = {
  'Founder': 'Co-founder',
  'Co-founder': 'Co-founder',
  'Head admin': 'Head Admin',
  'Co-owner group': 'Co-owner Group',
  'Konten Kreator expert': 'Best Creator',
  'Sekretaris Gvstore': 'Sekretaris',
};
const canonicalRole = (label) =>
  ROLE_ALIASES[String(label || '').trim()] ?? String(label || '').trim();

const ROLE_ORDER = [
  'Founder',
  'Co-founder',
  'Head Admin',
  'Owner Gvstore',
  'Sekretaris',
  'Best Creator',
  'Moderator',
  'Owner Group',
  'Co-owner Group',
  'Mascot',
  'Admin',
];

const roleRank = (a) => {
  const label = canonicalRole(a.role || '');
  const i = ROLE_ORDER.findIndex(r => r.toLowerCase() === label.toLowerCase());
  return i >= 0 ? i : 999; // yang tidak dikenal taruh di bawah
};

const cmpHierarchy = (a, b) => roleRank(a) - roleRank(b);

// optional: tetap dorong Pentung ke bawah
const isPentung = (a) => Array.isArray(a?._divisions) && a._divisions.some(d => /pentung/i.test(d));

/* ───────────────────────────────── Page ───────────────────────────────── */
export default function AdminsPage() {
  // UI state
  const [q, setQ] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all'); // all | whatsapp | discord
  const [sortOpen, setSortOpen] = useState(false);

  // sort states
  const [nameDir, setNameDir] = useState('az'); // 'az' | 'za'
  const [useDivisionOrder, setUseDivisionOrder] = useState(true);
  const [useGenderPriority, setUseGenderPriority] = useState(false);

  // inject divisions & flag pentung
  const source = useMemo(() => {
    return admins.map((a) => {
      const _divisions = normalizeDivisions(a);
      const _restricted = _divisions.includes('Pentung');
      return { ...a, _divisions, _restricted };
    });
  }, []);

  // filter
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return source.filter((a) => {
      if (platformFilter !== 'all' && !hasPlatform(a, platformFilter)) return false;

      if (!query) return true;
      const hay = [
        a.name || '',
        Array.isArray(a.skills) ? a.skills.join(' ') : '',
        a.responsibility || '',
        a.role || '',
        (a._divisions || []).join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return hay.includes(query);
    });
  }, [platformFilter, q, source]);

  // ringkasan total (berdasarkan hasil TERFILTER)
  const summary = useMemo(() => {
    let male = 0, female = 0, unknown = 0;
    for (const a of filtered) {
      const g = normalizeGender(a.gender);
      if (g === 'male') male++;
      else if (g === 'female') female++;
      else unknown++;
    }
    return { total: filtered.length, male, female, unknown };
  }, [filtered]);

  // sort
// --- comparator helper ---
const cmpName = (dir) => (a, b) =>
  (dir === 'za'
    ? b.name.localeCompare(a.name)
    : a.name.localeCompare(b.name));

const cmpGender = (a, b) => {
  const rank = { male: 0, female: 1, unknown: 2 };
  const ga = normalizeGender(a.gender) ?? 'unknown';
  const gb = normalizeGender(b.gender) ?? 'unknown';
  return (rank[ga] - rank[gb]);
};

// urutkan berdasarkan divisi pertama yang dikenal (kalau tak ada, taruh di bawah)
const DIVISION_ORDER = [
  'Babel', 'Posting', 'Translator', 'Leaks',
  'Owner Grup', 'Admin Grup', 'Discord', 'AI',
  'Gvs', 'Partnership', 'Pentung',
];
const firstDivIndex = (divs = []) => {
  const idxs = divs
    .map((d) => DIVISION_ORDER.indexOf(d))
    .filter((i) => i >= 0);
  return idxs.length ? Math.min(...idxs) : 999;
};
const cmpDivision = (a, b) =>
  firstDivIndex(a._divisions) - firstDivIndex(b._divisions);

// --- single sort (semua kriteria dirangkai) ---
const sorted = useMemo(() => {
  const arr = [...filtered];

  const nameCmp = cmpName(nameDir);

  arr.sort((a, b) => {
    // 1) division (opsional)
    if (useDivisionOrder) {
      const d = cmpDivision(a, b);
      if (d !== 0) return d;
    }
    // 2) gender priority (opsional)
    if (useGenderPriority) {
      const g = cmpGender(a, b);
      if (g !== 0) return g;
    }
    // 3) name (selalu jadi tie-breaker)
    return nameCmp(a, b);
  });

  return arr;
}, [filtered, nameDir, useDivisionOrder, useGenderPriority]);


  // pagination
  const PAGE = 10;
  const STEP = 10;
  const [visible, setVisible] = useState(PAGE);
  const hasMore = visible < sorted.length;
  const showMore = () => setVisible((v) => Math.min(v + STEP, sorted.length));
  const showAll = () => setVisible(sorted.length);
  const allShown = visible >= sorted.length;

  useEffect(() => {
    setVisible(PAGE);
  }, [q, platformFilter, nameDir, useDivisionOrder, useGenderPriority]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/20 px-3 py-1 text-blue-300">
            <span>All Staf Gachaverse</span>
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold">
            Daftar Admin ({admins.length})
          </h1>
          <p className="text-white/60">Klik salah satu untuk melihat profil admin lengkap.</p>

          {/* Ringkasan total */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-white/70">
            <span className="rounded-full bg-white/5 px-3 py-1 border border-white/10">
              Total: <span className="text-white">{summary.total}</span>
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 border border-white/10">
              Laki-laki: <span className="text-white">{summary.male}</span>
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 border border-white/10">
              Perempuan: <span className="text-white">{summary.female}</span>
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 border border-white/10">
              Unknown: <span className="text-white">{summary.unknown}</span>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex w-full max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <label className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari admin..."
              className="w-full rounded-2xl bg-white/5 px-9 py-2.5 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-blue-500/50"
            />
          </label>

          {/* Platform filter */}
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/10">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'whatsapp', label: 'Whatsapp' },
              { key: 'discord', label: 'Discord' },
            ].map((opt) => {
              const active = platformFilter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setPlatformFilter(opt.key)}
                  className={`px-4 py-2 text-sm ${
                    active ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
                  } transition-colors`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Sort + Hierarki */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortOpen(true)}
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Sort by
            </button>
            <Link
              href="/admins/hierarki"
              className="rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Hierarki Gachaverse
            </Link>
          </div>
        </div>

        {/* Hasil / counter */}
        <div className="mb-4 w-full max-w-6xl text-white/60 text-sm">
          Menampilkan <span className="text-white">{Math.min(visible, sorted.length)}</span> dari{' '}
          <span className="text-white">{sorted.length}</span> hasil.
        </div>

        {/* Grid */}
        <div className="grid w-full mx-auto max-w-7xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 auto-rows-fr">
          {sorted.slice(0, visible).map((a) => {
            const isRestricted = a._restricted;
            const href = isRestricted ? '#' : `/admins/${a.slug}`;

            return (
              <div key={a.slug} className="h-full">
                <Link
                  href={href}
                  onClick={(e) => {
                    if (isRestricted) e.preventDefault();
                  }}
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-3xl block h-full"
                >
                  {/* >>> Card dengan bg blur dari foto profil <<< */}
                  <Card
                    bgSrc={a.img || '/admins/placeholder.jpg'}
                    className="text-center flex flex-col items-center justify-start"
                  >
                    {/* Lock badge utk Pentung */}
                    {isRestricted && (
                      <span className="absolute right-3 top-3 rounded-full bg-red-500/20 px-2 py-0.5 text-[11px] text-red-300 border border-red-300/30">
                        Terkunci
                      </span>
                    )}

                    {/* Avatar */}
                    <div
                      className="overflow-hidden rounded-full border border-white/25 bg-white/10"
                      style={{ width: 80, height: 80 }}
                    >
                      <img
                        src={a.img || '/admins/placeholder.jpg'}
                        alt={a.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Nama + gender */}
                    <div className="mt-3 flex items-center justify-center gap-2 min-h-[22px]">
                      <div className="text-sm font-medium leading-tight">{a.name}</div>
                      <GenderBadge gender={a.gender} />
                    </div>

                    {/* Divisions badge */}
                    {Array.isArray(a._divisions) && a._divisions.length > 0 ? (
                      <div className="mt-2 flex items-center justify-center gap-1 flex-nowrap overflow-hidden min-h-[28px]">
                        {a._divisions.slice(0, 2).map((d) => (
                          <Chip key={d}>{d}</Chip>
                        ))}
                        {a._divisions.length > 2 && (
                          <span className="text-[11px] text-white/60">+{a._divisions.length - 2}</span>
                        )}
                      </div>
                    ) : (
                      <div className="min-h-[28px]" />
                    )}

                    <div className="mt-auto" />
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Kontrol pagination */}
        <div className="mt-6 w-full max-w-6xl flex items-center justify-between gap-3">
          <button
            onClick={showMore}
            disabled={!hasMore}
            className="rounded-2xl bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/15 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={!hasMore}
          >
            Lihat 10 lainnya
          </button>

        <button
            onClick={showAll}
            disabled={allShown}
            className="rounded-2xl bg-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/15 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-disabled={allShown}
          >
            Lihat semua
          </button>
        </div>

        {/* Back */}
        <div className="mt-10">
          <a
            href="/"
            className="inline-block rounded-2xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
          >
            ← Kembali ke Beranda
          </a>
        </div>
      </div>

      {/* Sort modal */}
      <SortModal
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        nameDir={nameDir}
        setNameDir={setNameDir}
        useDivisionOrder={useDivisionOrder}
        setUseDivisionOrder={setUseDivisionOrder}
        useGenderPriority={useGenderPriority}
        setUseGenderPriority={setUseGenderPriority}
      />
    </main>
  );
}
