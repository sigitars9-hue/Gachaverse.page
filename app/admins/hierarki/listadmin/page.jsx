"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Users, Lock } from "lucide-react";

import {
  ROLE_ORDER,
  canonDivision,
  canonRole,
  getPublicAdmins,
  matchesRole,
  normalizeGender,
  roleLabel,
} from "@/utils/adminMeta";

const GRID = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";

// aktif dulu, lalu nama
const byActiveThenName = (a, b) => {
  const ia = a.status === "inactive" ? 1 : 0;
  const ib = b.status === "inactive" ? 1 : 0;
  return ia - ib || String(a.name).localeCompare(String(b.name));
};

/* ---------- kartu admin ---------- */
function AdminCard({ a }) {
  const g = normalizeGender(a.gender);
  const inactive = a.status === "inactive";
  return (
    <Link
      href={`/admins/${a.slug}`}
      className={`group rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center shadow-xl shadow-black/40 transition hover:-translate-y-1 hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        inactive ? "opacity-60" : ""
      }`}
    >
      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-white/25 bg-white/10">
        <img
          src={a.img || "/admins/placeholder.jpg"}
          alt={a.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="text-sm font-medium leading-tight">{a.name}</span>
        {g && (
          <span className={g === "male" ? "text-blue-300" : "text-pink-300"}>
            {g === "male" ? "♂" : "♀"}
          </span>
        )}
      </div>
      {inactive && (
        <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
          Nonaktif
        </span>
      )}
    </Link>
  );
}

function Empty({ children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/60">
      {children}
    </div>
  );
}

/* ---------- konten utama ---------- */
function ListAdminContent() {
  const sp = useSearchParams();
  const role = sp.get("role") || "";
  const rawDivision = sp.get("division") || "";
  const division = rawDivision ? canonDivision(rawDivision) : "";
  const label = sp.get("label") || role;

  const isLocked = division.toLowerCase() === "pentung";
  const byDivisionOnly = !role && !!division;

  const pool = useMemo(() => getPublicAdmins(), []);

  // MODE 1: satu role (opsional dibatasi divisi)
  const list = useMemo(() => {
    if (!role) return [];
    return pool.filter((a) => matchesRole(a, role, division)).sort(byActiveThenName);
  }, [pool, role, division]);

  // MODE 2: seluruh divisi, dikelompokkan per role
  const groups = useMemo(() => {
    if (!byDivisionOnly || isLocked) return [];
    const inDiv = pool.filter((a) =>
      a._divisions.some((d) => d.toLowerCase() === division.toLowerCase())
    );

    const map = new Map();
    for (const a of inDiv) {
      const lb = roleLabel(a, division);
      if (!map.has(lb)) map.set(lb, { label: lb, rank: 999, members: [] });
      const g = map.get(lb);
      const idx = ROLE_ORDER.indexOf(canonRole(a.role));
      if (idx >= 0) g.rank = Math.min(g.rank, idx);
      g.members.push(a);
    }

    return [...map.values()]
      .map((g) => ({ ...g, members: g.members.sort(byActiveThenName) }))
      .sort((x, y) => x.rank - y.rank || x.label.localeCompare(y.label));
  }, [pool, byDivisionOnly, isLocked, division]);

  const total = byDivisionOnly
    ? groups.reduce((n, g) => n + g.members.length, 0)
    : list.length;

  const title = byDivisionOnly ? `Divisi ${division}` : label || "Peran tidak diketahui";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        {/* header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/20 px-3 py-1 text-blue-300">
            <Users className="h-4 w-4" />
            <span>{byDivisionOnly ? "Daftar Divisi" : "Daftar Peran"}</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-white/60">
            {!byDivisionOnly && division ? `Divisi ${division} · ` : ""}
            {isLocked ? "Terkunci" : `${total} admin`}
          </p>
        </div>

        {/* isi */}
        {isLocked ? (
          <Empty>
            <Lock className="mx-auto mb-3 h-6 w-6" />
            Informasi divisi ini bersifat rahasia.
          </Empty>
        ) : byDivisionOnly ? (
          groups.length > 0 ? (
            <div className="space-y-10">
              {groups.map((g) => (
                <section key={g.label}>
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{g.label}</h2>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/70">
                      {g.members.length}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className={GRID}>
                    {g.members.map((a) => (
                      <AdminCard key={a.slug} a={a} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <Empty>Belum ada admin di divisi ini.</Empty>
          )
        ) : list.length > 0 ? (
          <div className={GRID}>
            {list.map((a) => (
              <AdminCard key={a.slug} a={a} />
            ))}
          </div>
        ) : (
          <Empty>Belum ada admin dengan peran ini.</Empty>
        )}

        {/* kembali */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/admins/hierarki"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Hierarki
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ListAdminPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <ListAdminContent />
    </Suspense>
  );
}