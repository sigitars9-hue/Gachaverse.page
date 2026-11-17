import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin as db } from "@/lib/supabase/admin";
import AdminShell from "@/components/admin/AdminShell";
import { PageHeader, StatCard, stagger } from "@/components/admin/AdminKit";
import { card, input, btnDark } from "@/components/admin/ui";

export default async function AdminHome({ searchParams }) {
  await requireAdmin();
  const { q = "" } = await searchParams;

  const { data } = await db.from("admins")
    .select("slug,name,img,role,status,is_visible").order("name");
  const all = data ?? [];

  const s = q.trim().toLowerCase();
  const rows = s ? all.filter((r) => `${r.name} ${r.role}`.toLowerCase().includes(s)) : all;

  const active = all.filter((r) => r.status === "active").length;
  const hidden = all.filter((r) => !r.is_visible).length;

  const r2ok = !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET && process.env.R2_PUBLIC_URL);

  return (
    <AdminShell active="home">
      <PageHeader title="Dashboard" desc="Kelola data admin Gachaverse tanpa menyentuh kode.">
        <Link href="/admin/new" className={btnDark}>+ Tambah admin</Link>
      </PageHeader>

      {!r2ok && (
        <div className="animate-fade-up mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          Variabel R2 di .env belum lengkap, jadi upload foto dan lagu belum bisa dipakai.
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard i={0} tone="pink" value={all.length} label="Total admin" />
        <StatCard i={1} tone="emerald" value={active} label="Aktif" />
        <StatCard i={2} tone="amber" value={all.length - active} label="Nonaktif" />
        <StatCard i={3} tone="violet" value={hidden} label="Disembunyikan" />
      </div>

      <form className="animate-fade-up mt-8" style={stagger(4)}>
        <input name="q" defaultValue={q} placeholder="Cari nama atau role…" className={input} />
      </form>

      <div className={`${card} mt-4 divide-y divide-gray-100 !p-0`}>
        {rows.length === 0 && <div className="p-6 text-sm text-gray-500">Tidak ada hasil.</div>}
        {rows.map((r, i) => (
          <Link key={r.slug} href={`/admin/${r.slug}`} style={stagger(Math.min(i, 10) + 5)}
            className="animate-fade-up group flex items-center gap-4 px-4 py-3 transition hover:bg-gray-50">
            <img src={r.img || "/admins/placeholder.jpg"} alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-black/5" />
            <div className="min-w-0 flex-1">
              <b className="block truncate">{r.name}</b>
              <span className="text-xs text-gray-500">{r.role}</span>
            </div>
            {!r.is_visible && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">disembunyikan</span>}
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              r.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
              {r.status === "active" ? "aktif" : "nonaktif"}
            </span>
            <span className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#0d0c22]">→</span>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}