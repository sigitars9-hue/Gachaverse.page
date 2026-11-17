import { supabaseAdmin as db } from "@/lib/supabase/admin";

function rowToAdmin(r) {
  return {
    slug: r.slug, name: r.name, img: r.img, role: r.role, gender: r.gender,
    skills: r.skills ?? [], responsibility: r.responsibility, joined: r.joined,
    divisions: r.divisions ?? [], languages: r.languages ?? [],
    timezone: r.timezone, status: r.status,
    platforms: r.platforms ?? [], games: r.games ?? [],
    whatsapp: r.whatsapp, discord: r.discord, instagram: r.instagram,
    tiktok: r.tiktok, x: r.x, facebook: r.facebook, email: r.email,
    channels: r.channels ?? [], themeSong: r.theme_song,
    resignedAt: r.resigned_at, resignReason: r.resign_reason, impression: r.impression,
    lastUpdated: r.updated_at,
  };
}

// Admin divisi Pentung: buang data sensitif DI SERVER
function redact(a) {
  if (!a.divisions.some((d) => /pentung/i.test(d))) return a;
  return { slug: a.slug, name: a.name, img: a.img, role: a.role,
           gender: a.gender, divisions: a.divisions, skills: [], games: [], channels: [] };
}

export async function getAdmins() {
  const { data, error } = await db.from("admins").select("*").eq("is_visible", true);
  if (error) throw error;
  return data.map(rowToAdmin).map(redact);
}

export async function getAdminBySlug(slug) {
  const { data } = await db.from("admins").select("*").eq("slug", slug).eq("is_visible", true).maybeSingle();
  return data ? redact(rowToAdmin(data)) : null;
}

// untuk dashboard (tanpa redact)
export async function getAdminRaw(slug) {
  const { data } = await db.from("admins").select("*").eq("slug", slug).maybeSingle();
  return data;
}