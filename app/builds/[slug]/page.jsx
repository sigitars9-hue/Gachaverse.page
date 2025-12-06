"use client";

import React from "react";   
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldHalf,
  Swords,
  Plus,
  Info,
  ChevronLeft,
  Star,
  Wand2,
  Users,
  BookOpen,
  BadgeCheck,
} from "lucide-react";

/* =========================================================
   Gachaverse — Character Build Page
   Route: /builds/[slug]
   Styling: Tailwind + subtle glassmorphism to match landing page
   Replace placeholder images in /public/builds/<slug>/...
   ========================================================= */

/* ── Example data shape (replace with your real source later) ── */

/* ── Helpers ── */

// Baca JSON dari TXT di /public/builds/<slug>.txt
async function loadBuildFromTxt(slug) {
  try {
    const res = await fetch(`/builds/${slug}.txt`, { cache: "no-store" });
    if (!res.ok) return null;
    const text = await res.text();
    // idealnya isi TXT = JSON murni tanpa komentar/koma gantung
    const obj = JSON.parse(text);
    return obj || null;
  } catch (e) {
    console.warn("TXT load failed:", e);
    return null;
  }
}

const getBuildBySlug = (slug) => DATA_BUILDS.find((x) => x.slug === slug);

const rarityStars = (n = 4) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-current" />
    ))}
  </div>
);

