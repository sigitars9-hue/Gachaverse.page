// app/admins/[slug]/ClientProfile.jsx
"use client";

import Link from "next/link";
import MultiIcon from "../../../components/MultiIcon";
import LaporAdminButtonClient from "../../../components/LaporAdminButtonClient";
import TinyMusicButton from "../../../components/TinyMusicButton";
import {
  CalendarCheck,
  Phone,
  Shield,
  Sparkles,
  Gamepad2,
  ChevronLeft,
  Home,
  Lock,
  EyeOff,
} from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

/* ========================= Helpers kecil ========================= */
function normalizeGender(g) {
  if (!g) return null;
  const s = String(g).trim().toLowerCase();
  const male = ["male", "m", "l", "pria", "cowok", "laki", "laki-laki", "laki laki"];
  const female = ["female", "f", "p", "wanita", "cewek", "perempuan"];
  if (male.includes(s)) return "male";
  if (female.includes(s)) return "female";
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
  const isMale = g === "male";
  const color = isMale
    ? "text-blue-300 border-blue-400/30 bg-blue-400/10"
    : "text-pink-300 border-pink-400/30 bg-pink-400/10";
  const symbol = isMale ? "♂" : "♀";
  const label = isMale ? "Laki-laki" : "Perempuan";
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
function toRoleKey(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z\-]/g, "");
}
const ROLE_ALIASES = {
  "Konten Kreator expert": "Best Creator",
  "Sekretaris Gvstore": "Sekretaris",
  "Head admin": "Head Admin",
  "Co-owner group": "Co-owner Group",
};
function canonicalRole(label) {
  const clean = String(label || "").trim();
  return ROLE_ALIASES[clean] ?? clean;
}
const ROLE_GRADIENT = {
  founder: "from-amber-600/85 via-amber-500/75 to-yellow-500/65",
  "co-founder": "from-amber-500/85 via-orange-500/70 to-yellow-500/60",
  "head-admin": "from-rose-600/85 via-red-500/70 to-orange-500/60",

  "owner-gvstore": "from-pink-600/85 via-rose-500/70 to-fuchsia-500/60",
  sekretaris: "from-rose-500/85 via-pink-500/70 to-fuchsia-400/60",

  "best-creator": "from-emerald-600/85 via-emerald-500/70 to-green-500/60", // emerald
  mascot: "from-pink-600/85 via-rose-500/70 to-fuchsia-500/60", // tukar ke warna GVS/sekretaris
  moderator: "from-violet-700/85 via-purple-600/75 to-fuchsia-600/60",
  "owner-group": "from-indigo-700/85 via-blue-600/70 to-sky-600/60",
  "co-owner-group": "from-blue-700/85 via-sky-600/70 to-cyan-600/60",
  admin: "from-slate-700/85 via-blue-700/70 to-sky-600/60",
};
function pickRole(a) {
  if (typeof a?.role === "string" && a.role.trim()) return canonicalRole(a.role.trim());
  if (Array.isArray(a?.roles) && a.roles.length)
    return canonicalRole(String(a.roles[0]).trim());

  const hay = `${a?.responsibility ?? ""} ${
    Array.isArray(a?.skills) ? a.skills.join(" ") : ""
  }`.toLowerCase();

  if (/(^|[\s-])founder($|[\s-])|pendiri/.test(hay)) return "Founder";
  if (/(co[\s-]?founder|wakil\s*pendiri)/.test(hay)) return "Co-founder";
  if (/(head\s*admin|lead\s*admin|ketua\s*admin)/.test(hay)) return "Head Admin";

  if (/(owner\s*gvstore|gvstore\s*owner|gv\s*store\s*owner)/.test(hay)) return "Owner Gvstore";
  if (/(sekretaris(\s*gvstore)?|secretary)/.test(hay)) return "Sekretaris";

  if (/(konten\s*kreator|content\s*creator|best\s*creator)/.test(hay)) return "Best Creator";
  if (/(mascot|maskot)/.test(hay)) return "Mascot";

  if (/(moderator|\bmod\b|discord\s*mod)/.test(hay)) return "Moderator";

  if (/(owner\s*group|group\s*owner)/.test(hay)) return "Owner Group";
  if (/(co[\s-]?owner\s*group|group\s*co[\s-]?owner)/.test(hay)) return "Co-owner Group";

  if (/admin/.test(hay)) return "Admin";
  return "Admin";
}
function pickRoleGradient(roleLabel) {
  const canonical = canonicalRole(roleLabel);
  const key = toRoleKey(canonical);
  return ROLE_GRADIENT[key] ?? ROLE_GRADIENT["admin"];
}

