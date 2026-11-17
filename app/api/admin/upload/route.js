import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/isAdmin";
import { presign } from "@/lib/r2";

const RULES = {
  image: { types: ["image/jpeg", "image/png", "image/webp"], max: 5 * 1024 * 1024, folder: "gachaverse/photos" },
  audio: { types: ["audio/webm", "audio/mpeg", "audio/mp4", "audio/ogg", "audio/wav", "video/webm"], max: 20 * 1024 * 1024, folder: "gachaverse/songs" },
};

export async function POST(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });

  const { kind, filename, type, size } = await req.json();
  const rule = RULES[kind];
  if (!rule) return NextResponse.json({ error: "Jenis file salah" }, { status: 400 });
  if (!rule.types.includes(type)) return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });
  if (size > rule.max) return NextResponse.json({ error: `Maksimal ${rule.max / 1024 / 1024} MB` }, { status: 400 });

  const safe = String(filename).toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const key = `${rule.folder}/${Date.now()}-${safe}`;
  return NextResponse.json(await presign(key, type));
}