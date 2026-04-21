// components/AiChatWidget.jsx
"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

// Regex untuk MEMECAH teks berdasarkan URL
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;
// Regex untuk CEK apakah bagian itu murni URL
const URL_CHECK = /^https?:\/\/[^\s]+$/i;

function renderWithLinks(text = "") {
  const parts = String(text).split(URL_REGEX);

  return parts.map((part, index) => {
    const key = `part-${index}`;

    // Bukan URL → render biasa
    if (!URL_CHECK.test(part)) {
      return <span key={key}>{part}</span>;
    }

    // URL → bersihkan tanda baca di ujung (.,!?;:)
    let url = part;
    let trailing = "";
    const m = part.match(/^(https?:\/\/[^\s]+?)([.,!?;:)]*)$/);

    if (m) {
      url = m[1];
      trailing = m[2] || "";
    }

    return (
      <span key={key}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-400 hover:text-blue-300 break-all"
        >
          {url}
        </a>
        {trailing && <span>{trailing}</span>}
      </span>
    );
  });
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hai juga! Selamat datang di Gachaverse.id. Ada yang bisa Yura bantu hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (data?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Maaf, terjadi masalah saat mengambil jawaban. Coba lagi sebentar ya.",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Koneksi ke server bermasalah. Coba lagi nanti ya.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tombol bulat di pojok KIRI */}
<button
  onClick={() => setOpen((v) => !v)}
  className="fixed bottom-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500"
  aria-label="Buka chat AI"
>
  <img
    src="/icons/yura/yura.jpg"
    alt="Yura Icon"
    className="h-10 w-10 rounded-full object-cover"
  />
</button>



      {/* Panel chat */}
      {open && (
  <div className="fixed bottom-20 left-2 sm:left-4 z-50 w-[88vw] sm:w-[360px] max-h-[70vh] rounded-3xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center">
  <img
    src="/icons/yura/yura.jpg"

    alt="Yura Icon"
    className="h-8 w-8 rounded-full object-cover"
  />
</div>

              <div>
                <div className="text-sm font-semibold text-white">
                  Yura / AI Assistant
                </div>
                <div className="text-[11px] text-green-400">
                  Online • siap bantu kamu
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Isi chat */}
          <div className="flex flex-col gap-2 px-3 py-3 overflow-y-auto text-sm max-h-[46vh]">
            {messages.map((m, index) => (
              <div
                key={`${m.role}-${index}`}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl bg-blue-600 px-3 py-2 text-white text-sm leading-relaxed break-words"
                    : "mr-auto max-w-[80%] rounded-2xl bg-white/5 px-3 py-2 text-white/90 text-sm leading-relaxed break-words"
                }
              >
                {m.role === "assistant"
                  ? renderWithLinks(m.content)
                  : m.content}
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-[60%] rounded-2xl bg-white/5 px-3 py-2 text-white/70 text-xs">
                Mengetik…
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-white/10 px-3 py-2">
            <div className="flex items-center gap-2">
              <input
  className="flex-1 min-w-0 rounded-2xl bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"

                placeholder="Tanya apa saja tentang website ini…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