/* ==== SHIMMER: whitelist & helper ==== */
const SHIMMER_ROLES = new Set([
  "founder",
  "co-founder",
  "head-admin",
  "best-creator",
  "owner-group",
  "owner-gvstore",
  "sekretaris",
]);
function shouldShimmer(roleLabel) {
  const key = toRoleKey(canonicalRole(roleLabel));
  return SHIMMER_ROLES.has(key);
}

function isPentungDivision(a) {
  const bucket = [];
  if (Array.isArray(a?.division)) bucket.push(...a.division);
  if (Array.isArray(a?.divisions)) bucket.push(...a.divisions);
  if (Array.isArray(a?.teams)) bucket.push(...a.teams);
  if (Array.isArray(a?.tags)) bucket.push(...a.tags);
  if (typeof a?.division === "string") bucket.push(a.division);
  if (typeof a?.role === "string") bucket.push(a.role);
  if (Array.isArray(a?.roles)) bucket.push(...a.roles);

  const hay = `${a?.responsibility ?? ""} ${
    Array.isArray(a?.skills) ? a.skills.join(" ") : ""
  }`.toLowerCase();

  const arrHit = bucket.some((v) => String(v || "").toLowerCase().includes("pentung"));
  const strHit = /pentung/.test(hay);
  return arrHit || strHit;
}

function textHay(a) {
  return [
    ...(Array.isArray(a.skills) ? a.skills : []),
    a.role || "",
    a.responsibility || "",
    ...(Array.isArray(a.divisions) ? a.divisions : []),
    ...(Array.isArray(a.tags) ? a.tags : []),
  ]
    .join(" ")
    .toLowerCase();
}
function hasToken(hay, token) {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(`(?:^|[^a-z0-9])${esc}(?=[^a-z0-9]|$)`, "i");
  return rx.test(hay);
}

/* ========================= Ikon Games & Platforms ========================= */
// GAME ICON BASE (untuk MultiIcon): tanpa ekstensi, MultiIcon akan coba svg/webp/png
const GAME_ICON_MAP = {
  hsr: { base: "/icons/games/hsr", title: "Honkai: Star Rail" },
  gi: { base: "/icons/games/gi", title: "Genshin Impact" },
  ak: { base: "/icons/games/ak", title: "Arknights" },
  ba: { base: "/icons/games/ba", title: "Blue Archive" },
  pgr: { base: "/icons/games/pgr", title: "Punishing: Gray Raven" },
  wuwa: { base: "/icons/games/wuwa", title: "Wuthering Waves" },
  hi: { base: "/icons/games/hi", title: "Honkai Impact 3rd" },
  zzz: { base: "/icons/games/zzz", title: "Zenless Zone Zero" },
  al: { base: "/icons/games/al", title: "Azur Lane" },
  gfl: { base: "/icons/games/gfl", title: "Girls’ Frontline" },
  persona: { base: "/icons/games/persona", title: "Persona" },
  roblox: { base: "/icons/games/roblox", title: "Roblox" },
  strinova: { base: "/icons/games/strinova", title: "Strinova" },
  tot: { base: "/icons/games/tot", title: "Tears of Themis" },
  lads: { base: "/icons/games/lads", title: "Love and Deep Space" },
  valorant: { base: "/icons/games/valorant", title: "Valorant" },
  bandori: { base: "/icons/games/bandori", title: "BanG Dream!" },
  pjsk: { base: "/icons/games/pjsk", title: "Project Sekai" },
  ag: { base: "/icons/games/ag", title: "Aether Gazer" },
  df: { base: "/icons/games/df", title: "DF" },
  gbf: { base: "/icons/games/gbf", title: "Granblue Fantasy" },
  fgo: { base: "/icons/games/fgo", title: "Fate Grand Order" },
  pokemon: { base: "/icons/games/pokemon", title: "Pokemon" },
  reverse: { base: "/icons/games/reverse", title: "Reverse: 1999" },
  mlbb: { base: "/icons/games/mlbb", title: "Mobile Legends: Bang Bang" },
  nc: { base: "/icons/games/nc", title: "Neural Cloud" },
  minecraft: { base: "/icons/games/minecraft", title: "Minecraft" },
  umamusume: { base: "/icons/games/umamusume", title: "Umamusume: Pretty Derby" },
  pubg: { base: "/icons/games/pubg", title: "PUBG" },
  guardiantales: { base: "/icons/games/guardiantales", title: "Guardian Tales" },
  limbus: { base: "/icons/games/limbus", title: "Limbus Company" },
};

