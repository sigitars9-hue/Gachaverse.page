// components/AdminLogoRow.jsx
import { normalizeDivisions } from "@/utils/normalizeDivisions";

// peta ikon game (ubah path kalau beda)
const GAME_ICON_MAP = {
  hsr: { src: "/icons/games/hsr.png", title: "Honkai: Star Rail" },
  genshin: { src: "/icons/games/genshin.png", title: "Genshin Impact" },
  ak: { src: "/icons/games/ak.png", title: "Arknights" },
  ba: { src: "/icons/games/ba.png", title: "Blue Archive" },
  pgr: { src: "/icons/games/pgr.png", title: "Punishing: Gray Raven" },
  wuwa: { src: "/icons/games/wuwa.png", title: "Wuthering Waves" },
  hi3: { src: "/icons/games/hi3.png", title: "Honkai Impact 3rd" },
  zzz: { src: "/icons/games/zzz.png", title: "Zenless Zone Zero" },
  al: { src: "/icons/games/al.png", title: "Azur Lane" },
  gfl2: { src: "/icons/games/gfl2.png", title: "Girls' Frontline 2" },
  persona: { src: "/icons/games/persona.png", title: "Persona" },
  roblox: { src: "/icons/games/roblox.png", title: "Roblox" },
};

// pencocokan kata kunci game
const GAME_MATCHERS = [
  { key: "hsr", kws: ["hsr", "star rail", "honkai: star rail"] },
  { key: "genshin", kws: ["genshin"] },
  { key: "ak", kws: ["ak", "arknights"] },
  { key: "ba", kws: ["ba", "blue archive"] },
  { key: "pgr", kws: ["pgr", "punishing: gray raven"] },
  { key: "wuwa", kws: ["wuwa", "wuthering waves"] },
  { key: "hi3", kws: ["hi3", "honkai impact 3rd", "hi 3"] },
  { key: "zzz", kws: ["zzz", "zenless zone zero"] },
  { key: "al", kws: ["al", "azur lane"] },
  { key: "gfl2", kws: ["gfl2", "girls frontline 2"] },
  { key: "persona", kws: ["persona"] },
  { key: "roblox", kws: ["roblox"] },
];

const PLATFORM_ICONS = {
  whatsapp: { src: "/icons/platforms/whatsapp.png", title: "WhatsApp" },
  discord: { src: "/icons/platforms/discord.png", title: "Discord" },
  instagram: { src: "/icons/platforms/instagram.png", title: "Instagram" },
};

function textHay(a) {
  return [
    ...(Array.isArray(a.skills) ? a.skills : []),
    a.role || "",
    a.responsibility || "",
    ...(normalizeDivisions(a) || []),
  ]
    .join(" ")
    .toLowerCase();
}

function detectGames(admin) {
  const hay = textHay(admin);
  const set = new Set();
  for (const m of GAME_MATCHERS) {
    if (m.kws.some((kw) => hay.includes(kw))) set.add(m.key);
  }
  return Array.from(set);
}

function likelyModerator(admin) {
  const hay = textHay(admin);
  return ["moderation", "moderating", "moderator", "server", "bot"].some((kw) =>
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
  ].some((kw) => hay.includes(kw));
}

function cleanWa(num) {
  if (!num) return null;
  const digits = String(num).replace(/\D+/g, "");
  return digits.length ? digits : null;
}

export default function AdminLogoRow({ admin }) {
  // 1) Game icons
  const gameKeys = detectGames(admin);
  const gameIcons = gameKeys
    .map((k) => GAME_ICON_MAP[k])
    .filter(Boolean)
    .map((g) => ({ ...g, href: null })); // game ikon non-link

  // 2) Platform icons (aktif jika ada data, else tampil disabled bila relevan)
  const wa = cleanWa(admin.whatsapp);
  const showDiscord = admin.discord || admin.discordInvite || likelyModerator(admin);
  const showIg = admin.instagram || likelyPosting(admin);

  const platformIcons = [];
  if (wa) {
    platformIcons.push({
      ...PLATFORM_ICONS.whatsapp,
      href: `https://wa.me/${wa}`,
    });
  } else if (likelyPosting(admin) || likelyModerator(admin)) {
    // tampilkan WA abu-abu jika relevan tapi tidak ada nomor
    platformIcons.push({ ...PLATFORM_ICONS.whatsapp, href: null });
  }

  if (showDiscord) {
    const href =
      admin.discord?.startsWith("http")
        ? admin.discord
        : admin.discordInvite?.startsWith("http")
        ? admin.discordInvite
        : null;
    platformIcons.push({ ...PLATFORM_ICONS.discord, href });
  }

  if (showIg) {
    const handle = (admin.instagram || "").replace(/^@/, "");
    const href = handle ? `https://instagram.com/${handle}` : null;
    platformIcons.push({ ...PLATFORM_ICONS.instagram, href });
  }

  const logos = [...gameIcons, ...platformIcons];
  if (!logos.length) return null;

  return (
    <div className="mt-3 flex items-center justify-center gap-3">
      {logos.map((it, idx) =>
        it.href ? (
          <a
            key={idx}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
            title={it.title}
            aria-label={it.title}
          >
            <img src={it.src} alt={it.title} className="h-5 w-5 object-contain" />
          </a>
        ) : (
          <span
            key={idx}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 opacity-60"
            title={it.title}
            aria-label={it.title}
          >
            <img src={it.src} alt={it.title} className="h-5 w-5 object-contain" />
          </span>
        )
      )}
    </div>
  );
}
