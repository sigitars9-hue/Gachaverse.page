import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAdminRaw } from "@/lib/adminsDb";
import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/AdminKit";
import { card, btnGhost } from "@/components/admin/ui";
import AdminForm from "@/components/admin/AdminForm";
import { deleteAdmin } from "../actions";

export default async function Edit({ params }) {
  await requireAdmin();
  const { slug } = await params;
  const a = await getAdminRaw(slug);
  if (!a) notFound();

  return (
    <AdminShell active="home">
      <PageHeader title={`Edit ${a.name}`} desc={`/admins/${a.slug}`}>
        <Link href={`/admins/${a.slug}`} target="_blank" className={btnGhost}>Lihat profil ↗</Link>
      </PageHeader>
      <div className="mt-6"><AdminForm a={a} /></div>

      <details className={`${card} mt-6 text-sm`}>
        <summary className="cursor-pointer font-semibold text-red-600">Hapus admin ini…</summary>
        <form action={deleteAdmin} className="mt-3">
          <input type="hidden" name="slug" value={a.slug} />
          <button className="rounded-full bg-red-600 px-4 py-2 font-bold text-white">Ya, hapus permanen</button>
        </form>
      </details>
    </AdminShell>
  );
}