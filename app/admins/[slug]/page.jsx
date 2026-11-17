import { notFound } from "next/navigation";
import { getAdminBySlug } from "@/lib/adminsDb";
import ClientProfile from "./ClientProfile";

export const revalidate = 60;

export default async function Page({ params }) {
  const { slug } = await params;
  const admin = await getAdminBySlug(slug);
  if (!admin) notFound();
  return <ClientProfile admin={admin} />;
}