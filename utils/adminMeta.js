// utils/adminMeta.js
import { admins } from "@/data/admins";
import { normalizeDivisions } from "@/utils/normalizeDivisions";

/* ───────────── ROLE ───────────── */
export const roleKey = (s = "") =>
  String(s).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z-]/g, "");

// variasi penulisan di data -> key standar
const ROLE_ALIASES = {
  "konten-kreator-expert": "best-creator",
  "sekretaris-gvstore": "sekretaris",
  "owner-grup": "owner-group",
  "co-owner-grup": "co-owner-group",
  "admin-grup": "admin",
  "admin-post": "admin",
  "admin-posting": "admin",
};
export const canonRole = (r) => {
  const k = roleKey(r);
  return ROLE_ALIASES[k] ?? k;
};

export const ROLE_LABELS = {
  founder: "Founder",
  "co-founder": "Co-founder",
  "head-admin": "Head Admin",
  "owner-gvstore": "Owner Gvstore",
  "owner-discord": "Owner Discord",
  sekretaris: "Sekretaris",
  "best-creator": "Best Creator",
  moderator: "Moderator",
  "owner-group": "Owner Group",
  "co-owner-group": "Co-owner Group",
  mascot: "Mascot",
  translator: "Translator",
  admin: "Admin",
};

export const ROLE_ORDER = [
  "founder", "co-founder", "head-admin", "owner-gvstore", "owner-discord",
  "sekretaris", "best-creator", "moderator", "owner-group", "co-owner-group",
  "mascot", "translator", "admin",
];

/* ───────────── DIVISI ───────────── */
export const KNOWN_DIVISIONS = [
  "Babel", "Posting", "Translator", "Leaks", "Owner Grup",
  "Admin Grup", "Discord", "AI", "Gvs", "Partnership",
];

const DIVISION_ALIASES = {
  babel: "Babel",
  founder: "Babel",
  "head admin": "Babel",
  posting: "Posting",
  "admin post": "Posting",
  "admin posting": "Posting",
  "owner grup": "Owner Grup",
  "owner group": "Owner Grup",
  "admin grup": "Admin Grup",
  "admin group": "Admin Grup",
  admin: "Admin Grup",
  discord: "Discord",
  leaks: "Leaks",
  translator: "Translator",
  ai: "AI",
  gvs: "Gvs",
  partnership: "Partnership",
  pentung: "Pentung",
  reverse1999: "Reverse: 1999",
  "reverse: 1999": "Reverse: 1999",
};

export const canonDivision = (d) => {
  const t = String(d || "").trim().replace(/\s+/g, " ");
  return DIVISION_ALIASES[t.toLowerCase()] ?? t;
};

// role -> divisi "rumah" (otomatis ikut dihitung di divisi itu)
const ROLE_HOME_DIVISION = {
  founder: "Babel",
  "co-founder": "Babel",
  "head-admin": "Babel",
  "owner-group": "Owner Grup",
  "co-owner-group": "Owner Grup",
  moderator: "Discord",
  "owner-discord": "Discord",
  "owner-gvstore": "Gvs",
  sekretaris: "Gvs",
  mascot: "AI",
  translator: "Translator",
};

// penulisan role mentah yang sekaligus menyebut divisi
const RAW_ROLE_DIVISION = {
  "admin-post": "Posting",
  "admin-posting": "Posting",
  "admin-grup": "Admin Grup",
};

export const isPentung = (a) =>
  (a.skills || []).some((s) => /pentung/i.test(s)) ||
  (a.divisions || []).some((d) => canonDivision(d) === "Pentung");

export function getDivisions(a) {
  const map = new Map();
  const add = (d) => {
    const c = canonDivision(d);
    if (!c || c.toLowerCase() === "semua divisi") return;
    map.set(c.toLowerCase(), c);
  };

  (a.divisions || []).forEach(add);
  try {
    const n = normalizeDivisions(a);
    if (Array.isArray(n)) n.forEach(add);
  } catch {}

  add(ROLE_HOME_DIVISION[canonRole(a.role)]);
  add(RAW_ROLE_DIVISION[roleKey(a.role)]);
  if (isPentung(a)) add("Pentung");

  return [...map.values()];
}

// semua divisi: yang tetap dulu, lalu grup game dari data, Pentung terakhir
export function getAllDivisions() {
  const seen = new Set([...KNOWN_DIVISIONS, "Pentung"].map((d) => d.toLowerCase()));
  const extra = new Map();
  for (const a of admins) {
    for (const d of getDivisions(a)) {
      const k = d.toLowerCase();
      if (!seen.has(k)) extra.set(k, d);
    }
  }
  return [
    ...KNOWN_DIVISIONS,
    ...[...extra.values()].sort((x, y) => x.localeCompare(y)),
    "Pentung",
  ];
}

/* ───────────── PENCOCOKAN ───────────── */
export function hasRole(a, rk) {
  if (canonRole(a.role) === rk) return true;
  // belum ada yang berole Owner Discord; Shizuu menulisnya di skills
  if (rk === "owner-discord") {
    return (a.skills || []).some((s) => /^owner\s*\(discord\)/i.test(s));
  }
  return false;
}

// role umum: harus cocok role DAN divisi. Role hierarki: cukup role.
const STRICT_ROLES = new Set(["admin", "moderator", "best-creator"]);

export function matchesRole(a, rk, division) {
  const okRole = hasRole(a, rk);
  if (!division) return okRole;

  const div = canonDivision(division);
  const inDiv = (a._divisions || []).some((d) => d.toLowerCase() === div.toLowerCase());

  if (rk === roleKey(div)) return okRole || inDiv; // Translator, Leaks
  if (STRICT_ROLES.has(rk)) return okRole && inDiv;
  return okRole;
}

export function roleLabel(a, division) {
  const k = canonRole(a.role);
  if (k === "admin") {
    if (division === "Posting") return "Admin Posting";
    if (division === "Admin Grup") return "Admin Grup";
  }
  return ROLE_LABELS[k] ?? (String(a.role || "").trim() || "Lainnya");
}

export function normalizeGender(g) {
  if (!g) return null;
  const s = String(g).trim().toLowerCase();
  if (["male", "m", "l", "pria", "cowok", "laki", "laki-laki", "laki laki"].includes(s)) return "male";
  if (["female", "f", "p", "wanita", "cewek", "perempuan"].includes(s)) return "female";
  return null;
}

// semua admin yang boleh tampil publik (Pentung disembunyikan)
export function getPublicAdmins() {
  return admins
    .filter((a) => !isPentung(a))
    .map((a) => ({ ...a, _divisions: getDivisions(a) }));
}