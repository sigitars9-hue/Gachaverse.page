// app/admins/[slug]/page.jsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LaporAdminButtonClient from '../../../components/LaporAdminButtonClient';
import TinyMusicButton from "../../../components/TinyMusicButton";
import {
  CalendarCheck,
  Phone,
  Shield,
  Sparkles,
  ChevronLeft,
  Home,
  Lock,
  EyeOff,
  AlertTriangle, // ⟵ baru
} from 'lucide-react';
import { admins } from '../../../data/admins';
import { Poppins } from 'next/font/google';
import MultiIcon from '../../../components/MultiIcon'; // pastikan file ini ada

// ===== Font (Poppins) =====
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
});

/* ------------------------------ BackdropHeader ------------------------------ */
function BackdropHeader({ src, tintClass = 'bg-sky-400/10', className = '', children }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* (1) FOTO BLUR — dilebarkan tingginya agar PFP tidak mepet atas */}
      <div className="absolute top-0 left-0 w-full h-[44vh] lg:h-[320px]">
        <img
          src={src}
          alt=""
          aria-hidden
          className="h-full w-full object-cover blur-lg scale-110"
          loading="eager"
        />
      </div>

      {/* (2) TINT — ikut lebih tinggi */}
      <div className={`absolute top-0 left-0 w-full h-[48vh] lg:h-[360px] ${tintClass}`} />

      {/* (3) GRADIENT KE HITAM */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />

      {/* (4) SLOT KONTEN */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
/* --------------------------------------------------------------------------- */

/* utils */
function normalizeGender(g) {
  if (!g) return null;
  const s = String(g).trim().toLowerCase();
  const male = ['male', 'm', 'l', 'pria', 'cowok', 'laki', 'laki-laki', 'laki laki'];
  const female = ['female', 'f', 'p', 'wanita', 'cewek', 'perempuan'];
  if (male.includes(s)) return 'male';
  if (female.includes(s)) return 'female';
  return null;
}

function Chip({ children }) {
  return (
    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 border border-white/10">
      {children}
    </span>
  );
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
      className={`inline-flex items-center justify-center rounded-full border ${color} px-2 py-1 text-sm leading-none`}
      aria-label={label}
      title={label}
    >
      {symbol}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────
   ROLE DETECTION + GRADIENT
   ──────────────────────────────────────────────────────────── */
function toRoleKey(str) {
  return String(str || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z\-]/g, '');
}

// alias agar data lama (label lama) tetap berfungsi
const ROLE_ALIASES = {
  'Konten Kreator expert': 'Best Creator',
  'Sekretaris Gvstore': 'Sekretaris',
  'Head admin': 'Head Admin',
  'Co-owner group': 'Co-owner Group',
};

function canonicalRole(label) {
  const clean = String(label || '').trim();
  return ROLE_ALIASES[clean] ?? clean;
}

const ROLE_GRADIENT = {
  founder:                 'from-amber-600/85 via-amber-500/75 to-yellow-500/65',
  'co-founder':            'from-amber-500/85 via-orange-500/70 to-yellow-500/60',
  'head-admin':            'from-rose-600/85 via-red-500/70 to-orange-500/60',

  'owner-gvstore':         'from-pink-600/85 via-rose-500/70 to-fuchsia-500/60',
  sekretaris:              'from-rose-500/85 via-pink-500/70 to-fuchsia-400/60',

  'best-creator':          'from-sky-600/85 via-blue-500/70 to-indigo-500/60',
  'konten-kreator-expert': 'from-sky-600/85 via-blue-500/70 to-indigo-500/60', // legacy

  mascot:                  'from-emerald-600/85 via-teal-500/70 to-green-500/60',
  moderator:               'from-violet-700/85 via-purple-600/75 to-fuchsia-600/60',
  'owner-group':           'from-indigo-700/85 via-blue-600/70 to-sky-600/60',
  'co-owner-group':        'from-blue-700/85 via-sky-600/70 to-cyan-600/60',
  admin:                   'from-slate-700/85 via-blue-700/70 to-sky-600/60',
};

function pickRole(a) {
  if (typeof a?.role === 'string' && a.role.trim()) return canonicalRole(a.role.trim());
  if (Array.isArray(a?.roles) && a.roles.length)     return canonicalRole(String(a.roles[0]).trim());

  const hay = `${a?.responsibility ?? ''} ${(Array.isArray(a?.skills) ? a.skills.join(' ') : '')}`
    .toLowerCase();

  if (/(^|[\s-])founder($|[\s-])|pendiri/.test(hay))                       return 'Founder';
  if (/(co[\s-]?founder|wakil\s*pendiri)/.test(hay))                        return 'Co-founder';
  if (/(head\s*admin|lead\s*admin|ketua\s*admin)/.test(hay))                return 'Head Admin';

  if (/(owner\s*gvstore|gvstore\s*owner|gv\s*store\s*owner)/.test(hay))     return 'Owner Gvstore';
  if (/(sekretaris(\s*gvstore)?|secretary)/.test(hay))                       return 'Sekretaris';

  if (/(konten\s*kreator|content\s*creator|best\s*creator)/.test(hay))      return 'Best Creator';
  if (/(mascot|maskot)/.test(hay))                                          return 'Mascot';

  if (/(moderator|\bmod\b|discord\s*mod)/.test(hay))                        return 'Moderator';

  if (/(owner\s*group|group\s*owner)/.test(hay))                            return 'Owner Group';
  if (/(co[\s-]?owner\s*group|group\s*co[\s-]?owner)/.test(hay))            return 'Co-owner Group';

  if (/admin/.test(hay))                                                    return 'Admin';
  return 'Admin';
}

function pickRoleGradient(roleLabel) {
  const canonical = canonicalRole(roleLabel);
  const key = toRoleKey(canonical);
  return ROLE_GRADIENT[key] ?? ROLE_GRADIENT['admin'];
}

/* ────────────────────────────────────────────────────────────
   PENTUNG DETECTOR (LOCKED DIVISION)
   ──────────────────────────────────────────────────────────── */
function isPentungDivision(a) {
  const bucket = [];
  if (Array.isArray(a?.division)) bucket.push(...a.division);
  if (Array.isArray(a?.divisions)) bucket.push(...a.divisions);
  if (Array.isArray(a?.teams)) bucket.push(...a.teams);
  if (Array.isArray(a?.tags)) bucket.push(...a.tags);
  if (typeof a?.division === 'string') bucket.push(a.division);
  if (typeof a?.role === 'string') bucket.push(a.role);
  if (Array.isArray(a?.roles)) bucket.push(...a.roles);

  const hay = (
    `${a?.responsibility ?? ''} ` +
    `${Array.isArray(a?.skills) ? a.skills.join(' ') : ''}`
  ).toLowerCase();

  const arrHit = bucket.some((v) => String(v || '').toLowerCase().includes('pentung'));
  const strHit = /pentung/.test(hay);
  return arrHit || strHit;
}

/* ────────────────────────────────────────────────────────────
   LOGO BAR (GAME + PLATFORM) — Multi format via MultiIcon
   ──────────────────────────────────────────────────────────── */

// base path TANPA ekstensi → MultiIcon akan coba svg/webp/png/avif/jpg/jpeg
const GAME_ICON_MAP = {
  hsr:     { base: '/icons/games/hsr',     title: 'Honkai: Star Rail' },
  genshin: { base: '/icons/games/gi',      title: 'Genshin Impact' },
  ak:      { base: '/icons/games/ak',      title: 'Arknights' },
  ba:      { base: '/icons/games/ba',      title: 'Blue Archive' },
  pgr:     { base: '/icons/games/pgr',     title: 'Punishing: Gray Raven' },
  wuwa:    { base: '/icons/games/wuwa',    title: 'Wuthering Waves' },
  hi3:     { base: '/icons/games/hi3',     title: 'Honkai Impact 3rd' },
  zzz:     { base: '/icons/games/zzz',     title: 'Zenless Zone Zero' },
  al:      { base: '/icons/games/al',      title: 'Azur Lane' },
  gfl:    { base: '/icons/games/gfl',    title: 'Girls’ Frontline' },
  persona: { base: '/icons/games/persona', title: 'Persona' },
  roblox:  { base: '/icons/games/roblox',  title: 'Roblox' },
  strinova:  { base: '/icons/games/strinova',  title: 'Strinova' },
  tot:  { base: '/icons/games/tot',  title: 'Tear of Themis' },
  lads:  { base: '/icons/games/lads',  title: 'Love and Deep Space' },
  valorant:  { base: '/icons/games/valorant',  title: 'Valorant' },
  bandori:  { base: '/icons/games/bandori',  title: 'BanG Dream!' },
  pjsk:  { base: '/icons/games/pjsk',  title: 'Project Sekai' },
  ag:  { base: '/icons/games/ag',  title: 'Aether Gazer' },
  df:  { base: '/icons/games/df',  title: 'DF' },
  gbf:  { base: '/icons/games/gbf',  title: 'Granblue Fantasy' },
  fgo:  { base: '/icons/games/fgo',  title: 'Fate Grand Order' },
  pokemon:  { base: '/icons/games/pokemon',  title: 'Pokemon' },
  reverse:  { base: '/icons/games/reverse-1999',  title: 'Reverse' },
  mlbb:  { base: '/icons/games/mlbb',  title: 'Mobile Legends: Bang Bang' },
  nc:  { base: '/icons/games/nc',  title: 'Neural Cloud' },
  minecraft:  { base: '/icons/games/minecraft',  title: 'Minecraft' },
  umamusume:  { base: '/icons/games/umamusume',  title: 'Umamusume: Pretty Derby' },
  pubg:  { base: '/icons/games/pubg',  title: 'PUBG' },
  guardian:  { base: '/icons/games/guardiantales',  title: 'Guardian Tales' },

};

export const GAME_MATCHERS = [
  { key: 'hsr',       title: 'Honkai: Star Rail',        aliases: ['hsr','star rail','honkai star rail','honkai: star rail'] },
  { key: 'genshin',   title: 'Genshin Impact',           aliases: ['gi','genshin','genshin impact'] },
  { key: 'ak',        title: 'Arknights',                aliases: ['ak','arknights'] },
  { key: 'ba',        title: 'Blue Archive',             aliases: ['ba','blue archive'] },
  { key: 'pgr',       title: 'Punishing: Gray Raven',    aliases: ['pgr','punishing gray raven','punishing: gray raven'] },
  { key: 'wuwa',      title: 'Wuthering Waves',          aliases: ['wuwa','wuthering waves'] },
  { key: 'hi3',       title: 'Honkai Impact 3rd',        aliases: ['hi3','honkai impact 3','honkai impact 3rd','hi3rd'] },
  { key: 'zzz',       title: 'Zenless Zone Zero',        aliases: ['zzz','zenless zone zero','zenless'] },
  { key: 'al',        title: 'Azur Lane',                aliases: ['al','azur lane'] },
  { key: 'gfl',       title: 'Girls’ Frontline',         aliases: ['gfl','girls frontline',"girls' frontline"] },
  { key: 'persona',   title: 'Persona',                  aliases: ['persona','persona 5','p5','persona5','persona series'] },
  { key: 'roblox',    title: 'Roblox',                   aliases: ['roblox'] },
  { key: 'strinova',  title: 'Strinova',                 aliases: ['strinova','stri nova'] },
  { key: 'tot',       title: 'Tear of Themis',           aliases: ['tot','tear of themis'] },
  { key: 'lads',      title: 'Love and Deep Space',      aliases: ['lads','love and deep space'] },
  { key: 'valorant',  title: 'Valorant',                 aliases: ['valorant','valo'] },
  { key: 'bandori',   title: 'BanG Dream!',              aliases: ['bandori','bang dream','bangdream'] },
  { key: 'pjsk',      title: 'Project Sekai',            aliases: ['pjsk','project sekai','pjsk colorful stage','colorful stage'] },
  { key: 'ag',        title: 'Aether Gazer',             aliases: ['ag','aether gazer'] },
  { key: 'df',        title: 'DF',                       aliases: ['df'] },
  { key: 'gbf',       title: 'Granblue Fantasy',         aliases: ['gbf','granblue fantasy','gran blue fantasy'] },
  { key: 'fgo',       title: 'Fate Grand Order',         aliases: ['fgo','fate grand order','fate/go'] },
  { key: 'pokemon',   title: 'Pokemon',                  aliases: ['pokemon','pokémon','poke'] },
  { key: 'reverse',   title: 'Reverse',                  aliases: ['reverse 1999','reverse-1999','reverse'] },
  { key: 'mlbb',      title: 'Mobile Legends: Bang Bang',aliases: ['mlbb','mobile legends','mobile legends bang bang'] },
  { key: 'nc',        title: 'Neural Cloud',             aliases: ['nc','neural cloud'] },
  { key: 'minecraft', title: 'Minecraft',                aliases: ['minecraft','mc'] },
  { key: 'umamusume', title: 'Umamusume: Pretty Derby',  aliases: ['umamusume','uma musume','pretty derby'] },
  { key: 'pubg',      title: 'PUBG',                     aliases: ['pubg','playerunknown battlegrounds','playerunknown’s battlegrounds'] },
  { key: 'guardian',  title: 'Guardian Tales',           aliases: ['guardian tales','guardiantales','guardian'] },
];

const PLATFORM_ICONS = {
  whatsapp:  { base: '/icons/platforms/whatsapp',  title: 'WhatsApp' },
  discord:   { base: '/icons/platforms/discord',   title: 'Discord' },
  instagram: { base: '/icons/platforms/instagram', title: 'Instagram' },
  tiktok:    { base: '/icons/platforms/tiktok',    title: 'TikTok' },
  youtube:   { base: '/icons/platforms/youtube',   title: 'YouTube' },
  twitter:   { base: '/icons/platforms/twitter',   title: 'Twitter/X' },
};

function textHay(a) {
  return [
    ...(Array.isArray(a.skills) ? a.skills : []),
    a.role || '',
    a.responsibility || '',
    ...(Array.isArray(a.divisions) ? a.divisions : []),
    ...(Array.isArray(a.tags) ? a.tags : []),
  ]
    .join(' ')
    .toLowerCase();
}

// cocokkan singkatan sebagai token utuh
function hasToken(hay, token) {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rx = new RegExp(`(?:^|[^a-z0-9])${esc}(?=[^a-z0-9]|$)`, 'i');
  return rx.test(hay);
}

function detectGames(admin) {
  const hay = textHay(admin);
  const set = new Set();

  for (const m of GAME_MATCHERS) {
    const list = Array.isArray(m.aliases) ? m.aliases : []; // <-- guard
    const hit = list.some((kw) => {
      const k = kw.toLowerCase().trim();
      return k.includes(' ') ? hay.includes(k) : hasToken(hay, k);
    });
    if (hit) set.add(m.key);
  }
  return Array.from(set);
}


function likelyModerator(admin) {
  const hay = textHay(admin);
  return ['moderation', 'moderating', 'moderator', 'server', 'bot', 'discord'].some((kw) =>
    hay.includes(kw)
  );
}

function likelyPosting(admin) {
  const hay = textHay(admin);
  return [
    'posting',
    'post',
    'content creator',
    'proofreader',
    'editor',
    'video',
    'graphic',
    'design',
    'designer',
    'instagram',
    'tiktok',
    'tik tok',
  ].some((kw) => hay.includes(kw));
}

function cleanWa(num) {
  if (!num) return null;
  const digits = String(num).replace(/\D+/g, '');
  return digits.length ? digits : null;
}

function igHref(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (s.startsWith('http')) return s;
  const handle = s.replace(/^@/, '');
  return handle ? `https://instagram.com/${handle}` : null;
}
function tiktokHref(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (s.startsWith('http')) return s;
  const handle = s.replace(/^@/, '');
  return handle ? `https://www.tiktok.com/@${handle}` : null;
}

// divisions/languages helpers
function getDivisions(a) {
  if (Array.isArray(a?.divisions) && a.divisions.length) return a.divisions;
  if (typeof a?.division === 'string' && a.division.trim()) return [a.division.trim()];
  return [];
}
const getLanguages = (a) => Array.isArray(a?.languages) ? a.languages : [];
const getTimezone  = (a) => a?.timezone || null;
const getStatus    = (a) => a?.status || null;
const getLastUpdated = (a) => a?.lastUpdated || null;

// explicit fields (new) normalizer
const normalizePlatforms = (list) =>
  Array.from(new Set((list || []).map((p) => String(p).toLowerCase().trim())))
    .filter((p) => Object.keys(PLATFORM_ICONS).includes(p));

// Kembalikan array slug unik sesuai ikon di /public/games/<slug>.png (atau sesuai lokasi kamu)
export function normalizeGames(list) {
  if (!list) return [];
  const items = Array.isArray(list)
    ? list
    : String(list).split(/[,\|/]+/); // dukung "a, b | c"

  // alias → canonical slug (harus sama dengan nama ikon)
  const map = {
    // Aether Gazer
    'aether gazer': 'aether-gazer', 'aethergazer': 'aether-gazer', 'ag': 'aether-gazer',

    // Arknights
    'ak': 'ak', 'arknights': 'ak',

    // Azur Lane
    'al': 'al', 'azur lane': 'al', 'azurlane': 'al',

    // Bandori / BanG Dream!
    'bandori': 'bandori', 'bang dream': 'bandori',
    'bang dream! girls band party': 'bandori', 'girls band party': 'bandori',

    // Blue Archive
    'ba': 'ba', 'blue archive': 'ba', 'bluearchive': 'ba',

    // DF (biarkan apa adanya; tambah alias kalau perlu)
    'df': 'df',

    // Genshin Impact
    'gi': 'gi', 'genshin': 'gi', 'genshin impact': 'gi',

    // Girls' Frontline (GFL)
    'gfl': 'gfl', "girls' frontline": 'gfl', 'girls frontline': 'gfl',

    // Granblue Fantasy
    'gbf': 'gbf', 'granblue fantasy': 'gbf',

    // Fate/Grand Order
    'grand order': 'grand-order', 'fgo': 'grand-order',
    'fate grand order': 'grand-order', 'fate/grand order': 'grand-order',

    // Guardian Tales
    'guardian tales': 'guardian-tales', 'guardiantales': 'guardian-tales',

    // Honkai Impact 3rd
    'hi3': 'hi3rd', 'hi3rd': 'hi3rd', 'honkai impact 3rd': 'hi3rd',

    // Honkai: Star Rail
    'hsr': 'hsr', 'honkai star rail': 'hsr', 'honkai: star rail': 'hsr', 'star rail': 'hsr',

    // Limbus Company
    'limbus company': 'limbus-company', 'limbuscompany': 'limbus-company',

    // LaDS (internal)
    'lads': 'lads',

    // Minecraft
    'minecraft': 'minecraft',

    // Mobile Legends: Bang Bang
    'mlbb': 'mlbb', 'mobile legends': 'mlbb',
    'mobile legends bang bang': 'mlbb', 'mobilelegends': 'mlbb',

    // Neural Cloud (Girls' Frontline: Neural Cloud)
    'neural cloud': 'neural-cloud',
    "girls' frontline: neural cloud": 'neural-cloud',
    'girls frontline neural cloud': 'neural-cloud',
    'gfl nc': 'neural-cloud', 'gflnc': 'neural-cloud',

    // Persona 5: The Phantom X
    'persona 5 x the phantom': 'p5x',
    'persona 5 the phantom x': 'p5x',
    'p5x': 'p5x', 'persona': 'p5x',

    // Punishing: Gray Raven
    'pgr': 'pgr', 'punishing gray raven': 'pgr', 'punishing: gray raven': 'pgr',

    // Project Sekai / Colorful Stage
    'pjsk': 'pjsk', 'project sekai': 'pjsk',
    'hatsune miku: colorful stage': 'pjsk', 'colorful stage': 'pjsk',

    // PUBG
    'pubg': 'pubg', 'pubg mobile': 'pubg',

    // Reverse: 1999
    'reverse 1999': 'reverse-1999', 'r1999': 'reverse-1999',

    // Roblox
    'roblox': 'roblox',

    // Tears of Themis
    'tot': 'tot', 'tears of themis': 'tot',

    // Umamusume: Pretty Derby
    'umamusume': 'umamusume', 'uma': 'umamusume',

    // Valorant
    'valorant': 'valorant', 'valo': 'valorant',

    // Wuthering Waves
    'wuwa': 'wuwa', 'wuthering waves': 'wuwa',

    // Zenless Zone Zero
    'zzz': 'zzz', 'zenless zone zero': 'zzz',
  };

  const cleaned = (s) =>
    String(s)
      .toLowerCase()
      .trim()
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ');

  return items
    .map(cleaned)
    .map((x) => map[x] ?? null)
    .filter(Boolean)
    .filter((v, i, self) => self.indexOf(v) === i); // unik & urutan input
}

/* ===== LogosRow: ikon game + platform tepat di bawah pill role ===== */
function LogosRow({ admin }) {
  // games: explicit > detect
  const explicitGames = normalizeGames(admin.games);
  const gameKeys = explicitGames.length ? explicitGames : detectGames(admin);
  const gameIcons = gameKeys.map((k) => {
    const key = k === 'arknights' ? 'ak' : k;
    return GAME_ICON_MAP[key];
  }).filter(Boolean);

  // platforms: explicit > infer
  const explicitPlatforms = normalizePlatforms(admin.platforms);
  const wa = cleanWa(admin.whatsapp);
  const discordUrl =
    typeof admin.discord === 'string' && admin.discord.startsWith('http')
      ? admin.discord
      : typeof admin.discordInvite === 'string' && admin.discordInvite.startsWith('http')
      ? admin.discordInvite
      : null;
  const instaUrl = igHref(admin.instagram);
  const tiktokUrl = tiktokHref(admin.tiktok);

  let platforms = explicitPlatforms;
  if (!platforms.length) {
    const inf = [];
    if (wa) inf.push('whatsapp');
    if (likelyModerator(admin)) inf.push('discord');
    if (likelyPosting(admin)) inf.push('instagram');
    platforms = Array.from(new Set(inf));
  }

  const platformIcons = platforms.map((p) => ({
    ...PLATFORM_ICONS[p],
    href:
      p === 'whatsapp' ? (wa ? `https://wa.me/${wa}` : null)
      : p === 'discord' ? discordUrl
      : p === 'instagram' ? instaUrl
      : p === 'tiktok' ? tiktokUrl
      : null,
  }));

  const logos = [...gameIcons.map((g) => ({ ...g, href: null })), ...platformIcons];
  if (!logos.length) return null;

  return (
    // z-20 menjamin tidak ketutup overlay/tint
    <div className="relative z-20 mt-4 mb-1 flex items-center justify-center gap-3">
      {logos.map((it, idx) =>
        it.href ? (
          <a
            key={idx}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20 transition"
            title={it.title}
            aria-label={it.title}
          >
            <MultiIcon base={it.base} title={it.title} size={20} />
          </a>
        ) : (
          <span
            key={idx}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 opacity-70"
            title={it.title}
            aria-label={it.title}
          >
            <MultiIcon base={it.base} title={it.title} size={20} />
          </span>
        )
      )}
    </div>
  );
}

/* ===== Channel assignment (baru) ===== */
const PLATFORM_LABEL = {
  whatsapp: 'WhatsApp',
  discord: 'Discord',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  twitter: 'Twitter/X',
};

function buildChannelAssignments(a) {
  // jika ada explicit channels, pakai itu
  if (Array.isArray(a?.channels) && a.channels.length) {
    return a.channels
      .map((c) => ({
        platform: String(c.platform || '').toLowerCase(),
        name: c.name || '',
        handle: c.handle || '',
        url: c.url || '',
        contact: c.contact || '',
        role: c.role || 'admin',
        responsibility: c.responsibility || '',
        isPrimary: !!c.isPrimary,
      }))
      .filter((c) => Object.keys(PLATFORM_ICONS).includes(c.platform));
  }

  // fallback ringan (infer dari data yang ada)
  const out = [];
  const wa = cleanWa(a.whatsapp);
  if (wa) {
    out.push({
      platform: 'whatsapp',
      name: 'Grup WhatsApp',
      contact: wa,
      role: 'admin',
      responsibility: 'Kontak/koordinasi melalui WhatsApp.',
      isPrimary: true,
    });
  }
  if (likelyModerator(a)) {
    out.push({
      platform: 'discord',
      name: 'Server Discord',
      url:
        typeof a.discord === 'string' && a.discord.startsWith('http')
          ? a.discord
          : typeof a.discordInvite === 'string' && a.discordInvite.startsWith('http')
          ? a.discordInvite
          : '',
      role: 'moderator',
      responsibility: 'Moderasi channel, penjadwalan event, dan pengawasan komunitas.',
    });
  }
  if (likelyPosting(a)) {
    out.push({
      platform: 'instagram',
      name: 'Instagram',
      url: igHref(a.instagram) || '',
      role: 'editor',
      responsibility: 'Kurasi dan penjadwalan konten.',
    });
  }
  return out;
}

/* ====== Lapor Admin (WA) ====== */
// 3 tingkat prioritas: admin.reportWa → env NEXT_PUBLIC_REPORT_WA → konstanta default
const DEFAULT_REPORT_WA = '6281234567890'; // ganti ke nomor WA laporan umum
function getReportWa(admin) {
  return (
    cleanWa(admin?.reportWa) ||
    cleanWa(process.env.NEXT_PUBLIC_REPORT_WA) ||
    cleanWa(DEFAULT_REPORT_WA)
  );
}

function LaporAdminButton({ admin }) {
  const num = getReportWa(admin);
  if (!num) return null;
  const prefill = encodeURIComponent(
    `Halo, saya ingin melaporkan admin: ${admin.name} (slug: ${admin.slug}). Mohon ditindaklanjuti.`
  );
  const href = `https://wa.me/${num}?text=${prefill}`;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        bottom: 'max(env(safe-area-inset-bottom), 1.25rem)',
        right: 'max(env(safe-area-inset-right), 1.25rem)',
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-red-600/90 hover:bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-red-900/30 ring-1 ring-red-300/30"
        aria-label="Lapor Admin via WhatsApp"
        title="Lapor Admin via WhatsApp"
      >
        <AlertTriangle className="h-5 w-5" />
        Lapor Admin
      </a>
    </div>
  );
}

/* SSG */
export async function generateStaticParams() {
  return admins.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = admins.find((x) => x.slug === params.slug);
  return { title: a ? `${a.name} — Admin Gachaverse.id` : 'Admin' };
}

function FloatingHeaderControls() {
  return (
    <div
      className="fixed inset-x-0 z-50 pointer-events-none"
      style={{
        top: 'max(env(safe-area-inset-top), 1.5rem)',
        paddingLeft: 'max(env(safe-area-inset-left), 0px)',
        paddingRight: 'max(env(safe-area-inset-right), 0px)',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
        <Link
          href="/admins"
          aria-label="Kembali ke daftar admin"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Link
          href="/"
          aria-label="Beranda"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}

/* page */
export default function AdminProfile({ params }) {
  const admin = admins.find((a) => a.slug === params.slug);
  if (!admin) return notFound();

  const photo = admin.img || '/admins/placeholder.jpg';
  const waLink = admin.whatsapp ? `https://wa.me/${admin.whatsapp}` : null;

  const roleLabel = pickRole(admin);
  const roleGrad  = pickRoleGradient(roleLabel);
  const lockedPentung = isPentungDivision(admin);

  const divisions = getDivisions(admin);
  const languages = getLanguages(admin);
  const timezone  = getTimezone(admin);
  const status    = getStatus(admin);
  const lastUpd   = getLastUpdated(admin);
  const channels  = buildChannelAssignments(admin);

  return (
    <main className={`${poppins.className} min-h-screen bg-black text-white`}>
      {/* ===== HEADER ===== */}
      <FloatingHeaderControls />
      <BackdropHeader src={photo} tintClass="bg-sky-400/10">
        {/* padding top ditambah supaya PFP turun */}
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-14 md:pt-20 text-center">
          {/* Avatar */}
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
            <img src={photo} alt={admin.name} className="h-full w-full object-cover" />
          </div>

          {/* Nama + Gender */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              {admin.name}
            </h1>
            <GenderBadge gender={admin.gender} />
          </div>

          {/* Subtitle */}
          {admin.responsibility && (
            <p className="mt-2 text-white/80">{admin.responsibility}</p>
          )}

          {/* Badge Role */}
          <span
            className={`
              mt-5 inline-flex items-center justify-center
              rounded-full px-5 py-2 text-sm font-semibold text-white
              bg-gradient-to-r ${roleGrad}
              ring-1 ring-white/10 shadow-[0_6px_20px_rgba(30,58,138,0.25)]
            `}
          >
            {roleLabel}
          </span>

          {/* LOGO BAR — diletakkan tepat di tengah & di atas overlay (z-20) */}
          <LogosRow admin={admin} />

          {/* Pentung Notice */}
          {lockedPentung && (
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10">
              <Lock className="h-4 w-4" />
              Divisi <span className="font-semibold">Pentung</span> — akses profil dibatasi
            </div>
          )}
        </div>
      </BackdropHeader>

      {/* ===== BODY ===== */}
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 text-center">
        {!lockedPentung ? (
          <>
            {/* GRID UTAMA */}
            <div className="mt-4 grid gap-6 sm:grid-cols-2 text-left">
              {/* Keahlian */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Keahlian</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(admin.skills) && admin.skills.length ? (
                    admin.skills.map((s) => <Chip key={s}>{s}</Chip>)
                  ) : (
                    <div className="text-white/60 text-sm">-</div>
                  )}
                </div>
              </div>

              {/* Penanggung jawab */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Tugas Utama</span>
                </div>
                <div className="text-white/90">{admin.responsibility ?? '-'}</div>
              </div>

              {/* Tahun bergabung */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <CalendarCheck className="h-5 w-5" />
                  <span className="font-semibold">Tahun bergabung</span>
                </div>
                <div className="text-white/90">{admin.joined ?? '-'}</div>
              </div>

              {/* Kontak */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <Phone className="h-5 w-5" />
                  <span className="font-semibold">Kontak</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {waLink ? (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                  {admin.discord && admin.discord.startsWith('http') && (
                    <a
                      href={admin.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                    >
                      Discord
                    </a>
                  )}
                  {admin.instagram && (
                    <a
                      href={igHref(admin.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                    >
                      Instagram
                    </a>
                  )}
                  {admin.tiktok && (
                    <a
                      href={tiktokHref(admin.tiktok)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                    >
                      TikTok
                    </a>
                  )}
                  {admin.email && (
                    <a
                      href={`mailto:${admin.email}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                    >
                      Email
                    </a>
                  )}
                  {!waLink && !admin.discord && !admin.instagram && !admin.tiktok && !admin.email && (
                    <span className="text-white/60 text-sm">-</span>
                  )}
                </div>

                {/* Tombol Lapor (opsional tambahan di dalam kartu kontak) */}


{getReportWa(admin) && (
  <div className="mt-4">
    <LaporAdminButtonClient
      adminName={admin.name}
      adminSlug={admin.slug}
      waNumber={getReportWa(admin)}
    />
  </div>
)}

              </div>

              {/* Divisi (baru) */}
              {divisions.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <div className="mb-3 flex items-center gap-2 text-blue-300">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Divisi</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {divisions.map((d) => <Chip key={d}>{d}</Chip>)}
                  </div>
                </div>
              )}

              {/* Bahasa & Zona waktu (baru) */}
              {(languages.length > 0 || timezone) && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <div className="mb-3 flex items-center gap-2 text-blue-300">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Bahasa & Zona Waktu</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {languages.map((l) => <Chip key={l}>{l}</Chip>)}
                    {timezone && <Chip>{timezone}</Chip>}
                  </div>
                </div>
              )}

              {/* Status (baru) */}
              {(status || lastUpd) && (
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:col-span-2">
                  <div className="mb-2 text-blue-300 font-semibold">Status</div>
                  <div className="text-white/90">
                    {status ? <span className="mr-2">{status}</span> : null}
                    {lastUpd ? (
                      <span className="text-white/60 text-sm">
                        · diperbarui {new Date(lastUpd).toLocaleDateString('id-ID')}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Penugasan Kanal (baru) */}
            {channels.length > 0 && (
              <div className="mt-6 text-left">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-blue-300 font-semibold">Platfrom Penugasan Admin</div>
                  </div>

                  <ul className="space-y-3">
                    {channels.map((ch, i) => {
                      const icon = PLATFORM_ICONS[ch.platform];
                      const label = PLATFORM_LABEL[ch.platform] || ch.platform;
                      return (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                            <MultiIcon base={icon.base} title={icon.title} size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{label}</span>
                              {ch.name && <span className="text-white/70">• {ch.name}</span>}
                              {ch.handle && (
                                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70 border border-white/10">
                                  {ch.handle}
                                </span>
                              )}
                              {ch.role && (
                                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70 border border-white/10">
                                  {ch.role}
                                </span>
                              )}
                              {ch.isPrimary && (
                                <span className="rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 px-2 py-0.5 text-[11px]">
                                  utama
                                </span>
                              )}
                            </div>
                            {ch.responsibility && (
                              <div className="text-white/80 mt-1 text-sm">
                                {ch.responsibility}
                              </div>
                            )}
                          </div>

                          {(ch.url || ch.contact) && (
                            <div className="shrink-0">
                              <a
                                href={ch.url || (ch.contact ? `https://wa.me/${ch.contact}` : '#')}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                              >
                                Buka
                              </a>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ======= MODE TERKUNCI (Pentung) ======= */
          <div className="mt-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur text-left">
              <div className="mb-4 flex items-center gap-3 text-rose-300">
                <Lock className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Akses dibatasi</h3>
              </div>

              <p className="text-white/80">
                Profil admin pada <span className="font-semibold">Divisi Pentung</span> bersifat
                rahasia. Detail seperti keahlian, kontak, dan penanggung jawab tidak ditampilkan.
              </p>

              <ul className="mt-4 list-disc space-y-1 pl-6 text-white/70">
                <li>Hanya pimpinan tertentu yang memiliki akses.</li>
                <li>
                  Untuk kebutuhan resmi, hubungi <span className="font-medium">Head Admin</span> atau{' '}
                  <span className="font-medium">Founder</span>.
                </li>
              </ul>

              <div className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
                <EyeOff className="h-4 w-4" />
                Detail disembunyikan
              </div>
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href="/admins"
            className="rounded-2xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
          >
            ← ALL ADMIN
          </Link>
        </div>
      </div>
         <TinyMusicButton slug={admin.slug} />
    </main>
  );
}
