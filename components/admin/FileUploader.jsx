"use client";
import { useState } from "react";

export default function FileUploader({ name, kind = "image", defaultValue = "" }) {
  const [url, setUrl] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, filename: file.name, type: file.type, size: file.size }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Gagal menyiapkan upload");
      const put = await fetch(j.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("Upload ke R2 gagal (cek CORS bucket)");
      setUrl(j.publicUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name={name} value={url} />
      {kind === "image" ? (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5">
          {url && <img src={url} alt="" className="h-full w-full object-cover" />}
        </div>
      ) : url ? (
        <audio src={url} controls className="h-10 max-w-[240px]" />
      ) : (
        <div className="text-sm text-gray-400">Belum ada lagu</div>
      )}
      <div className="space-y-1">
        <div className="flex gap-2">
          <label className="cursor-pointer rounded-full bg-[#0d0c22] px-4 py-2 text-xs font-bold text-white transition hover:bg-pink-500">
            {busy ? "Mengupload…" : url ? "Ganti" : "Pilih file"}
            <input type="file" hidden disabled={busy} onChange={onPick}
              accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "audio/*,video/webm"} />
          </label>
          {url && !busy && (
            <button type="button" onClick={() => setUrl("")}
              className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold hover:bg-gray-50">
              Hapus
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}