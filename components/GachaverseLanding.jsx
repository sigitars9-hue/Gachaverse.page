'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion, motion } from 'framer-motion';
import {
  Stars,
  Users,
  Bot,
  MessageCircle,
  Image as ImageIcon,
  Trophy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';

/** Jika sudah punya data/gallery.js, ganti konstanta ini dengan import */
// import { gallery as GALLERY_DATA } from '@/data/gallery';

const GALLERY_DATA = [
  { src: '/gallery/cos-1.jpeg', title: 'CF19', date: '2024-10-10', location: 'ICE BSD, Tangerang', desc: 'Sesi foto bersama para admin dan member.' },
  { src: '/gallery/cos-2.jpeg', title: 'Hoyofest', date: '2025-07-24', location: 'Surabaya', desc: 'Foto admin divisi surabaya bersama cosplayer.' },
  { src: '/gallery/cos-3.jpeg', title: 'CF20 Day 2', date: '2025-05-25', location: 'ICE BSD, Tangerang', desc: 'Sesi foto bersama member dan admin.' },
  { src: '/gallery/cos-4.jpeg', title: 'Meet and Play Maimai', date: '2025-09-28', location: 'Mall Ciputra Cibubur', desc: 'Arcade Games.' },
  { src: '/gallery/cos-5.jpeg', title: 'CF20 Day 2', date: '2025-05-25', location: 'ICE BSD, Tangerang', desc: 'Rame-rame setelah event utama.' },
  { src: '/gallery/cos-6.jpeg', title: 'Nobar dan Bertemu Foundah', date: '2025-05-11', location: 'BSD, Tangerang', desc: 'Nobar COLORFUL STAGE! THE MOVIE: A MIKU WHO CANT SING.' },
];
// --- POJOK KREASI: daftar karya/kreasi (ganti src & credit sesuai file kamu) ---
const CREATIONS = [
  { src: '/kreasi/yura-1.jpg', credit: '@ceozumv' },
  { src: '/kreasi/yura-2.jpg', credit: '@ceozumv' },
  { src: '/kreasi/yura-3.jpg', credit: '@winxd' },
  { src: '/kreasi/yura-4.jpg', credit: '@someone' },
  { src: '/kreasi/yura-5.jpg', credit: '@artist' },
  { src: '/kreasi/yura-6.jpg', credit: '@nyuka_01' },
  { src: '/kreasi/yura-7.jpg', credit: '@desu' },
  { src: '/kreasi/yura-8.jpg', credit: '@koyukirin_' },
];

/* ==================== Static data ==================== */
const NAV = [
  { href: '#about', label: 'Tentang' },
  { href: '#ai-bot', label: 'AI & Bot' },
  { href: '#events', label: 'Event' },
  { href: '#admins', label: 'Admin' },
  { href: '#groups', label: 'Grup WA' },
  { href: '#sponsors', label: 'Sponsor' },
  { href: '#gallery', label: 'Galeri' },
];

// highlight 6 admin (pakai role terpisah)
const ADMIN_PREVIEW = [
  { name: 'Ryuu',     role: 'Founder',                 img: '/admins/ryuu.jpg' },
  { name: 'Chuzo',    role: 'Co-Founder',              img: '/admins/chuzo.jpg' },
  { name: 'Rizz',     role: 'Head Admin',              img: '/admins/rizz.jpg' },
  { name: 'Asuka',    role: 'Best Creator',            img: '/admins/asuka.jpg' },
  { name: 'Imy',      role: 'Sekretaris',              img: '/admins/imy.jpg' },
  { name: 'haru',     role: 'Owner Gvstore',           img: '/admins/haru.jpg' },
];

const MEDIA_PARTNERS = [
  {
    name: '@alvethia.logic',
    url: 'https://www.instagram.com/alvethia.logic?igsh=aTloMzJ3cW41aTg5',
    topic: 'Epistemologi & interpretasi lore HI3',
    followers: '10,3 K',
    avatar: '/partners/alvethia.jpg',
  },
  {
    name: '@reverse1999.fyi',
    url: 'https://www.instagram.com/reverse1999.fyi?igsh=MXdpamR6cXI4aWQ4Zw==',
    topic: 'Reverse 1999',
    followers: '890',
    avatar: '/partners/reverse1999fyi.jpg',
  },
  {
    name: '@reverse_1999_indonesia',
    url: 'https://www.instagram.com/reverse_1999_indonesia?igsh=MTZhbXc1c3N3ZXpsNA==',
    topic: 'Reverse 1999',
    followers: '2.539',
    avatar: '/partners/reverse1999indo.jpg',
  },
  {
    name: '@kapten.semmelweiss',
    url: 'https://www.instagram.com/kapten.semmelweiss?igsh=ZzFiYnJ2MmxnYWlh',
    topic: 'Reverse: 1999, info seputar Arcanist, dll.',
    followers: '445',
    avatar: '/partners/kapten-semmelweiss.jpg',
  },
  {
    name: '@kysekai.id',
    url: 'https://www.instagram.com/kysekai.id?igsh=MW5maTB0eWlnM3ZkeA==',
    topic: 'Project Sekai',
    followers: '15,9 K',
    avatar: '/partners/kysekai.jpg',
  },
  {
    name: '@bigbob_arknights',
    url: 'https://www.instagram.com/bigbob_arknights?igsh=MXd6cGpwaWt4b3oxbw==',
    topic: 'Arknights',
    followers: '3.770',
    avatar: '/partners/bigbob-arknights.jpg',
  },
  {
    name: '@infoarknights.id',
    url: 'https://www.instagram.com/infoarknights.id',
    topic: 'Arknights',
    followers: '13,6 K',
    avatar: '/partners/infoarknights.jpg',
  },
  {
    name: '@arknights_chiave',
    url: 'https://www.instagram.com/arknights_chiave/',
    topic: 'Arknights',
    followers: '2 K',
    avatar: '/partners/arknights-chiave.jpg',
  },
  {
    name: '@anitomochi',
    url: 'https://www.instagram.com/anitomochi/',
    topic: 'Jejepangan, Game',
    followers: '33 K',
    avatar: '/partners/anitomochi.jpg',
  },
  {
    name: '@fategrand_indonesia',
    url: 'https://www.instagram.com/fategrand_indonesia?igsh=ajB5b2lkdGR0NjY3',
    topic: 'Seputar info Fate Series',
    followers: '1.927',
    avatar: '/partners/fategrand-id.jpg',
  },
  {
    name: '@neo_fgo_world',
    url: 'https://www.instagram.com/neo_fgo_world?igsh=MXRzNHNva29uZmM4Yw==',
    topic: 'All content Type-Moon',
    followers: '2.851',
    avatar: '/partners/neo-fgo-world.jpg',
  },
  {
    name: '@fgo_jackbonaparte',
    url: 'https://www.instagram.com/fgo_jackbonaparte/',
    topic: 'FGO, game yang aku mainin, juga Hollow Knight',
    followers: '6 K',
    avatar: '/partners/fgo-jackbonaparte.jpg',
  },
];



const SPONSORS = [
  { tag: '@tokowendigg', url: 'https://www.tokowendigg.com' },
  { tag: '@juraganakun.official', url: 'https://instagram.com/juraganakun.official' },
  { tag: '@gachaverse.store', url: 'https://instagram.com/gachaverse.store' },
];

const GROUPS = [
  { name: 'Honkai: Star Rail', desc: 'Diskusi meta, build, banner, dan lelang akun.', link: '#' },
  { name: 'Genshin Impact', desc: 'Tips artefak, rota, dan co-op weekly boss.', link: '#' },
  { name: 'Wuthering Waves', desc: 'Echo route, boss timer, dan team comp.', link: '#' },
  { name: 'Arknights', desc: 'Guide CC, base layout, dan pull discuss.', link: '#' },
];

const DISCORD = {
  name: 'Perguruan Tinggi Gachaverse.id',
  desc: 'Chat, voice room, Games, Nobar, dan info event.',
  invite: 'https://discord.gg/axEm2P2WWA',
  online: 297,
  members: 1527,
};
const AI_CONTACTS = {
  // Ganti nomor/link sesuai kebutuhan
  waBot: 'https://wa.me/6285179546561?text=Halo%20mau%20pakai%20Bot%20WhatsApp',
  ocr:   '#',
  // Asisten komunitas aku arahkan ke Discord invite yang sudah ada
  assistant:'https://wa.me/6285179546561?text=Halo%20Yura%20Apakah%20Yura%2FOnline',
};

/* ==================== UI helpers ==================== */
function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-50 md:backdrop-blur supports-[backdrop-filter]:bg-black/30 bg-black/60 md:bg-black/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src="/logo-text.png" alt="Gachaverse.id" className="h-8 w-auto" loading="lazy" decoding="async" />
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="hover:text-white transition-colors">{n.label}</a>
            ))}
            <a href="#join" className="rounded-2xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 transition-colors">
              Gabung
            </a>
          </nav>

          {/* mobile quick actions (3 item): Discord • Gabung • Menu */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href={DISCORD.invite}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join Discord"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20 text-white/90"
            >
              {/* inline discord icon */}
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M20.5 4.5a16 16 0 00-4.1-1.3l-.2.4a12.9 12.9 0 013.2 1.5c-1.45-.68-2.92-1.03-4.39-1.18a10.3 10.3 0 00-3.22 0c-1.47.15-2.94.5-4.39 1.18a13.2 13.2 0 013.2-1.5l-.2-.4A16 16 0 003.5 4.5 16.4 16.4 0 000 15.5c2.48 2.92 6.1 3.25 9.4 3.5l.7-.9c-.95-.28-1.84-.7-2.65-1.25 1.78 1.34 3.82 1.98 5.95 1.98s4.17-.64 5.95-1.98c-.81.55-1.7.97-2.65 1.25l.7.9c3.3-.25 6.92-.58 9.4-3.5A16.4 16.4 0 0020.5 4.5zM8.8 14.1c-1.02 0-1.85-.93-1.85-2.07 0-1.15.83-2.08 1.85-2.08s1.85.93 1.85 2.08c0 1.14-.83 2.07-1.85 2.07zm6.4 0c-1.02 0-1.85-.93-1.85-2.07 0-1.15.83-2.08 1.85-2.08s1.85.93 1.85 2.08c0 1.14-.83 2.07-1.85 2.07z"/>
              </svg>
            </a>

            <a
              href="#join"
              className="rounded-xl bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Gabung
            </a>
          </div>
        </div>
      </div>

      {/* mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-black/80">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2 text-white/80">
            {NAV.map(n => (
              <a key={n.href} href={n.href} className="block py-2" onClick={() => setOpen(false)}>
                {n.label}
              </a>
            ))}
            <a href="#join" className="inline-block rounded-2xl bg-blue-600 px-4 py-2 font-medium text-white">
              Gabung
            </a>
          </div>
        </div>
      )}
    </div>
  );
}



function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-black">
      {/* BG statis (ringan) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        <div className="absolute inset-0 bg-[url('/banner.jpg')] bg-cover bg-[position:center_35%] opacity-15" />
      </div>

      {/* Konten (fade awal bisa dimatikan jika reduce) */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center pt-28 md:pt-32">
        {reduce ? (
          <div className="flex flex-col items-center gap-8">
            <img src="/logo-text.png" alt="Gachaverse.id" className="w-[320px] sm:w-[420px]" loading="lazy" decoding="async" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">All About Gacha</h1>
            <p className="max-w-2xl text-white/80">Gachaverse.id adalah rumah bagi para penggemar game gacha di Indonesia. Kami menyatukan pemain, kreator, leluhur, dan penggemar dalam satu komunitas yang aktif, positif, dan menyenangkan.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#about" className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
                Jelajahi <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href="#join" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-white/90 hover:bg-white/10">Gabung Komunitas</a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-white/70">
              <div className="rounded-xl bg-white/5 px-4 py-3 md:backdrop-blur">80+ Admin</div>
              <div className="rounded-xl bg-white/5 px-4 py-3 md:backdrop-blur">20K+ Anggota</div>
              <div className="rounded-xl bg-white/5 px-4 py-3 md:backdrop-blur">Event Komunitas</div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            <img src="/logo-text.png" alt="Gachaverse.id" className="w-[320px] sm:w-[420px]" loading="lazy" decoding="async" />
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">All About Gacha</h1>
            <p className="max-w-2xl text-white/80">Gachaverse.id adalah rumah bagi para penggemar game gacha di Indonesia. Kami menyatukan pemain, kreator, cosplayer, dan penggemar dalam satu komunitas yang aktif dan menyenangkan.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a href="#about" className="group inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500">
                Jelajahi <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href="#join" className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-white/90 hover:bg-white/10">Gabung Komunitas</a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-white/70">
              <div className="rounded-xl bg-white/5 px-4 py-3 md:backdrop-blur">80+ Admin</div>
              <div className="rounded-xl bg-white/5 px-4 py-3 md:backdrop-blur">20K+ Anggota</div>
              <div className="rounded-xl bg-white/5 px-4 py-3 md:backdrop-blur">Event Komunitas</div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black" />
    </section>
  );
}

function Section({ id, icon: Icon, title, subtitle, children }) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 bg-black"
      style={{
        contentVisibility: 'auto',           // tunda paint saat offscreen
        containIntrinsicSize: '800px',       // ukuran perkiraan agar layout stabil
        contain: 'layout paint style',       // batasi reflow ke section ini
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600/20 p-2 text-blue-400">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-white/70">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({ children, className = '' }) {
  // Ganti framer-motion → CSS transition ringan
  return (
    <div
      className={`group rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:backdrop-blur shadow-lg shadow-black/30 transition-transform duration-200 md:hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

/* ==================== Sections ==================== */
function About() {
  return (
    <Section id="about" icon={Stars} title="Tentang Komunitas" subtitle="Gachaverse.id — tempat berkumpulnya penggemar gacha">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="mb-2 text-white/70">Komunitas</div>
          <h3 className="mb-1.5 text-xl font-semibold text-white">Ramah & Aktif</h3>
          <p className="text-white/70">Kami menyatukan pemain berbagai game gacha untuk berdiskusi, berbagi tips, dan saling membantu.</p>
        </Card>
        <Card>
          <div className="mb-2 text-white/70">Event</div>
          <h3 className="mb-1.5 text-xl font-semibold text-white">Beragam Aktivitas</h3>
          <p className="text-white/70">Mulai dari challenge banner, giveaway, hingga meet-up cosplayer untuk mempererat komunitas.</p>
        </Card>
        <Card>
          <div className="mb-2 text-white/70">Dukungan</div>
          <h3 className="mb-1.5 text-xl font-semibold text-white">Support & Edukasi</h3>
          <p className="text-white/70">Kami memberi ruang untuk kreator dan pemain baru agar bisa belajar bersama, termasuk panduan build karakter dan lelang akun.</p>
        </Card>
      </div>
    </Section>
  );
}

function AIBot() {
  const btnClass =
    "mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 " +
    "text-sm font-medium text-white hover:bg-blue-500";

  return (
    <Section id="ai-bot" icon={Bot} title="Dukungan AI & Bot" subtitle="Inovasi untuk mempermudah komunitas">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 text-lg font-semibold text-white">Bot WhatsApp</h3>
          <p className="text-white/70">
            Bot otomatis untuk cek banner, info event, hingga log aktivitas grup secara cepat.
          </p>
          <a
            href={AI_CONTACTS.waBot}
            target="_blank"
            rel="noopener noreferrer"
            className={btnClass}
          >
            Chat sekarang <ChevronRight className="h-4 w-4" />
          </a>
        </Card>

        <Card>
          <h3 className="mb-2 text-lg font-semibold text-white">AI Vision & OCR</h3>
          <p className="text-white/70">
            Membaca hasil gacha, teks di gambar, dan fitur vision untuk event interaktif.
          </p>
          <a
            href={AI_CONTACTS.ocr}
            target="_blank"
            rel="noopener noreferrer"
            className={btnClass}
          >
            On Going <ChevronRight className="h-4 w-4" />
          </a>
        </Card>

        <Card>
          <h3 className="mb-2 text-lg font-semibold text-white">Asisten Komunitas</h3>
          <p className="text-white/70">
            AI persona seperti Yura Naomi yang siap membantu member.
          </p>
          <a
            href={AI_CONTACTS.assistant}
            target="_blank"
            rel="noopener noreferrer"
            className={btnClass}
          >
            Chat sekarang <ChevronRight className="h-4 w-4" />
          </a>
        </Card>
      </div>
    </Section>
  );
}
function EventCard({ badge, title, desc, href = "#", img, ctaText = "Ikut sekarang" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/90 shadow-xl">
      {/* Foto */}
      <div
        aria-hidden
        className="absolute inset-0 bg-right bg-cover md:bg-[length:auto_120%]"
        style={{ backgroundImage: `url('${img}')` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />

      {/* Konten */}
      <div className="relative p-6 md:p-8 lg:p-10 max-w-[680px]">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-blue-300/90 ring-1 ring-white/10">
          <Stars className="h-3.5 w-3.5" />
          {badge}
        </div>

        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-white/80">{desc}</p>

        <a
          href={href}
          className={`mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white ${
            ctaText === 'Coming Soon' ? 'cursor-not-allowed opacity-60' : 'hover:bg-white/10'
          }`}
        >
          {ctaText}                            {/* 🔹 teks dinamis */}
          {ctaText !== 'Coming Soon' && <ChevronRight className="h-4 w-4" />}
        </a>
      </div>
    </div>
  );
}


function Events() {
  const EVENTS = [
    {
      title: 'Funmatch Mlbb',
      desc: '5vs5 dengan sistem eliminasi (Minimal 1 bulan ada digrup ACM).',
      badge: 'Bulanan',
      img: '/event/mlbb.jpg',
      href: 'https://chat.whatsapp.com/K77YYPDwx6o8Pj7lfMPBBY',
      ctaText: 'Segera',              // 🔹 teks tombol khusus
    },
    {
      title: 'Pojok Kreator Event ',
      desc: 'GFX, ART, dan konten kreatif lainnya. (join grup kreator sekarang)',
      badge: 'Seasonal',
      img: '/event/yura-2.jpg',
      href: 'https://chat.whatsapp.com/E0ORyfe4U6dGzho5gQZz2k',
      ctaText: 'Segera',               // 🔹 teks tombol khusus
    },
    {
      title: 'Cosplay Meet-Up',
      desc: 'Sesi foto + mini games di event lokal. (Yura akan datang)',
      badge: 'Seasonal',
      img: '/gallery/cos-3.jpeg',
      href: 'https://chat.whatsapp.com/FpmVawBdqKU60mJYSA6M5s',
      ctaText: 'November 2025 di Comifuro',                // 🔹 teks tombol khusus
    },
  ];

  return (
    <Section id="events" icon={Trophy} title="Event Komunitas" subtitle="Ikut seru-seruan bareng!">
      <div className="grid gap-6 md:grid-cols-3">
        {EVENTS.map((e) => (
          <EventCard
            key={e.title}
            badge={e.badge}
            title={e.title}
            desc={e.desc}
            img={e.img}
            href={e.href}
            ctaText={e.ctaText}      // 🔹 kirim ke kartu
          />
        ))}
      </div>
    </Section>
  );
}


function toRoleKey(label = '') {
  return String(label).trim().toLowerCase().replace(/\s+/g, '-');
}

// warna/gradient sesuai hierarki
const ROLE_BADGE = {
  'founder':                'from-amber-500 via-amber-400 to-yellow-400',
  'co-founder':             'from-orange-500 via-amber-500 to-yellow-400',
  'head-admin':             'from-rose-600 via-red-500 to-orange-500',
  'Best-Creator':           'from-sky-600 via-blue-500 to-indigo-500',
  'sekretaris':             'from-rose-500 via-pink-500 to-fuchsia-500',
  'owner-gvstore':          'from-fuchsia-600 via-pink-600 to-rose-500',
};

function getRoleGradient(roleLabel) {
  const key = toRoleKey(roleLabel);
  return ROLE_BADGE[key] || 'from-slate-700 via-blue-700 to-sky-600'; // default
}

function Admins() {
  return (
    <Section id="admins" icon={Users} title="Pengenalan Admin" subtitle="Dari 80+ admin, berikut highlight 6 orang.">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-5 lg:gap-6">
        {ADMIN_PREVIEW.map((a) => (
          <Card key={a.name} className="text-center p-3 sm:p-4">
            {/* Avatar — lebih kecil di mobile */}
            <div className="mx-auto mb-2 h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border border-white/20 bg-white/10">
              <img src={a.img} alt={a.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </div>

            {/* Nama — lebih kecil & sedikit transparan */}
            <div className="text-xs sm:text-sm font-medium text-white/80 leading-tight">
              {a.name}
            </div>

            {/* Role badge — ukurannya diperkecil + wrap rapi */}
            <span
              className={[
                'mt-1.5 inline-flex items-center justify-center rounded-full',
                'px-2.5 py-0.5 sm:px-3 sm:py-1',
                'text-[11px] sm:text-[12px] font-semibold text-white leading-none',
                'bg-gradient-to-r', getRoleGradient(a.role),
                'ring-1 ring-white/10 shadow-[0_6px_20px_rgba(30,58,138,0.25)]',
                'max-w-[170px] mx-auto whitespace-normal text-center'
              ].join(' ')}
              title={a.role}
            >
              {a.role}
            </span>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="/admins"
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Lihat 80+ Admin Lainnya <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}



function Groups() {
  return (
    <Section id="groups" icon={MessageCircle} title="Grup WhatsApp" subtitle="Pilih grup sesuai game yang kamu mainkan.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((g) => (
          <Card key={g.name}>
            <h3 className="text-lg font-semibold text-white">{g.name}</h3>
            <p className="mt-1 text-white/70">{g.desc}</p>
            <a href={g.link} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">
              Join Grup <ChevronRight className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <a href="/groups" className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500">
          20+ Grup Aktif Lainnya <ChevronRight className="h-4 w-4" />
        </a>
      </div>
      <p className="mt-4 text-center text-xs text-white/60">Catatan: link grup akan diverifikasi admin. Jaga etika & isi intro.</p>
    </Section>
  );
}

function DiscordSection() {
  return (
    <Section id="discord" icon={Users} title="Server Discord" subtitle="Join Discord resmi komunitas.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-white">{DISCORD.name}</h3>
          <p className="mt-1 text-white/70">{DISCORD.desc}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(74,222,128,0.2)]" />
              {DISCORD.online} online
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <Users className="h-3.5 w-3.5" />
              {DISCORD.members} members
            </span>
          </div>

          <a href={DISCORD.invite} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
            Join Discord <ChevronRight className="h-4 w-4" />
          </a>
        </Card>
      </div>
    </Section>
  );
}
function CreativeCorner() {
  // gandakan data 3× supaya ada ruang “buffer” di kiri/kanan
  const BASE = Array.isArray(CREATIONS) ? CREATIONS : [];
  const SLIDES = [...BASE, ...BASE, ...BASE];
  const MID = BASE.length;           // panjang satu siklus
  const START = MID;                 // mulai di salinan tengah (aman)

  const [index, setIndex] = useState(START);
  const [cardW, setCardW] = useState(320);
  const [animTrack, setAnimTrack] = useState(true);   // kontrol transition track
  const [animCard, setAnimCard] = useState(true);     // kontrol transition kartu
  const trackRef = useRef(null);
  const lockedRef = useRef(false);

  // transition durations (ms) centralized so we can reuse for timeouts/fallbacks
  const TRACK_MS = 700;
  const CARD_MS = 380;
  const TRANSITION_MARGIN = 120; // extra ms for safety

  const beginTransition = () => {
    // mark locked and attach a one-time transitionend fallback to ensure unlock
    if (!trackRef.current) {
      lockedRef.current = true;
      setTimeout(() => { lockedRef.current = false; }, TRACK_MS + TRANSITION_MARGIN);
      return;
    }

    lockedRef.current = true;
    const track = trackRef.current;
    let done = false;
    const onEnd = (ev) => {
      if (ev.propertyName && ev.propertyName !== 'transform') return;
      if (done) return;
      done = true;
      track.removeEventListener('transitionend', onEnd);
      lockedRef.current = false;
    };
    track.addEventListener('transitionend', onEnd);
    // fallback
    setTimeout(() => {
      if (done) return;
      done = true;
      track.removeEventListener('transitionend', onEnd);
      lockedRef.current = false;
    }, TRACK_MS + TRANSITION_MARGIN);
  };
  const debugRef = useRef(null);

  const clientLog = (payload) => {
    try {
      fetch('/api/log', { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } });
    } catch {}
  };

  // ukur lebar kartu + gap, supaya translateX presisi
  useEffect(() => {
    const measure = () => {
      const first = document.querySelector('.kc-slide');
      if (!first) return;
      const style = getComputedStyle(first.parentElement); // parent = track (punya gap)
      const gap = parseInt(style.columnGap || style.gap || '24', 10);
      setCardW(first.offsetWidth + gap);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  // autoplay
  useEffect(() => {
    const t = setInterval(() => {
      if (lockedRef.current) return;
      setIndex((i) => i + 1);
      beginTransition();
    }, 2600);
    return () => clearInterval(t);
  }, []);

  // RESET TANPA KEDIP:
  // ketika mencapai ujung salinan tengah (>= MID*2), lompat balik ke cermin (−MID)
  // matikan transition track & kartu sesaat agar tidak ada anim “mundur”
  useLayoutEffect(() => {
    // no-op when there's no data
    if (MID === 0) return;

    const track = trackRef.current;

    // forward wrap: when we step past the right buffer, allow the browser to
    // finish the visible transition to the right copy, then silently reset the
    // index back to the middle copy without animation. This avoids any
    // mid-transition toggles that could cause visible jumps.
    if (index >= MID * 2) {
      const target = index - MID; // same item in the middle copy

      if (track) {
        let cleared = false;

        const restore = () => {
          if (cleared) return;
          cleared = true;
          // disable react-driven transitions so index change happens without anim
          setAnimTrack(false);
          setAnimCard(false);
          // also disable DOM transitions immediately so the manual transform doesn't animate
          const slides = track ? track.querySelectorAll('.kc-slide') : [];
          if (track) track.style.transition = 'none';
          slides.forEach((s) => (s.style.transition = 'none'));
          // directly set DOM transform to the target position (no transition)
          if (track && typeof cardW === 'number') track.style.transform = `translateX(-${target * cardW}px)`;
          setIndex(target);
          // restore DOM transitions and React-driven anim flags on next frame
          requestAnimationFrame(() => {
            if (track) track.style.transition = '';
            slides.forEach((s) => (s.style.transition = ''));
            setAnimTrack(true);
            setAnimCard(true);
          });
        };

        const onEnd = (ev) => {
          if (ev.propertyName && ev.propertyName !== 'transform') return;
          track.removeEventListener('transitionend', onEnd);
          clearTimeout(timeout);
          clientLog({ ev: 'wrap-forward-end', index, target, animTrack, animCard });
          restore();
        };

        const timeout = setTimeout(() => {
          track.removeEventListener('transitionend', onEnd);
          restore();
        }, 900);

        track.addEventListener('transitionend', onEnd);
        clientLog({ ev: 'wrap-forward-start', index, target, animTrack, animCard });
      } else {
        setAnimTrack(false);
        setAnimCard(false);
        setIndex(target);
        requestAnimationFrame(() => {
          setAnimTrack(true);
          setAnimCard(true);
        });
      }

      return;
    }

    // backward wrap: when we step past the left buffer (below 0..MID-1),
    // jump forward by MID so we stay in the middle copy. Mirror the forward logic.
    if (index < MID) {
      const target = index + MID;

      if (track) {
        let cleared = false;

        const restore = () => {
          if (cleared) return;
          cleared = true;
          setAnimTrack(false);
          setAnimCard(false);
          const slides = track ? track.querySelectorAll('.kc-slide') : [];
          if (track) track.style.transition = 'none';
          slides.forEach((s) => (s.style.transition = 'none'));
          if (track && typeof cardW === 'number') track.style.transform = `translateX(-${target * cardW}px)`;
          setIndex(target);
          requestAnimationFrame(() => {
            if (track) track.style.transition = '';
            slides.forEach((s) => (s.style.transition = ''));
            setAnimTrack(true);
            setAnimCard(true);
          });
        };

        const onEnd = (ev) => {
          if (ev.propertyName && ev.propertyName !== 'transform') return;
          track.removeEventListener('transitionend', onEnd);
          clearTimeout(timeout);
          clientLog({ ev: 'wrap-backward-end', index, target, animTrack, animCard });
          restore();
        };

        const timeout = setTimeout(() => {
          track.removeEventListener('transitionend', onEnd);
          restore();
        }, 900);

        track.addEventListener('transitionend', onEnd);
        clientLog({ ev: 'wrap-backward-start', index, target, animTrack, animCard });
      } else {
        setAnimTrack(false);
        setAnimCard(false);
        setIndex(target);
        requestAnimationFrame(() => {
          setAnimTrack(true);
          setAnimCard(true);
        });
      }
    }
  }, [index, MID]);

  // if no creations provided, render nothing (avoids runtime errors)
  if (MID === 0) {
    return (
      <Section id="creative" icon={ImageIcon} title="Pojok Kreasi" subtitle="Karya komunitas: desain, ilustrasi, dan poster">
        <div className="text-white/70">Belum ada kreasi untuk ditampilkan.</div>
      </Section>
    );
  }

  // jarak “melingkar” ke pusat supaya highlight tidak meloncat saat reset
  const nearestDist = (i) => {
    const d0 = Math.abs(i - index);
    const d1 = Math.abs(i - (index + MID));
    const d2 = Math.abs(i - (index - MID));
    return Math.min(d0, d1, d2);
  };

  return (
    <Section id="creative" icon={ImageIcon} title="Pojok Kreasi" subtitle="Karya komunitas: desain, ilustrasi, dan poster">
      <div className="relative">
        {/* gradient gelap sisi kiri/kanan */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/70 to-transparent" />

        {/* TRACK */}
        <div
          ref={trackRef}
          className="flex gap-6 items-center will-change-transform"
          style={{
            transform: `translateX(-${index * cardW}px)`,
            transition: animTrack ? `transform ${TRACK_MS}ms cubic-bezier(.22,.61,.36,1)` : 'none',
          }}
        >
          {SLIDES.map((it, i) => {
            const d = Math.min(nearestDist(i), 2); // pusat, tetangga, lainnya
            const scale = d === 0 ? 1 : d === 1 ? 0.94 : 0.9;
            const opacity = d === 0 ? 1 : d === 1 ? 0.78 : 0.58;
            const ring = d === 0 ? 'ring-white/20' : 'ring-white/10';

            return (
              <div
                key={`${i}-${it.src}`}
                className={`kc-slide shrink-0 rounded-3xl overflow-hidden ring-1 ${ring} bg-white/[0.03]`}
                style={{
                  width: 'min(78vw, 520px)',
                  aspectRatio: '4 / 5',
                  transform: `scale(${scale})`,
                  opacity,
                  transition: animCard ? `transform ${CARD_MS}ms, opacity ${CARD_MS}ms` : 'none',
                }}
                aria-hidden={d !== 0}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={it.src}
                    alt={it.credit || 'Karya komunitas'}
                    fill
                    priority={false}
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 420px, 520px"
                    className="object-cover"
                  />
                  {it.credit && (
                    <div className="absolute left-2 bottom-2 rounded-md bg-black/55 px-2 py-1 text-[11px] text-white/85">
                      {it.credit}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* kontrol manual (opsional) */}
      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={() => {
            if (lockedRef.current) return;
            setIndex((i) => i - 1);
            beginTransition();
          }}
          className="rounded-xl border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
        >
          ‹
        </button>
        <button
          onClick={() => {
            if (lockedRef.current) return;
            setIndex((i) => i + 1);
            beginTransition();
          }}
          className="rounded-xl border border-white/15 px-3 py-1.5 text-sm text-white/90 hover:bg-white/10"
        >
          ›
        </button>
      </div>
    </Section>
  );
}

/* ============== GALLERY with hover/tap overlay ============== */
function formatDate(idDateLike) {
  try {
    const d = new Date(idDateLike);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return idDateLike;
  }
}

function Gallery() {
  const items = Array.isArray(GALLERY_DATA) ? GALLERY_DATA : [];

  return (
    <Section id="gallery" icon={ImageIcon} title="Dokumentasi Meet-Up Cosplayer" subtitle="Cuplikan aktivitas komunitas.">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, i) => {
          if (!item?.src) return null;
          const title = item.title || `Gallery ${i + 1}`;
          const date = item.date ? formatDate(item.date) : '';
          const location = item.location || '';

          return (
            <div key={`${i}-${item.src}`} className="relative">
              <button type="button" className="group relative block w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 focus:outline-none">
                <div className="relative w-full aspect-video">
                  <Image
                    src={item.src}
                    alt={title}
                    fill
                    quality={70}
                    loading={i < 1 ? 'eager' : 'lazy'}
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 md:group-hover:scale-[1.03] md:group-focus:scale-[1.03]"
                  />
                </div>

                {/* Overlay dihover/fokus (md+) */}
                <div className="pointer-events-none absolute inset-0 hidden md:flex items-end justify-start opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
                  <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <div className="text-white font-semibold">{title}</div>
                    {(date || location) && (
                      <div className="mt-1 text-xs text-white/80">
                        {date}{date && location ? ' • ' : ''}{location}
                      </div>
                    )}
                    {item.desc ? <div className="mt-1 text-[11px] text-white/70 line-clamp-2">{item.desc}</div> : null}
                  </div>
                </div>

                {/* Overlay statis di mobile (ringan, tanpa animasi) */}
                <div className="absolute inset-x-0 bottom-0 md:hidden bg-gradient-to-t from-black/70 to-transparent p-2">
                  <div className="text-[13px] font-medium text-white">{title}</div>
                  {(date || location) && (
                    <div className="text-[11px] text-white/80">
                      {date}{date && location ? ' • ' : ''}{location}
                    </div>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
function MediaPartners() {
  return (
    <Section id="media-partners" icon={Sparkles} title="Media Partner">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {MEDIA_PARTNERS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors flex gap-3"
          >
            {/* Avatar */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
              <img
                src={p.avatar}
                alt={p.name}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Detail */}
            <div className="flex flex-col justify-center">
              <div className="text-sm font-semibold text-white group-hover:text-blue-300">
                {p.name}
              </div>
              <div className="text-xs text-white/70">{p.topic}</div>
              <div className="mt-1 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/75">
                {p.followers} followers
              </div>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}


function Sponsors() {
  return (
    <Section id="sponsors" icon={Sparkles} title="Disponsori oleh">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {SPONSORS.map((s) => (
          <a key={s.tag} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white/90 hover:bg-white/10">
            {s.tag}
          </a>
        ))}
      </div>
    </Section>
  );
}

function Closing() {
  return (
    <section id="join" className="relative bg-gradient-to-b from-black via-black to-black">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">Siap gabung ke Gachaverse.id?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-white/70">Masuk ke salah satu grup WhatsApp, ikuti event, dan jadilah bagian dari komunitas gacha paling aktif di Indonesia.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="#groups" className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">Pilih Grup</a>
          <a href="#events" className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white/90 hover:bg-white/10">Lihat Event</a>
        </div>
        <p className="mt-8 text-xs text-white/50">© {new Date().getFullYear()} Gachaverse.id • All rights reserved.</p>
      </div>
    </section>
  );
}

/* ==================== Root ==================== */
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.groupCollapsed('[Gachaverse Landing] Sanity Tests');
  console.assert(Array.isArray(NAV) && NAV.length >= 5, 'NAV should have items');
  console.assert(Array.isArray(ADMIN_PREVIEW) && ADMIN_PREVIEW.length === 6, 'ADMIN_PREVIEW should be 6 items');
  console.assert(Array.isArray(SPONSORS) && SPONSORS.length === 3, 'SPONSORS should have 3 items');
  console.assert(Array.isArray(GROUPS) && GROUPS.length >= 4, 'GROUPS should have at least 4 items');
  console.assert(Array.isArray(GALLERY_DATA) && GALLERY_DATA.length >= 3, 'GALLERY should have items');
  console.groupEnd();
}

export default function GachaverseLanding() {
  useEffect(() => {}, []);
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white">
      <NavBar />
      <main>
        <Hero />
        <About />
        <AIBot />
        <Events />
        <Admins />
        <Groups />
        <DiscordSection />
        <CreativeCorner />
        <MediaPartners /> 
        <Sponsors />
        <Gallery />
        <Closing />
      </main>
    </div>
  );
}
