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
          Panduan perilaku, kebijakan konten, dan tata tertib yang berlaku di semua grup Gachaverse.ID.
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
              subtitle="Dasar Perilaku dan Kepatuhan Terhadap Penerapan Aturan."
            >
              Etika & Kepatuhan
            </SectionTitle>
            <ol className="mt-4 space-y-4 list-decimal pl-6 text-white/90">
              <li>
                Setiap admin dan member <strong>diwajibkan</strong> untuk menjunjung tinggi integritas dan kejujuran. 
                Jika terjadi pelanggaran dan member tidak melaporkannya kepada admin atau bahkan berusaha menutupi/menghapus bukti pelanggaran, 
                maka member terkait akan dikenakan <strong>WARN TIPE 1</strong>. 
                Jika Admin yang terbukti berusaha menutupi/menghapus bukti pelanggaran, akan dikenakan <strong>WARN TIPE 2</strong>.
              </li>
              <li>
                Pahami dan hormati fungsi dari setiap grup yang ada. 
                Pembahasan yang tidak tersedia grupnya atau bahkan pembahasan casual/sehari-hari bahaslah di grup <strong>Casual Talk</strong>. 
                Melakukan pembahasan yang Out Of Topic secara berlebihan akan dikenakan <strong>WARN TIPE 1</strong>
              </li>
              <li>
                Member dilarang melakukan kegiatan promosi, jual-beli, dan tawar menawar selain pada grup yang telah disediakan. 
                Dengan kata lain, HANYA ADMIN yang memiliki izin yang diperbolehkan melakukan Promosi di Grup non JB. 
                Pelanggaran akan dikenakan <strong>WARN TIPE 1</strong>
              </li>
              <li>
                Dilarang membagikan unggahan yang berasal dari fanpage / channel / komunitas / grup yang bukan merupakan Partner dari Gachaverse.ID. 
                Sedikit keringanan, diperbolehkan membagikan unggahan tersebut, asalkan <strong>WM dari fanpage / channel / komunitas / grup tersebut</strong> sudah disensor hingga tidak terlihat. 
                Untuk informasi lebih lanjut, silahkan tanya kepada Admin Grup untuk list dari Partner Gachaverse.ID. 
                Pelanggaran akan dikenakan <strong>WARN TIPE 1</strong>
              </li>
              <li>
                Perbedaan pendapat dalam berdiskusi adalah hal yang sangat wajar. 
                Namun jika sampai menimbulkan keributan yang tidak perlu atau bahkan berlebihan, <strong>WARN TIPE 1</strong> sampai <strong>KICK PERMANEN</strong> dapat diberlakukan
              </li>
              <li>
                Dalam diskusi umum, Admin dan member memang berada pada posisi yang setara dan terikat aturan yang sama. 
                Namun Member juga harus memahami posisinya dalam grup. Jika Teguran dan Peringatan dari Admin tidak dihiraukan, 
                maka Admin BERHAK memberikan <strong>WARN TIPE 1</strong> terhadap member tersebut
              </li>
            </ol>
          </Card>

          {/* B. Penggunaan Yura AI */}
          <Card>
            <SectionTitle
              id="yura"
              icon={Sparkles}
              subtitle="Gunakan Dengan Bijak, Sesuai Grup, dan Tidak Untuk Spam."
            >
              Penggunaan Yura AI
            </SectionTitle>
            <ol className="mt-4 space-y-4 list-decimal pl-6 text-white/90">
              <li>
                <strong>Yura AI</strong> tersedia bagi seluruh member untuk membantu kebutuhan info,
                arsip, atau sekadar dialog dua arah. Menggunakan Yura AI tidak pada tempatnya akan dikenakan <strong>WARN TIPE 1</strong>
              </li>
              <li>
                Menggunakan Yura AI untuk hal hal yang tidak sesuai fungsinya 
                atau bahkan hal tidak senonoh akan dikenakan <strong>WARN TIPE 1</strong> hingga <strong>KICK PERMANEN</strong>
              </li>
            </ol>
          </Card>

          {/* C. Pelanggaran Kelas Berat */}
          <Card>
            <SectionTitle
              id="konten"
              icon={MessageSquareWarning}
              subtitle="Pelanggaran Dengan Konsekuensi Serius."
            >
              Pelanggaran Kelas Berat
            </SectionTitle>
            <ol className="mt-4 space-y-4 list-decimal pl-6 text-white/90">
              <li>
                Admin dan Member <strong>WAJIB</strong> Mematuhi dan menghormati setiap peraturan yang ada. 
                Menganggap remeh dan mengejek aturan yang ada akan dikenakan <strong>WARN TIPE 2</strong>
              </li>
              <li>
                Dilarang keras mengirimkan segala jenis konten, pesan, 
                atau sekadar stiker yang mengandung unsur <strong>RASISME</strong>. 
                Pelanggaran akan dikenakan <strong>WARN TIPE 2</strong>
              </li>
              <li>
                Dilarang keras mengirimkan segala jenis konten, pesan, atau sekadar stiker yang mengandung 
                unsur <strong>NSFW</strong> dan <strong>18+</strong>, KECUALI jika memang original source nya demikian 
                 (contoh: Atago, Azurlane dan Rapi Red Hood, NIKKE). 
                Pelanggaran akan dikenakan <strong>WARN TIPE 2</strong>
              </li>
              <li>
                Dilarang keras mengirimkan segala jenis konten, pesan, atau sekadar stiker 
                yang mengandung unsur <strong>Politik Dalam Negeri</strong>. 
                Pelanggaran akan dikenakan <strong>WARN TIPE 2</strong>
              </li>
              <li>
                <strong>Dilarang keras melakukan pembahasan terkait topik sensitif seperti Komunisme dan Fasisme.</strong> Sedikit keringanan, pembahasan diperbolehkan SELAMA original source nya memang 
                terkait dengan hal hal tersebut (contoh: story GFL2 dan Reverse1999). 
                Pelanggaran akan dikenakan <strong>WARN TIPE 2</strong>
              </li>
            </ol>
          </Card>

          {/* D. Pelanggaran Super Berat */}
          <Card>
            <SectionTitle 
              id="tag" 
              icon={MessageSquareWarning} 
              subtitle="Pelanggaran Dengan Konsekuensi Permanen"
              >
              Pelanggaran Super Berat
            </SectionTitle>
            <ol className="mt-4 space-y-4 list-decimal pl-6 text-white/90">
              <li>
                Member dilarang keras melakukan <strong>TAG GROUP</strong>. 
                Hanya Admin yang memiliki izin tertentulah yang diperbolehkan melakukan <strong>TAG GROUP</strong>. 
                Pelanggaran akan dikenakan <strong>KICK TANPA WARN</strong>
              </li>
              <li>
                Dilarang keras mengirimkan segala jenis konten, pesan, atau sekadar stiker yang mengandung unsur <strong>LGBTQ</strong>. 
                Pelanggaran akan dikenakan <strong>KICK PERMANEN TANPA WARN</strong>
              </li>
            </ol>
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
                  Pertanyaan terkait game & Admin sedang off? <strong>Tag Yura AI</strong>.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:col-span-2">
                <p className="text-sm text-white/80">
                  Informasi belum ada di Yura AI? <strong>Tag Admin Penanggungjawab Grup / Head Admin</strong>.
                </p>
              </li>
            </ul>
          </Card>

          {/* F. Tipe Warn */}
{/* F. Tipe Warn (UPDATED) */}
<Card className="sm:col-span-2">
  <SectionTitle id="warn" icon={CircleAlert}>
    Penjelasan Lebih Lanjut (Warn)
  </SectionTitle>

  <div className="mt-4 space-y-4 text-white/90">
    <p className="font-semibold text-white">
      Penjelasan Terkait Konsekuensi yang Diberikan
    </p>

    <div className="rounded-2xl border border-yellow-300/25 bg-yellow-500/10 p-5">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-200 ring-1 ring-yellow-300/25">
        <Ban className="h-3.5 w-3.5" />
        𝗪𝗮𝗿𝗻 𝗧𝗶𝗽𝗲 𝟭
      </div>
      <p>
        Peringatan yang diberikan terhadap pelanggar yang melakukan pelanggaran taraf Ringan. <strong>WARN TIPE 1</strong> ini 
        dapat diberikan hingga maksimal 3 (tiga) kali, dan jika sudah mencapai batas maksimal, 
        pelaku dapat dikenakan hukuman Kick. Kick pertama berlangsung selama 1 Bulan, Kick kedua selama 3 Bulan, 
        dan Kick ketiga dari <strong>WARN TIPE 1</strong> ini akan bersifat <strong>PERMANEN</strong>. 
      </p>
      <br> 
      </br>
      <p>
        Setiap <strong>WARN TIPE 1</strong> yang diberikan bersifat independent. Jika A dikenakan WARN TIPE 1 di grup X dan Y, 
        maka A dihitung memiliki 1 <strong>WARN TIPE 1</strong> di grup X dan 1 <strong>WARN TIPE 1</strong> di grup Y  
      </p>
    </div>

    <div className="rounded-2xl border border-rose-300/25 bg-rose-500/10 p-5">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs text-rose-200 ring-1 ring-rose-300/25">
        <Ban className="h-3.5 w-3.5" />
        𝗪𝗮𝗿𝗻 𝗧𝗶𝗽𝗲 𝟮
      </div>
      <p>
        Peringatan yang diberikan terhadap pelanggar yang melakukan pelanggaran taraf Berat. 
        <strong>WARN TIPE 2</strong> ini hanya diberlakukan sekali dan pelanggaran selanjutnya akan dikenakan hukuman Kick. 
        Kick pertama akan berlangsung selama 3 Bulan dan Kick kedua akan bersifat <strong>Permanen</strong>.
      </p>
      <br>
      </br>
      <p>
        Setiap <strong>WARN TIPE 2</strong> yang diberikan bersifat akumulatif. 
        Jika A dikenakan <strong>WARN TIPE 2</strong> di grup X dan Y, maka A berhak untuk 
        dikeluarkan dari salah satu di antara dua grup tersebut dan 
        A berhak untuk memilih untuk dikeluarkan dari grup mana.
      </p>
    </div>
    <div className="rounded-2xl border border-blue-300/25 bg-blue-500/10 p-5">
      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-200 ring-1 ring-blue-300/25">
        <Info className="h-3.5 w-3.5" />
        Pengajuan Banding
      </div>
      <div>
  Pelanggar <strong>BERHAK</strong> untuk mengajukan banding kepada{' '}
  <strong>ADMIN GRUP / OWNER GRUP / HEAD ADMIN</strong> jika ingin masuk ke dalam
  grup kembali. Syarat yang harus dipenuhi adalah dua,
  <ul className="list-decimal list-inside ml-4 mt-1 space-y-1 text-white/90">
    <li>Pelanggar harus menjalani masa Hukuman terlebih dahulu yaitu Satu Bulan,</li>
    <li>Pelanggar akan menjalani masa Probation selama Satu Bulan setelah diundang Kembali ke dalam grup.</li>
  </ul>
  Banding hanya berlaku sekali seumur hidup. Jika Pelanggar tertangkap melakukan
  pelanggaran hingga terkena KICK kembali, maka pelanggar tidak memiliki hak untuk
  Banding Kembali, alias dikeluarkan dari Komunitas Gachaverse.ID secara{' '}
  <strong>PERMANEN</strong>
</div>
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
                <a href="#konten" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Pelanggaran Kelas Berat</a>
                <a href="#tag" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Pelanggaran Super Berat</a>
                <a href="#bantuan" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Bantuan Cepat</a>
                <a href="#warn" className="rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10 hover:bg-white/10">Penjelasan Lebih Lanjut (Warn)</a>
              </nav>
            </Card>

            {/* Quick callout */}
            <Card className="border-white/10 bg-gradient-to-br from-fuchsia-600/10 via-emerald-500/10 to-sky-500/10">
              <div className="mb-2 flex items-center gap-2 text-blue-300">
                <TimerReset className="h-5 w-5" />
                <span className="font-semibold">Ringkas</span>
              </div>
              <ul className="space-y-2 text-sm text-white/85">
                <li>Mengisi Intro = Setuju dan Patuh Terhadap Aturan Umum.</li>
                <li>Melawan Admin, Bohong, OOT Berlebih, Promosi Membuat Keributan, & Spam Yura → Warn 1.</li>
                <li>Rasis/18+/NSFW/Politik/Topik Sensitif & Mengabaikan Aturan → Warn 2.</li>
                <li>Tag Group sembarangan & LGBT → Kick tanpa warn.</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
