'use client';
import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Trash2, Send } from 'lucide-react';

/**
 * FeedbackPanel — Reactions + Comments per profil
 * Penyimpanan: localStorage (key unik per profileId)
 *
 * Pemakaian:
 *   <FeedbackPanel profileId={admin.id || slug} />
 */
export default function FeedbackPanel({ profileId }) {
  const STORAGE_REACT = `gv:reactions:${profileId}`;
  const STORAGE_COMMS = `gv:comments:${profileId}`;
  const STORAGE_UID   = `gv:uid`;

  // buat userId sekali (untuk menandai komentar milik sendiri)
  const [uid, setUid] = useState('');
  useEffect(() => {
    let u = localStorage.getItem(STORAGE_UID);
    if (!u) {
      u = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_UID, u);
    }
    setUid(u);
  }, []);

  // ===== Reactions =====
  const EMOJIS = ['👍','❤️','😂','😮','😢','🔥','⭐'];
  const [reactionCounts, setReactionCounts] = useState(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(STORAGE_REACT) || '{}'); } catch { return {}; }
  });
  const [chosen, setChosen] = useState(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(`${STORAGE_REACT}:chosen`) || '{}'); } catch { return {}; }
  });

  const toggleReaction = (emoji) => {
    setReactionCounts((prev) => {
      const next = { ...prev };
      const already = !!chosen[emoji];
      next[emoji] = Math.max(0, (next[emoji] || 0) + (already ? -1 : 1));
      // simpan counts
      localStorage.setItem(STORAGE_REACT, JSON.stringify(next));
      return next;
    });
    setChosen((prev) => {
      const next = { ...prev, [emoji]: !prev[emoji] };
      localStorage.setItem(`${STORAGE_REACT}:chosen`, JSON.stringify(next));
      return next;
    });
  };

  const totalReactions = useMemo(
    () => EMOJIS.reduce((s,e) => s + (reactionCounts[e] || 0), 0),
    [reactionCounts]
  );

  // ===== Comments =====
  const [comments, setComments] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_COMMS) || '[]'); } catch { return []; }
  });
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const maxLen = 500;

  const saveComments = (arr) => localStorage.setItem(STORAGE_COMMS, JSON.stringify(arr));

  const addComment = async () => {
    const a = author.trim().slice(0, 40) || 'Anon';
    const t = text.trim();
    if (!t) return;
    if (t.length > maxLen) return;

    setBusy(true);
    const item = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      uid, author: a, text: t,
      ts: Date.now(),
    };
    const next = [item, ...comments];
    setComments(next);
    saveComments(next);
    setText('');
    setBusy(false);
  };

  const removeComment = (id, commentUid) => {
    // hanya hapus kalau milik sendiri
    if (commentUid !== uid) return;
    const next = comments.filter((c) => c.id !== id);
    setComments(next);
    saveComments(next);
  };

  const fmtTime = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return ''; }
  };

  return (
    <section className="mt-8">
      {/* Reactions */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/90">Reaksi</h3>
          <span className="text-xs text-white/60">{totalReactions} total</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => {
            const count = reactionCounts[e] || 0;
            const active = !!chosen[e];
            return (
              <button
                key={e}
                type="button"
                onClick={() => toggleReaction(e)}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                  active ? "bg-blue-600/30 ring-1 ring-blue-500/40" : "bg-white/5 ring-1 ring-white/10 hover:bg-white/10",
                ].join(' ')}
                aria-pressed={active}
              >
                <span className="text-base">{e}</span>
                <span className="min-w-[1.5ch] tabular-nums text-white/80">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-white/70" />
          <h3 className="text-sm font-semibold text-white/90">Kolom Komentar</h3>
          <span className="ml-auto text-xs text-white/60">{comments.length} komentar</span>
        </div>

        {/* Form */}
        <div className="mb-3 grid gap-2 sm:grid-cols-[160px_1fr_auto]">
          <input
            value={author}
            onChange={(e)=>setAuthor(e.target.value)}
            placeholder="Nama (opsional)"
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder="Tulis komentar…"
              maxLength={maxLen}
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-white/50">{text.length}/{maxLen}</span>
          </div>
          <button
            type="button"
            onClick={addComment}
            disabled={busy || !text.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Kirim
          </button>
        </div>

        {/* List */}
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-xl border border-white/10 bg-black/30 p-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-white">{c.author || 'Anon'}</div>
                <div className="text-[11px] text-white/50">• {fmtTime(c.ts)}</div>
                {c.uid === uid && (
                  <button
                    type="button"
                    onClick={() => removeComment(c.id, c.uid)}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
                    title="Hapus komentar"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-white/85 whitespace-pre-wrap break-words">
                {c.text}
              </p>
            </li>
          ))}

          {comments.length === 0 && (
            <li className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/60">
              Belum ada komentar. Jadilah yang pertama!
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