// GAME matcher (untuk deteksi dari teks)
export const GAME_MATCHERS = [
  { key: "hsr", title: "Honkai: Star Rail", aliases: ["hsr","star rail","honkai star rail","honkai: star rail"] },
  { key: "gi", title: "Genshin Impact", aliases: ["gi","genshin","genshin impact"] },
  { key: "ak", title: "Arknights", aliases: ["ak","arknights"] },
  { key: "ba", title: "Blue Archive", aliases: ["ba","blue archive"] },
  { key: "pgr", title: "Punishing: Gray Raven", aliases: ["pgr","punishing gray raven","punishing: gray raven"] },
  { key: "wuwa", title: "Wuthering Waves", aliases: ["wuwa","wuthering waves"] },
  { key: "hi", title: "Honkai Impact 3rd", aliases: ["hi","honkai impact 3","honkai impact 3rd","hi3rd"] },
  { key: "zzz", title: "Zenless Zone Zero", aliases: ["zzz","zenless zone zero","zenless"] },
  { key: "al", title: "Azur Lane", aliases: ["al","azur lane"] },
  { key: "gfl", title: "Girls’ Frontline", aliases: ["gfl","girls frontline","girls' frontline"] },
  { key: "persona", title: "Persona", aliases: ["persona","persona 5","p5","persona5","persona series"] },
  { key: "roblox", title: "Roblox", aliases: ["roblox"] },
  { key: "strinova", title: "Strinova", aliases: ["strinova","stri nova"] },
  { key: "tot", title: "Tears of Themis", aliases: ["tot","tear of themis"] },
  { key: "lads", title: "Love and Deep Space", aliases: ["lads","love and deep space"] },
  { key: "valorant", title: "Valorant", aliases: ["valorant","valo"] },
  { key: "bandori", title: "BanG Dream!", aliases: ["bandori","bang dream","bangdream"] },
  { key: "pjsk", title: "Project Sekai", aliases: ["pjsk","project sekai","pjsk colorful stage","colorful stage"] },
  { key: "ag", title: "Aether Gazer", aliases: ["ag","aether gazer"] },
  { key: "df", title: "DF", aliases: ["df"] },
  { key: "gbf", title: "Granblue Fantasy", aliases: ["gbf","granblue fantasy","gran blue fantasy"] },
  { key: "fgo", title: "Fate Grand Order", aliases: ["fgo","fate grand order","fate/go"] },
  { key: "pokemon", title: "Pokemon", aliases: ["pokemon","pokémon","poke"] },
  { key: "reverse", title: "Reverse: 1999", aliases: ["reverse 1999","reverse-1999","reverse"] },
  { key: "mlbb", title: "Mobile Legends: Bang Bang", aliases: ["mlbb","mobile legends","mobile legends bang bang"] },
  { key: "nc", title: "Neural Cloud", aliases: ["nc","neural cloud"] },
  { key: "minecraft", title: "Minecraft", aliases: ["minecraft","mc"] },
  { key: "umamusume", title: "Umamusume: Pretty Derby", aliases: ["umamusume","uma musume","pretty derby"] },
  { key: "pubg", title: "PUBG", aliases: ["pubg","playerunknown battlegrounds","playerunknown’s battlegrounds"] },
  { key: "guardiantales", title: "Guardian Tales", aliases: ["guardian tales","guardiantales","guardian"] },
  { key: "limbus", title: "Limbus Company", aliases: ["limbus company","limbus","limbus: company"] },
];

