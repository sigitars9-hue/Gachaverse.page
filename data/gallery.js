// data/gallery.js
// Kumpulan item galeri untuk halaman landing.
// Setiap item wajib punya: src, title, date (YYYY-MM-DD), location.
// Optional: desc (teks tambahan untuk caption).

export const gallery = [
  {
    src: "/gallery/cos-1.jpeg",
    title: "Meet-up Cosplayer Vol. 1",
    date: "2024-06-15",
    location: "Jakarta",
    desc: "Sesi foto bareng dan perkenalan komunitas.",
  },
  {
    src: "/gallery/cos-2.jpeg",
    title: "Gathering Komunitas",
    date: "2024-07-21",
    location: "BSD, Tangerang",
    desc: "Mini games + sharing build.",
  },
  {
    src: "/gallery/cos-3.jpeg",
    title: "Photo Walk & Cos Session",
    date: "2024-08-04",
    location: "Kota Tua, Jakarta",
    desc: "Explor spot outdoor untuk foto karakter.",
  },
  {
    src: "/gallery/cos-4.jpeg",
    title: "Community Stage",
    date: "2024-09-14",
    location: "Bekasi",
    desc: "Showcase, kuis, dan hadiah merch.",
  },
  {
    src: "/gallery/cos-5.jpeg",
    title: "Meet-up Cosplayer Vol. 2",
    date: "2024-10-12",
    location: "Jakarta Convention Center",
    desc: "Rame-rame setelah event utama.",
  },
  {
    src: "/gallery/cos-6.jpeg",
    title: "Nobar & After Party",
    date: "2024-11-02",
    location: "Jakarta Selatan",
    desc: "Nobar + diskusi banner dan pull plan.",
  },
];

/*
Cara tambah data:
1) Taruh gambar di /public/gallery (mis. /public/gallery/event-7.jpeg)
2) Tambah objek baru di array di atas, contoh:

{
  src: "/gallery/event-7.jpeg",
  title: "Community Tournament",
  date: "2024-12-08",
  location: "Bandung",
  desc: "Turnamen 1v1, fun match, & hadiah top up."
}

Catatan:
- Pastikan ekstensi (jpg/jpeg/png) sesuai dengan file di /public/gallery.
- Format tanggal dianjurkan YYYY-MM-DD agar mudah diformat.
*/
