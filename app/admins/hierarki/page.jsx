// app/admins/hierarki/page.jsx
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Lock,
  Shield,
  Layers,
  Users,
} from "lucide-react";
import { DIVISION_ORDER, DIVISION_DESC } from "@/constants/division";

/* ------------------------------------------------------------------ */
/* Role → warna gradasi (sinkron dg halaman profil admin)             */
/* ------------------------------------------------------------------ */

function roleKey(str = "") {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z\-]/g, "");
}

const ROLE_GRADIENT = {
  // tier tertinggi
  "founder": "from-amber-600/85 via-amber-500/75 to-yellow-500/65",
  "co-founder": "from-amber-500/85 via-orange-500/70 to-yellow-500/60",
  "head-admin": "from-rose-600/85 via-red-500/70 to-orange-500/60",

  // gvstore
  "owner-gvstore": "from-pink-600/85 via-rose-500/70 to-fuchsia-500/60",
  "sekretaris": "from-rose-500/85 via-pink-500/70 to-fuchsia-400/60",

  // khusus
  "Best Creator": "from-sky-600/85 via-blue-500/70 to-indigo-500/60",
  "mascot": "from-emerald-600/85 via-teal-500/70 to-green-500/60",

  // moderator (discord)
  "moderator": "from-violet-700/85 via-purple-600/75 to-fuchsia-600/60",

  // role group
  "owner-group": "from-indigo-700/85 via-blue-600/70 to-sky-600/60",
  "co-owner-group": "from-blue-700/85 via-sky-600/70 to-cyan-600/60",

  // default admin
  "admin": "from-slate-700/85 via-blue-700/70 to-sky-600/60",
};

// contoh role terkait per divisi
const DIVISION_ROLES = {
  "Babel": ["Founder", "Co-founder", "Head admin", "Best-Creator"],
  "Posting": ["Best Creator", "Admin"],
  "Translator": ["Translator"],
  "Leaks": ["Leaks"],
  "Owner Grup": ["Owner Group", "Co-owner group"],
  "Admin Grup": ["Admin"],
  "Discord": ["Moderator"],
  "AI": ["Mascot"],
  "Gvs": ["Owner Gvstore", "Sekretaris"],
  "Partnership": ["Moderator"],
  "Pentung": [], // terkunci
};

function RoleChip({ role }) {
  const key = roleKey(role);
  const grad = ROLE_GRADIENT[key] ?? ROLE_GRADIENT["admin"];
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${grad} ring-1 ring-white/10 shadow-[0_4px_16px_rgba(0,0,0,.25)]`}
    >
      {role}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/40 ${className}`}>
      {children}
    </div>
  );
}

export const metadata = {
  title: "Hierarki Gachaverse — Struktur Divisi",
};

export default function HierarkiPage() {
    // susun ulang urutan: Pentung selalu terakhir
const ORDERED_DIVISION = [
  ...DIVISION_ORDER.filter((d) => String(d).toLowerCase() !== "pentung"),
  ...DIVISION_ORDER.filter((d) => String(d).toLowerCase() === "pentung"),
];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* header backdrop sederhana */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(37,99,235,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_20%_10%,rgba(59,130,246,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_400px_at_80%_10%,rgba(147,197,253,0.10),transparent)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">

        </div>

        <header className="relative z-10 mx-auto max-w-4xl px-4 pb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/20 px-3 py-1 text-blue-300">
            <Layers className="h-4 w-4" />
            <span>Dokumentasi Struktur</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Hierarki Gachaverse
          </h1>
          <p className="mt-2 text-white/80">
            Urutan divisi & contoh peran. <span className="text-white/60">Beberapa
            informasi bersifat internal dan tidak ditampilkan publik.</span>
          </p>
        </header>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        {/* legend kecil */}
        <Card className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-blue-300">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Legend warna peran</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Founder",
              "Co-founder",
              "Head admin",
              "Owner Gvstore",
              "Sekretaris",
              "Best Creator",
              "Moderator",
              "Owner Group",
              "Co-owner group",
              "Mascot",
              "Admin",
            ].map((r) => (
              <RoleChip key={r} role={r} />
            ))}
          </div>
        </Card>

        {/* grid divisi */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {ORDERED_DIVISION.map((div) => {
            const desc = DIVISION_DESC?.[div] ?? "";
            const roles = DIVISION_ROLES[div] ?? [];
            const locked = div.toLowerCase() === "pentung";

            return (
              <Card key={div} className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{div}</h3>
                  {locked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-xs font-medium text-red-300 border border-red-300/30">
                      <Lock className="h-3.5 w-3.5" />
                      Terkunci
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/70 border border-white/10">
                      <Users className="h-3.5 w-3.5" />
                      Divisi aktif
                    </span>
                  )}
                </div>

                {/* deskripsi */}
                <p className={`text-sm ${locked ? "text-white/50 blur-[1px] select-none" : "text-white/80"}`}>
                  {locked ? "Informasi divisi ini bersifat rahasia." : desc}
                </p>

                {/* roles */}
                {locked ? (
                  <div className="mt-4 h-10 rounded-xl bg-white/5 border border-white/10 blur-[1px]" />
                ) : roles.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {roles.map((r) => (
                      <RoleChip key={r} role={r} />
                    ))}
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>

        {/* footer back */}
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href="/admins"
            className="rounded-2xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
          >
            ← Kembali ke Daftar Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
