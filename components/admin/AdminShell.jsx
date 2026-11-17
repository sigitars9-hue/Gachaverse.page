import Link from "next/link";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", key: "home", label: "Dashboard" },
  { href: "/admin/new", key: "new", label: "Tambah admin" },
];

export default function AdminShell({ active, children }) {
  return (
    <div className="min-h-screen bg-[#f6f6fa] text-[#0d0c22]">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2 font-extrabold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0d0c22] text-sm text-white">G</span>
            Gachaverse <span className="text-pink-500">Admin</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href}
                className={`rounded-full px-3 py-1.5 transition ${active === n.key ? "bg-[#0d0c22] text-white" : "hover:bg-gray-100"}`}>
                {n.label}
              </Link>
            ))}
            <Link href="/admins" target="_blank" className="rounded-full px-3 py-1.5 hover:bg-gray-100">Lihat situs ↗</Link>
            <form action={logout}>
              <button className="rounded-full px-3 py-1.5 text-gray-500 hover:bg-gray-100">Keluar</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}