const Glass = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl ${className}`}
  >
    {children}
  </div>
);

/* ── Badge / pill ── */
const Pill = ({ icon: Icon = Info, children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
    <Icon className="w-3.5 h-3.5" /> {children}
  </span>
);

/* ── Image placeholder block ── */
function ImgPh({ w = 480, h = 600, alt = "", src }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10" style={{ aspectRatio: `${w}/${h}` }}>
      {src ? (
        <Image fill src={src} alt={alt} className="object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-white/60 text-sm">
          <Wand2 className="w-5 h-5 mr-2" /> Tempat gambar — /public/builds/...
        </div>
      )}
    </div>
  );
}

/* ── Small cards ── */
function ItemCard({ title, subtitle, img, children }) {
  return (
    <Glass className="p-4 flex gap-4 items-center">
      <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5 grid place-items-center">
        {img ? (
          <Image src={img} alt={title} width={56} height={56} className="object-cover" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{title}</div>
        {subtitle && <div className="text-xs text-white/60 truncate">{subtitle}</div>}
        {children && <div className="mt-2 text-sm text-white/80">{children}</div>}
      </div>
    </Glass>
  );
}

/* ── Section header ── */
const Section = ({ icon: Icon, title, children, className = "" }) => (
  <section className={`space-y-4 ${className}`}>
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5" />
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

/* ── Page ── */
export default function Page({ params }) {
  const { slug } = params;
  const [loaded, setLoaded] = React.useState(null);

React.useEffect(() => {
  let live = true;
  (async () => {
    const fromTxt = await loadBuildFromTxt(slug);
    if (live) setLoaded(fromTxt);
  })();
  return () => { live = false; };
}, [slug]);

const data = loaded || getBuildBySlug(slug);

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <Link href="/builds" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
            <ChevronLeft className="w-4 h-4" /> Kembali ke Builds
          </Link>
          <div className="mt-10">Data belum tersedia untuk: <span className="font-semibold">{slug}</span></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white">
      {/* ── Splash background (optional) ── */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        {data.splash && (
          <Image src={data.splash} alt="splash" fill className="object-contain object-right opacity-10 pointer-events-none select-none" />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* ── Breadcrumb / back ── */}
        <div className="flex items-center justify-between">
          <Link href="/builds" className="inline-flex items-center gap-2 text-white/70 hover:text-white">
            <ChevronLeft className="w-4 h-4" /> Semua Builds
          </Link>
          <div className="text-white/60 text-sm">Gachaverse • Build Guide</div>
        </div>

        {/* ── Hero ── */}
        <Glass className="p-6 md:p-8">
          <div className="grid md:grid-cols-[360px,1fr] gap-6 md:gap-10 items-center">
            <ImgPh src={data.portrait} alt={data.name} w={360} h={460} />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {rarityStars(data.rarity)}
                <span className="px-2 py-0.5 text-xs rounded border border-white/10 bg-white/5">{data.element}</span>
                <span className="px-2 py-0.5 text-xs rounded border border-white/10 bg-white/5">{data.path}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                {data.name}
              </h1>
              <p className="text-white/80">{data.role}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {data.tags.map((t) => (
                  <Pill key={t} icon={BadgeCheck}>{t}</Pill>
                ))}
              </div>
            </div>
          </div>
        </Glass>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Left column */}
          <div className="md:col-span-2 space-y-8">
            <Section icon={ShieldHalf} title="Relic Sets & Ornaments">
              <div className="grid sm:grid-cols-2 gap-4">
                {data.relics.sets.map((r) => (
                  <ItemCard key={r.name} title={r.name} subtitle="Relic Set" img={r.img}>
                    {r.reason}
                  </ItemCard>
                ))}
              </div>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {data.relics.ornaments.map((r) => (
                  <ItemCard key={r.name} title={r.name} subtitle="Planar Ornament" img={r.img}>
                    {r.reason}
                  </ItemCard>
                ))}
              </div>

              <Glass className="mt-4 p-4">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-white/60">Body</div>
                    <div className="font-medium">{data.relics.mainStats.body}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Feet</div>
                    <div className="font-medium">{data.relics.mainStats.feet}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Sphere</div>
                    <div className="font-medium">{data.relics.mainStats.sphere}</div>
                  </div>
                  <div>
                    <div className="text-white/60">Rope</div>
                    <div className="font-medium">{data.relics.mainStats.rope}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-white/60">Substat: </span>
                  {data.relics.subStats.join(" → ")}
                </div>
              </Glass>
            </Section>

            <Section icon={Swords} title="Light Cones (Urutan Rekomendasi)">
              <div className="grid sm:grid-cols-2 gap-4">
                {data.lightCones.map((lc) => (
                  <ItemCard key={lc.name} title={`${lc.name} (${lc.rarity}★)`} img={lc.img}>
                    {lc.reason}
                  </ItemCard>
                ))}
              </div>
            </Section>

            <Section icon={Users} title="Team Ideas">
              <div className="space-y-4">
                {data.teams.map((t) => (
                  <Glass key={t.name} className="p-4">
                    <div className="font-semibold">{t.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      {t.core.map((m) => (
                        <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{m}</span>
                      ))}
                    </div>
                    <div className="mt-2 text-white/80 text-sm">{t.idea}</div>
                  </Glass>
                ))}
              </div>
            </Section>

            <Section icon={BookOpen} title="Skill Notes">
              <div className="space-y-3">
                {data.skills.map((s, i) => (
                  <Glass key={i} className="p-3">
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-white/80">{s.tip}</div>
                  </Glass>
                ))}
              </div>
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <Section icon={Sparkles} title="Prioritas Stat">
              <Glass className="p-4">
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {data.statPriority.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </Glass>
            </Section>

            <Section icon={BadgeCheck} title="Eidolon Highlights">
              <div className="space-y-3">
                {data.eidolons.map((e) => (
                  <Glass key={e.no} className="p-3">
                    <div className="font-semibold">E{e.no} — {e.title}</div>
                    <div className="text-sm text-white/80">{e.note}</div>
                  </Glass>
                ))}
              </div>
            </Section>

            <Section icon={Info} title="Catatan Umum">
              <Glass className="p-4 text-sm text-white/90 leading-relaxed">
                {data.notes}
              </Glass>
            </Section>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 pb-10">
          <Glass className="p-4 md:p-6 flex items-center justify-between">
            <div className="text-sm text-white/70">Ingin menambahkan gambar, artefak, atau variasi tim? Edit data & unggah aset di folder <code className="px-1 rounded bg-white/10">/public/builds/{data.slug}</code>.</div>
            <Link href="/builds" className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm hover:bg-white/15">
              <ChevronLeft className="w-4 h-4" /> Kembali
            </Link>
          </Glass>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   Optional: simple /builds index page idea
   Create a new file: /app/builds/page.jsx with a grid of characters
   that links to /builds/[slug]. You can reuse Glass & ImgPh.
   ========================================================= */