const PLATFORM_ICONS = {
  whatsapp: { base: "/icons/platforms/whatsapp", title: "WhatsApp" },
  discord: { base: "/icons/platforms/discord", title: "Discord" },
  instagram: { base: "/icons/platforms/instagram", title: "Instagram" },
  tiktok: { base: "/icons/platforms/tiktok", title: "TikTok" },
  youtube: { base: "/icons/platforms/youtube", title: "YouTube" },
  x: { base: "/icons/platforms/x", title: "X" },
};
const PLATFORM_LABEL = {
  whatsapp: "WhatsApp",
  discord: "Discord",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "x",
};

function hasTokenList(hay, list) {
  return list.some((kw) => {
    const k = kw.toLowerCase().trim();
    return k.includes(" ") ? hay.includes(k) : hasToken(hay, k);
  });
}
export function normalizeGames(list) {
  if (!list) return [];
  const items = Array.isArray(list) ? list : String(list).split(/[,\|/]+/);
  const map = {
    "aether gazer": "ag",
    aethergazer: "ag",
    ag: "ag",
    ak: "ak",
    arknights: "ak",
    al: "al",
    "azur lane": "al",
    azurlane: "al",
    bandori: "bandori",
    "bang dream": "bandori",
    "girls band party": "bandori",
    ba: "ba",
    "blue archive": "ba",
    df: "df",
    gi: "gi",
    genshin: "gi",
    "genshin impact": "gi",
    gfl: "gfl",
    "girls' frontline": "gfl",
    "girls frontline": "gfl",
    gbf: "gbf",
    "granblue fantasy": "gbf",
    "grand order": "fgo",
    fgo: "fgo",
    "fate grand order": "fgo",
    "fate/grand order": "fgo",
    guardiantales: "guardiantales",
    "guardian tales": "guardiantales",
    hi: "hi",
    hsr: "hsr",
    "honkai star rail": "hsr",
    "honkai: star rail": "hsr",
    "star rail": "hsr",
    limbus: "limbus",
    lads: "lads",
    minecraft: "minecraft",
    mlbb: "mlbb",
    "mobile legends": "mlbb",
    "mobile legends bang bang": "mlbb",
    "neural cloud": "nc",
    "girls' frontline: neural cloud": "nc",
    "girls frontline neural cloud": "nc",
    "gfl nc": "nc",
    gflnc: "nc",
    persona: "persona",
    pgr: "pgr",
    "punishing gray raven": "pgr",
    "punishing: gray raven": "pgr",
    pjsk: "pjsk",
    "project sekai": "pjsk",
    "colorful stage": "pjsk",
    pubg: "pubg",
    reverse: "reverse",
    roblox: "roblox",
    tot: "tot",
    "tears of themis": "tot",
    umamusume: "umamusume",
    uma: "umamusume",
    valorant: "valorant",
    valo: "valorant",
    wuwa: "wuwa",
    "wuthering waves": "wuwa",
    zzz: "zzz",
    "zenless zone zero": "zzz",
  };
  const cleaned = (s) =>
    String(s).toLowerCase().trim().replace(/[_\-]+/g, " ").replace(/\s+/g, " ");
  return items
    .map(cleaned)
    .map((x) => map[x] ?? null)
    .filter(Boolean)
    .filter((v, i, self) => self.indexOf(v) === i);
}
function detectGames(admin) {
  const hay = textHay(admin);
  const set = new Set();
  for (const m of GAME_MATCHERS) {
    if (hasTokenList(hay, m.aliases)) set.add(m.key);
  }
  return Array.from(set);
}
function normalizePlatforms(list) {
  return Array.from(
    new Set((list || []).map((p) => String(p).toLowerCase().trim()))
  ).filter((p) => Object.keys(PLATFORM_ICONS).includes(p));
}
function likelyModerator(admin) {
  const hay = textHay(admin);
  return ["moderation", "moderating", "moderator", "server", "bot", "discord"].some((kw) =>
    hay.includes(kw)
  );
}
function likelyPosting(admin) {
  const hay = textHay(admin);
  return [
    "posting",
    "post",
    "content creator",
    "proofreader",
    "editor",
    "video",
    "graphic",
    "design",
    "designer",
    "instagram",
    "tiktok",
    "tik tok",
  ].some((kw) => hay.includes(kw));
}
function cleanWa(num) {
  if (!num) return null;
  const digits = String(num).replace(/\D+/g, "");
  return digits.length ? digits : null;
}
function igHref(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (s.startsWith("http")) return s;
  const handle = s.replace(/^@/, "");
  return handle ? `https://instagram.com/${handle}` : null;
}
function tiktokHref(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (s.startsWith("http")) return s;
  const handle = s.replace(/^@/, "");
  return handle ? `https://www.tiktok.com/@${handle}` : null;
}
function getDivisions(a) {
  if (Array.isArray(a?.divisions) && a.divisions.length) return a.divisions;
  if (typeof a?.division === "string" && a.division.trim()) return [a.division.trim()];
  return [];
}
const getLanguages = (a) => (Array.isArray(a?.languages) ? a.languages : []);
const getTimezone = (a) => a?.timezone || null;
const getStatus = (a) => a?.status || null;
const getLastUpdated = (a) => a?.lastUpdated || null;

