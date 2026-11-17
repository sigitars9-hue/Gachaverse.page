"use client";
import { useState } from "react";
import { input } from "./ui";

const PLATFORMS = ["whatsapp", "discord", "instagram", "tiktok", "youtube", "x", "facebook"];

export default function ChannelsEditor({ name, defaultValue = [] }) {
  const [rows, setRows] = useState(() =>
    defaultValue.map((c) => ({
      platform: String(c.platform || "whatsapp").toLowerCase(),
      target: c.url || c.contact || "",
      role: c.role || "admin",
      responsibility: c.responsibility || "",
      isPrimary: !!c.isPrimary,
    }))
  );
  const set = (i, patch) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const out = rows
    .filter((r) => r.target.trim() || r.responsibility.trim())
    .map((r) => ({
      platform: r.platform,
      ...(r.platform === "whatsapp" ? { contact: r.target.replace(/\D/g, "") } : { url: r.target.trim() }),
      role: r.role,
      responsibility: r.responsibility,
      isPrimary: r.isPrimary,
    }));

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(out)} />
      {rows.map((r, i) => (
        <div key={i} className="grid gap-2 rounded-xl bg-gray-50 p-3 sm:grid-cols-6">
          <select value={r.platform} onChange={(e) => set(i, { platform: e.target.value })} className={`${input} sm:col-span-2`}>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <input value={r.target} onChange={(e) => set(i, { target: e.target.value })}
            placeholder={r.platform === "whatsapp" ? "Nomor 628xxx" : "Link"} className={`${input} sm:col-span-4`} />
          <input value={r.role} onChange={(e) => set(i, { role: e.target.value })} placeholder="Peran (admin, owner…)" className={`${input} sm:col-span-2`} />
          <input value={r.responsibility} onChange={(e) => set(i, { responsibility: e.target.value })} placeholder="Tugas di kanal ini" className={`${input} sm:col-span-4`} />
          <div className="flex items-center justify-between sm:col-span-6">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={r.isPrimary} onChange={(e) => set(i, { isPrimary: e.target.checked })} /> Kanal utama
            </label>
            <button type="button" onClick={() => setRows((x) => x.filter((_, j) => j !== i))} className="text-xs font-semibold text-red-600">
              Hapus baris
            </button>
          </div>
        </div>
      ))}
      <button type="button"
        onClick={() => setRows((r) => [...r, { platform: "whatsapp", target: "", role: "admin", responsibility: "", isPrimary: false }])}
        className="rounded-full border border-dashed border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
        + Tambah kanal
      </button>
    </div>
  );
}