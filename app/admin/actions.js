"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, COOKIE } from "@/lib/auth";
import { supabaseAdmin as db } from "@/lib/supabase/admin";

const list = (v) => String(v || "").split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
const text = (v) => String(v || "").trim() || null;

export async function saveAdmin(formData) {
  await requireAdmin();

  const original = String(formData.get("original_slug") || "").trim();
  const isEdit = !!original;
  const slug = isEdit
    ? original // jangan diubah-ubah saat edit
    : String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  if (!slug || !formData.get("name")) throw new Error("Slug dan nama wajib diisi");

  let channels = [];
  try { channels = JSON.parse(String(formData.get("channels") || "[]")); }
  catch { throw new Error("Data channels tidak valid"); }

  const row = {
    slug,
    name: String(formData.get("name")).trim(),
    img: text(formData.get("img")),
    theme_song: text(formData.get("theme_song")),
    role: formData.get("role"),
    gender: formData.get("gender"),
    status: formData.get("status"),
    joined: Number(formData.get("joined")) || null,
    responsibility: text(formData.get("responsibility")),
    timezone: text(formData.get("timezone")),
    skills: list(formData.get("skills")),
    divisions: list(formData.get("divisions")),
    languages: list(formData.get("languages")),
    platforms: formData.getAll("platforms").map(String),
    games: formData.getAll("games").map(String),
    whatsapp: text(formData.get("whatsapp"))?.replace(/\D/g, "") || null,
    discord: text(formData.get("discord")),
    instagram: text(formData.get("instagram")),
    tiktok: text(formData.get("tiktok")),
    x: text(formData.get("x")),
    facebook: text(formData.get("facebook")),
    email: text(formData.get("email")),
    channels,
    is_visible: formData.get("is_visible") === "on",
    updated_at: new Date().toISOString(),
    resigned_at: text(formData.get("resigned_at")),
    resign_reason: text(formData.get("resign_reason")),
    impression: text(formData.get("impression")),
  };
 if (isEdit) {
    const { error } = await db.from("admins").update(row).eq("slug", original);
    if (error) throw error;
  } else {
    const { error } = await db.from("admins").insert(row);
    if (error?.code === "23505") throw new Error("Slug sudah dipakai admin lain");
    if (error) throw error;
  }

  revalidatePath("/admins", "layout");
  redirect("/admin");
}

export async function deleteAdmin(formData) {
  await requireAdmin();
  await db.from("admins").delete().eq("slug", String(formData.get("slug")));
  revalidatePath("/admins", "layout");
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}