/* ========================= UI sections ========================= */
function BackdropHeader({ src, tintClass = "bg-sky-400/10", className = "", children }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 w-full h-[44vh] lg:h-[320px]">
        <img src={src} alt="" aria-hidden className="h-full w-full object-cover blur-lg scale-110" />
      </div>
      <div className={`absolute top-0 left-0 w-full h-[48vh] lg:h-[360px] ${tintClass}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
function FloatingHeaderControls() {
  return (
    <div
      className="fixed inset-x-0 z-50 pointer-events-none"
      style={{
        top: "max(env(safe-area-inset-top), 1.5rem)",
        paddingLeft: "max(env(safe-area-inset-left), 0px)",
        paddingRight: "max(env(safe-area-inset-right), 0px)",
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

/* ========= Bar ikon PLATFORM (bukan game) di bawah badge role (chunk >10) ========= */
function LogosRow({ admin }) {
  const explicitPlatforms = normalizePlatforms(admin.platforms);
  const wa = cleanWa(admin.whatsapp);
  const discordUrl =
    typeof admin.discord === "string" && admin.discord.startsWith("http")
      ? admin.discord
      : typeof admin.discordInvite === "string" && admin.discordInvite.startsWith("http")
      ? admin.discordInvite
      : null;
  const instaUrl = igHref(admin.instagram);
  const tiktokUrl = tiktokHref(admin.tiktok);

  let platforms = explicitPlatforms;
  if (!platforms.length) {
    const inf = [];
    if (wa) inf.push("whatsapp");
    if (likelyModerator(admin)) inf.push("discord");
    if (likelyPosting(admin)) inf.push("instagram");
    platforms = Array.from(new Set(inf));
  }

  const platformIcons = platforms.map((p) => ({
    ...PLATFORM_ICONS[p],
    href:
      p === "whatsapp" ? (wa ? `https://wa.me/${wa}` : null)
      : p === "discord" ? discordUrl
      : p === "instagram" ? instaUrl
      : p === "tiktok" ? tiktokUrl
      : null,
  }));

  if (!platformIcons.length) return null;

  const chunk = (arr, size) => {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  };
  const rows = chunk(platformIcons, 10);

  const IconItem = ({ it, i }) =>
    it.href ? (
      <a
        key={i}
        href={it.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center shrink-0 rounded-full ring-1 ring-white/15 bg-white/10 hover:bg-white/20 transition h-11 w-11 sm:h-12 sm:w-12"
        title={it.title}
        aria-label={it.title}
      >
        <MultiIcon base={it.base} title={it.title} size={26} />
      </a>
    ) : (
      <span
        key={i}
        className="inline-flex items-center justify-center shrink-0 rounded-full ring-1 ring-white/15 bg-white/10 opacity-80 h-11 w-11 sm:h-12 sm:w-12"
        title={it.title}
        aria-label={it.title}
      >
        <MultiIcon base={it.base} title={it.title} size={26} />
      </span>
    );

  return (
    <div className="relative z-20 mt-5 mb-1 flex flex-col items-center gap-3">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center justify-center gap-3 sm:gap-4 flex-nowrap">
          {row.map((it, idx) => (
            <IconItem key={`${ri}-${idx}`} it={it} i={`${ri}-${idx}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ========= Kartu: Game (ikon saja) ========= */
function GameIconsCard({ admin }) {
  const explicit = normalizeGames(admin.games);
  const keys = explicit.length ? explicit : detectGames(admin);
  const icons = keys
    .map((k) => {
      const key = k === "arknights" ? "ak" : k;
      return GAME_ICON_MAP[key];
    })
    .filter(Boolean);

  if (!icons.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
      <div className="mb-3 flex items-center gap-2 text-blue-300">
        <Gamepad2 className="h-5 w-5" />
        <span className="font-semibold">Game yang dimainkan</span>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {icons.map((it, idx) => (
          <span
            key={idx}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 md:h-11 md:w-11"
            title={it.title}
            aria-label={it.title}
          >
            <MultiIcon base={it.base} title={it.title} size={20} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ========= Penugasan Kanal (platforms detail list) ========= */
function buildChannelAssignments(a) {
  if (Array.isArray(a?.channels) && a.channels.length) {
    return a.channels
      .map((c) => ({
        platform: String(c.platform || "").toLowerCase(),
        name: c.name || "",
        handle: c.handle || "",
        url: c.url || "",
        contact: c.contact || "",
        role: c.role || "admin",
        responsibility: c.responsibility || "",
        isPrimary: !!c.isPrimary,
      }))
      .filter((c) => Object.keys(PLATFORM_ICONS).includes(c.platform));
  }
  const out = [];
  const wa = cleanWa(a.whatsapp);
  if (wa) {
    out.push({
      platform: "whatsapp",
      name: "Grup WhatsApp",
      contact: wa,
      role: "admin",
      responsibility: "Kontak/koordinasi melalui WhatsApp.",
      isPrimary: true,
    });
  }
  if (likelyModerator(a)) {
    out.push({
      platform: "discord",
      name: "Server Discord",
      url:
        typeof a.discord === "string" && a.discord.startsWith("http")
          ? a.discord
          : typeof a.discordInvite === "string" && a.discordInvite.startsWith("http")
          ? a.discordInvite
          : "",
      role: "moderator",
      responsibility: "Moderasi channel, penjadwalan event, dan pengawasan komunitas.",
    });
  }
  if (likelyPosting(a)) {
    out.push({
      platform: "instagram",
      name: "Instagram",
      url: igHref(a.instagram) || "",
      role: "editor",
      responsibility: "Kurasi dan penjadwalan konten.",
    });
  }
  return out;
}
const DEFAULT_REPORT_WA = "6281234567890";
function getReportWa(admin) {
  return (
    cleanWa(admin?.reportWa) ||
    cleanWa(process.env.NEXT_PUBLIC_REPORT_WA) ||
    cleanWa(DEFAULT_REPORT_WA)
  );
}

/* ========================= MAIN CLIENT PROFILE ========================= */
export default function ClientProfile({ admin }) {
  const photo = admin.img || "/admins/placeholder.jpg";
  const waLink = admin.whatsapp ? `https://wa.me/${admin.whatsapp}` : null;

  const roleLabel = pickRole(admin);
  const roleGrad = pickRoleGradient(roleLabel);
  const lockedPentung = isPentungDivision(admin);

  const divisions = getDivisions(admin);
  const languages = getLanguages(admin);
  const timezone = getTimezone(admin);
  const status = getStatus(admin);
  const lastUpd = getLastUpdated(admin);
  const channels = buildChannelAssignments(admin);

  return (
    <main className={`${poppins.className} min-h-screen bg-black text-white`}>
      {/* HEADER */}
      <FloatingHeaderControls />
      <BackdropHeader src={photo} tintClass="bg-sky-400/10">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-14 md:pt-20 text-center">
          <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
            <img src={photo} alt={admin.name} className="h-full w-full object-cover" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              {admin.name}
            </h1>
            <GenderBadge gender={admin.gender} />
          </div>

          {admin.responsibility && (
            <p className="mt-2 text-white/80">{admin.responsibility}</p>
          )}

          {/* Badge Role + Shimmer */}
          <span className="relative inline-flex mt-5">
            <span
              className={`
                relative inline-flex items-center justify-center
                rounded-full px-5 py-2 text-sm font-semibold text-white
                bg-gradient-to-r ${roleGrad}
                ring-1 ring-white/10 shadow-[0_6px_20px_rgba(30,58,138,0.25)]
                overflow-hidden
              `}
            >
              <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 mix-blend-overlay opacity-10" />
              {roleLabel}
            </span>

            {shouldShimmer(roleLabel) && (
              <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute -inset-2 rounded-full shine" />
              </span>
            )}
          </span>

          {/* Bar ikon PLATFORM (bukan game) */}
          <LogosRow admin={admin} />

          {lockedPentung && (
            <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 ring-1 ring-white/10">
              <Lock className="h-4 w-4" />
              Divisi <span className="font-semibold">Pentung</span> — akses profil dibatasi
            </div>
          )}
        </div>
      </BackdropHeader>

      {/* BODY */}
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 text-center">
        {!lockedPentung ? (
          <>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 text-left">
              {/* Keahlian */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] md:backdrop-blur p-6">
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

              {/* Game yang dimainkan (ikon-only) */}
              <GameIconsCard admin={admin} />

              {/* Tugas */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Tugas Utama</span>
                </div>
                <div className="text-white/90">{admin.responsibility ?? "-"}</div>
              </div>

              {/* Tahun bergabung */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                <div className="mb-3 flex items-center gap-2 text-blue-300">
                  <CalendarCheck className="h-5 w-5" />
                  <span className="font-semibold">Tahun bergabung</span>
                </div>
                <div className="text-white/90">{admin.joined ?? "-"}</div>
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
                  {admin.discord && admin.discord.startsWith("http") && (
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

              {/* Divisi */}
              {(() => {
                const divisions = getDivisions(admin);
                return divisions.length > 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                    <div className="mb-3 flex items-center gap-2 text-blue-300">
                      <Shield className="h-5 w-5" />
                      <span className="font-semibold">Divisi</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {divisions.map((d) => (
                        <Chip key={d}>{d}</Chip>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Bahasa */}
              {(() => {
                const langs = getLanguages(admin);
                return langs.length > 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                    <div className="mb-3 flex items-center gap-2 text-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 20v-4m0 0a4 4 0 1 1 0-8m0 8v-8m0 0V4m0 4h4m-4 0H8" />
                      </svg>
                      <span className="font-semibold">Bahasa</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {langs.map((l) => (
                        <Chip key={l}>{l}</Chip>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Zona Waktu */}
              {(() => {
                const tz = getTimezone(admin);
                return tz ? (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                    <div className="mb-3 flex items-center gap-2 text-blue-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 3" />
                      </svg>
                      <span className="font-semibold">Zona Waktu</span>
                    </div>
                    <Chip>{tz}</Chip>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Penugasan & Media Sosial */}
            {channels.length > 0 && (
              <div className="mt-6 text-left">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-blue-300 font-semibold">Penugasan & Media Sosial</div>
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
                              <div className="text-white/80 mt-1 text-sm">{ch.responsibility}</div>
                            )}
                          </div>

                          {(ch.url || ch.contact) && (
                            <div className="shrink-0">
                              <a
                                href={ch.url || (ch.contact ? `https://wa.me/${ch.contact}` : "#")}
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
          /* MODE TERKUNCI (Pentung) */
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
                  Untuk kebutuhan resmi, hubungi <span className="font-medium">Head Admin</span> atau{" "}
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

      {/* Tombol musik mini (opsional) */}
      <TinyMusicButton slug={admin.slug} />

      {/* CSS shimmer global */}
      <style jsx global>{`
        @keyframes role-shimmer {
          0%   { transform: translateX(-150%); }
          50%  { transform: translateX(-60%); }
          100% { transform: translateX(150%); }
        }
        .shine {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.28) 22%,
            rgba(255, 255, 255, 0) 45%
          );
          filter: blur(4px);
          animation: role-shimmer 2.8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
