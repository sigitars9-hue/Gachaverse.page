// app/api/ai-chat/route.js
import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { admins } from "@/data/admins";
import { groups } from "@/data/groups";

// ================== CONFIG URL & KAOMOJI ==================
const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://gachaverse-page.vercel.app";

const KAOMOJIS = [
  "(๑•̀ㅂ•́)و✧",
  "(≧▽≦)",
  "(๑˃̵ᴗ˂̵)و",
  "(❁´◡`❁)",
  "(｡>﹏<｡)",
];

function pickKaomoji() {
  return KAOMOJIS[Math.floor(Math.random() * KAOMOJIS.length)];
}

function withKaomoji(text = "") {
  // pastikan cuma satu kaomoji yang kita tambahkan
  const trimmed = String(text).trim();
  return trimmed ? `${trimmed} ${pickKaomoji()}` : pickKaomoji();
}

// ubah semua link relatif / localhost jadi full URL
function fixLinks(text = "") {
  let out = String(text);

  // ganti localhost -> domain produksi
  out = out.replace(/https?:\/\/localhost:3000/gi, SITE_BASE_URL);

  // ganti /admins/... jadi https://gachaverse-page.vercel.app/admins/...
  out = out.replace(/(\/admins\/[a-zA-Z0-9_-]+)/g, (m) => `${SITE_BASE_URL}${m}`);

  // ganti /groups/... juga
  out = out.replace(/(\/groups\/[a-zA-Z0-9_-]+)/g, (m) => `${SITE_BASE_URL}${m}`);

  return out;
}

// ================== CONFIG MEMORY FILE ==================
const MEMORY_FILE =
  process.env.MEMORY_FILE || path.resolve(process.cwd(), "memory_yura.txt");

// Default prompt kalau file belum ada / kosong
let MEMORY_PROMPT = `
Kamu adalah Yura, asisten AI ceria untuk landing page Gachaverse.id.
Gaya bicara: ramah, santai, sedikit imut, tapi tetap sopan.
Jawab singkat, langsung ke poin, dan jangan pakai markdown (tanpa bold, italic, dsb).
Sertakan tepat satu kaomoji ceria di akhir setiap jawaban.
Fokus bantu info admin, grup WhatsApp, Discord, event, dan navigasi section website.
Jika user menanyakan admin atau grup tertentu, gunakan data pada DATA_ADMIN dan DATA_GROUPS.
`;

// Coba baca memory_yura.txt kalau ada
try {
  if (fs.existsSync(MEMORY_FILE)) {
    const txt = fs.readFileSync(MEMORY_FILE, "utf8");
    if (txt.trim()) {
      MEMORY_PROMPT = txt;
    }
  }
} catch (err) {
  console.error("[YURA MEMORY] Gagal baca memory_yura.txt:", err);
}

// ================== Helper: bersihin markdown ==================
function stripMarkdown(text = "") {
  return String(text)
    .replace(/```[\s\S]*?```/g, "") // buang blok ```code```
    .replace(/[*_`~]/g, "")        // buang bold/italic/tilde/backtick
    .replace(/#+/g, "")            // buang heading markdown
    .trim();
}

// ================== Handler utama ==================
export async function POST(req) {
  try {
    const body = await req.json();

    // support 2 format:
    // 1) { messages: [{role, content}, ...] } (seperti chat widget)
    // 2) { message: "teks user" } (fallback)
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const lastUserMessage =
      [...messages].reverse().find((m) => m.role === "user")?.content ||
      body.message ||
      "";

    if (!lastUserMessage) {
      const reply = withKaomoji(
        "Halo, Yura di sini. Ketik pertanyaanmu tentang admin, grup WhatsApp, Discord, event, atau navigasi halaman ya."
      );
      return NextResponse.json({ reply });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY belum di-set" },
        { status: 500 }
      );
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY;

    // Prompt yang dikirim ke Gemini
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                MEMORY_PROMPT +
                "\n\nDATA_ADMIN:\n" +
                JSON.stringify(admins) +
                "\n\nDATA_GROUPS:\n" +
                JSON.stringify(groups) +
                "\n\nUser: " +
                lastUserMessage +
                "\nJawab sebagai Yura.",
            },
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini Error:", data);
      const reply = withKaomoji(
        "Maaf, Yura lagi kesulitan mengambil jawaban dari server. Coba beberapa saat lagi ya."
      );
      return NextResponse.json({ reply }, { status: 500 });
    }

    const rawText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, Yura tidak bisa memproses permintaan kamu. Coba tanya seputar admin, grup WhatsApp, Discord, atau event Gachaverse.id ya.";

    // 1) bersihkan markdown
    let cleaned = stripMarkdown(rawText);
    // 2) perbaiki link (localhost -> domain, /admins /groups -> full URL)
    cleaned = fixLinks(cleaned);
    // 3) tambahkan satu kaomoji ceria
    const finalReply = withKaomoji(cleaned);

    return NextResponse.json({ reply: finalReply });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    const reply = withKaomoji(
      "Maaf, terjadi kesalahan di server Yura. Coba kirim pertanyaannya lagi ya."
    );
    return NextResponse.json({ reply, error: "Server error" }, { status: 500 });
  }
}
