// app/admins/[slug]/page.jsx
import { notFound } from 'next/navigation';
import ClientProfile from './ClientProfile';
import { admins } from '../../../data/admins';

export async function generateStaticParams() {
  // hanya data minim buat prerender route
  return admins.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const a = admins.find((x) => x.slug === params.slug);
  return { title: a ? `${a.name} — Admin Gachaverse.id` : 'Admin' };
}

export default function Page({ params }) {
  const admin = admins.find((a) => a.slug === params.slug);
  if (!admin) return notFound();

  // Oper ke komponen client
  return <ClientProfile admin={admin} />;
}
