import { requireAdmin } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/AdminKit";
import AdminForm from "@/components/admin/AdminForm";

export default async function New() {
  await requireAdmin();
  return (
    <AdminShell active="new">
      <PageHeader title="Tambah admin" desc="Isi data, lalu simpan. Langsung tampil di website." />
      <div className="mt-6"><AdminForm /></div>
    </AdminShell>
  );
}