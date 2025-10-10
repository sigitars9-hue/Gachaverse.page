// app/peraturan/page.jsx
import Link from "next/link";
import {
  BookOpenCheck,
  ShieldAlert,
  Sparkles,
  MessageSquareWarning,
  UserRoundCheck,
  Megaphone,
  Hash,
  CircleAlert,
  Ban,
  TimerReset,
  ArrowLeft,
  Info,
} from "lucide-react";

export const metadata = {
  title: "Peraturan Umum Komunitas — Gachaverse.id",
  description: "Aturan umum yang berlaku di seluruh grup Gachaverse.id.",
};

function SectionTitle({ id, icon: Icon, children, subtitle }) {
  return (
    <div id={id} className="scroll-mt-28">
      <div className="flex items-center gap-3 text-blue-300">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-500/15 ring-1 ring-blue-300/25">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">{children}</h2>
      </div>
      {subtitle ? <p className="mt-1 text-white/70">{subtitle}</p> : null}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur ${className}`} >
      {children}
    </div>
  );
}

export default function PeraturanPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 -top-32 h-80 bg-[radial-gradient(900px_300px_at_50%_0%,rgba(59,130,246,0.20),transparent)]" />
        <div className="absolute -left-40 top-40 h-80 w-80 rounded-full blur-3xl bg-emerald-500/10" />
        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full blur-3xl bg-fuchsia-500/10" />
      </div>

      {/* HERO */}
      <header className="mx-auto max-w-4xl px-4 pt-20 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-600/20 px-3 py-1 text-blue-300 ring-1 ring-blue-300/20">
          <BookOpenCheck className="h-4 w-4" />
          <span>Peraturan Umum Komunitas</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
          Aturan Gachaverse.ID
        </h1>
        <p className="mt-2 text-white/80">
          Panduan perilaku, kebijakan konten, dan tata tertib lintas semua grup Gachaverse.ID.
        </p>

        {/* intro notice */}
        <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-emerald-300/25 bg-emerald-500/10 p-4 text-emerald-100">
          <p className="text-sm leading-relaxed">
            <em>
              Setelah bergabung, <strong>wajib mengisi intro</strong> sebagai tanda persetujuan
              terhadap aturan ini. Menolak/mengisi asal = menolak Aturan Umum yang berlaku.
            </em>
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-20 lg:grid-cols-[1fr_320px]">
        {/* MAIN CONTENT */}
        <div className="space-y-6">
          {/* A. Etika & Kepatuhan */}
          <Card>
            <SectionTitle
              id="etika"
              icon={ShieldAlert}
              subtitle="Dasar perilaku dan kepatuhan terhadap penerapan aturan."
            >
              Etika & Kepatuhan
            </SectionTitle>
            <ol className="mt-4 space-y-4 list-decimal pl-6 text-white/90">
              <li>
                Menjunjung <strong>integritas & kejujuran</strong>. Menghalangi penegakan aturan
                dianggap pelanggaran. <em>Warn Tipe 1</em>.
              </li>
              <li>
                Patuhi fungsi setiap grup. Topik di luar pembahasan pindah ke{" "}
                <em>Casual Talk</em>. Out of Topic berlebihan: <em>Warn Tipe 1</em>.
              </li>
              <li>
                Dilarang promosi fanpage/channel/komunitas di luar Gachaverse.ID & partner.{" "}
                <em>Warn Tipe 1</em>.
                <div className="mt-2 rounded-xl border-l-4 border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Lihat daftar partner pada caption pengumuman atau tanya <strong>Yura AI</strong>.
                </div>
              </li>
              <li>
                Jual beli hanya di <strong>GVstore | JB All Game</strong>. Pelanggaran:{" "}
                <em>Warn Tipe 1</em>.
              </li>
              <li>
                Perbedaan pendapat itu wajar. Jaga etika, hindari drama berkepanjangan.{" "}
                <em>Warn Tipe 1 + Sanksi Sosial</em>.
              </li>
            </ol>
          </Card>

          {/* B. Penggunaan Yura AI */}
          <Card>
            <SectionTitle
              id="yura"
              icon={Sparkles}
              subtitle="Gunakan dengan bijak, sesuai grup, dan tidak untuk spam."
            >
              Penggunaan Yura AI
            </SectionTitle>
            <p className="mt-3 text-white/90">
              <strong>Yura AI</strong> tersedia bagi seluruh member untuk membantu kebutuhan info,
              arsip, atau tanya-jawab. Dilarang spam, konten tidak pantas, atau penggunaan yang
              tidak sesuai konteks grup. Pelanggaran: <em>Warn Tipe 1</em>.
            </p>
          </Card>

          {/* C. Konten Terlarang */}
          <Card>
            <SectionTitle
              id="konten"
              icon={MessageSquareWarning}
              subtitle="Jaga lingkungan yang nyaman untuk semua kalangan."
            >
              Konten Terlarang
            </SectionTitle>
            <ul className="mt-4 space-y-3 text-white/90">
              <li>
                Dilarang konten <strong>Rasisme, 18+, Vulgar, NSFW</strong>. Pelanggaran:{" "}
                <em>Warn Tipe 2</em>.
                <div className="mt-2 rounded-xl border-l-4 border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Ambang toleransi NSFW? Silakan konsultasi ke Admin terkait.
                </div>
              </li>
              <li>
                Politik dalam negeri <strong>dilarang keras</strong>. Pelanggaran:{" "}
                <em>Warn Tipe 2</em>.
              </li>
              <li>
                Tindakan/propaganda <strong>LGBT</strong> dalam bentuk apa pun{" "}
                <strong>tidak diperbolehkan</strong>. Sanksi: <strong>KICK TANPA WARN</strong>.
              </li>
            </ul>
          </Card>

          {/* D. Tag Group */}
          <Card>
            <SectionTitle id="tag" icon={Megaphone} subtitle="Fitur sensitif, gunakan hanya oleh admin.">
              Penggunaan Tag Group
            </SectionTitle>
            <p className="mt-3 text-white/90">
              <strong>Dilarang keras Tag Group</strong> kecuali pengumuman penting oleh admin
              Gachaverse.ID. Penyalahgunaan akan terkena{" "}
              <strong>KICK TANPA WARN</strong>.
            </p>
          </Card>

          {/* E. Bantuan Cepat */}
          <Card>
            <SectionTitle id="bantuan" icon={UserRoundCheck}>
              Bantuan Cepat
            </SectionTitle>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-sm text-white/80">
                  Chat tidak direspon? <strong>Tag Admin</strong> yang bersangkutan.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-sm text-white/80">
                  Pertanyaan game & admin sedang off? <strong>Tag Yura AI</strong>.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:col-span-2">
                <p className="text-sm text-white/80">
                  Informasi belum ada di Yura AI? <strong>Tag Admin Penanggungjawab Grup</strong>.
                </p>
              </li>
            </ul>
          </Card>

          {/* F. Tipe Warn */}
          <Card className="sm:col-span-2">
            <SectionTitle id="warn" icon={CircleAlert}>
              Tingkatan Peringatan (Warn)
            </SectionTitle>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-yellow-300/25 bg-yellow-500/10 p-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-200 ring-1 ring-yellow-300/25">
                  <Info className="h-3.5 w-3.5" />
                  Warn Tipe 1
                </div>
                <p className="text-white/90">
                  Pelanggaran ringan–menengah. Dapat diberikan hingga <strong>3 kali</strong>. Jika
                  sudah maksimal, sanksi berupa <strong>Kick 3/6/9/12 bulan</strong>.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-300/25 bg-rose-500/10 p-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-200 ring-1 ring-rose-300/25">
                  <Ban className="h-3.5 w-3.5" />
                  Warn Tipe 2
                </div>
                <p className="text-white/90">
                  Pelanggaran menengah–berat. Berlaku <strong>sekali</strong>. Pelanggaran berulang:
                  <strong> Kick Permanen</strong> hingga <strong>Keluar dari Komunitas</strong>.
                </p>
              </div>
            </div>
          </Card>

          {/* FOOTER LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/groups"
              className="rounded-2xl border border-white/15 px-5 py-3 text-white/90 hover:bg-white/10"
            >
              ← Kembali ke Daftar Grup
            </Link>
          </div>
        </div>

        {/* RIGHT SIDEBAR: TOC + Quick Tips */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
          <div className="space-y-6">
            {/* TOC */}
            <Card>
              <div className="mb-2 flex items-center gap-2 text-blue-300">
                <Hash className="h-5 w-5" />
                <span className="font-semibold">Navigasi cepat</span>
              </div>
              <nav className="mt-2 grid gap-2 text-sm">
                <a href="#etika" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Etika & Kepatuhan</a>
                <a href="#yura" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Penggunaan Yura AI</a>
                <a href="#konten" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Konten Terlarang</a>
                <a href="#tag" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Tag Group</a>
                <a href="#bantuan" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Bantuan Cepat</a>
                <a href="#warn" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Tipe Warn</a>
              </nav>
            </Card>

            {/* Quick callout */}
            <Card className="border-white/10 bg-gradient-to-br from-fuchsia-600/10 via-emerald-500/10 to-sky-500/10">
              <div className="mb-2 flex items-center gap-2 text-blue-300">
                <TimerReset className="h-5 w-5" />
                <span className="font-semibold">Ringkas</span>
              </div>
              <ul className="space-y-2 text-sm text-white/85">
                <li>Isi intro = setuju aturan.</li>
                <li>OOT berlebih, promosi luar, & spam Yura → Warn 1.</li>
                <li>Rasis/18+/NSFW/Politik → Warn 2.</li>
                <li>Tag Group sembarangan & LGBT → Kick tanpa warn.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
