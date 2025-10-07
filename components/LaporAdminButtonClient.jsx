'use client';
import { AlertTriangle } from 'lucide-react';

export default function LaporAdminButtonClient({ adminName, adminSlug, waNumber, className='' }) {
  const onClick = (e) => {
    e.preventDefault();
    const nick = prompt('Nickname WA kamu?');
    if (nick === null) return;
    const grup = prompt('Dari Grup Mana?');
    if (grup === null) return;
    const keluhan = prompt('Isi keluhan?');
    if (keluhan === null) return;

    const msg = `Halo Head Admin, saya ${nick} dari ${grup} ingin melaporkan admin ${adminName} terkait "${keluhan}".`;
    const url = `https://wa.me/${6285710161768}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl bg-red-600/90 hover:bg-red-600 px-4 py-2 text-sm font-semibold text-white ring-1 ring-red-300/30 ${className}`}
      aria-label="Lapor Admin via WhatsApp"
      title="Lapor Admin via WhatsApp"
    >
      <AlertTriangle className="h-4 w-4" />
      Lapor Admin (Izinkan Pop Up)
    </button>
  );
}
