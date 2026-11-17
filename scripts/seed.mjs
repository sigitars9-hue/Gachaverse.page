import { createClient } from "@supabase/supabase-js";
import { admins } from "./admins-data.mjs";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const gender = (g) => (/^p|perempuan|wanita/i.test(g || "") ? "perempuan" : "laki-laki");
const digits = (v) => String(v || "").replace(/\D/g, "") || null;
const clean = (v) => (v && v !== "#" ? String(v).trim() : null);

const rows = admins.map((a) => ({
  slug: a.slug,
  name: a.name,
  img: a.img,
  role: a.role || "Admin",
  gender: gender(a.gender),
  skills: a.skills ?? [],
  responsibility: a.responsibility || null,
  joined: a.joined ?? null,
  divisions: a.divisions ?? [],
  languages: a.languages ?? [],
  timezone: a.timezone || null,
  status: a.status ?? "active",
  platforms: (a.platforms ?? []).map((p) => String(p).toLowerCase().trim()),
  games: a.games ?? [],
  whatsapp: digits(a.whatsapp),
  discord: clean(a.discord),
  instagram: clean(a.instagram),
  tiktok: clean(a.tiktok),
  x: clean(a.x),
  facebook: clean(a.facebook),
  channels: a.channels ?? [],
  theme_song: a.themeSong ?? null,
}));

const { error } = await db.from("admins").upsert(rows, { onConflict: "slug" });
console.log(error ?? `OK: ${rows.length} admin masuk`);