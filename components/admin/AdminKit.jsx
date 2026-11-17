export const stagger = (i) => ({ animationDelay: `${i * 60}ms` });

export function PageHeader({ title, desc, children }) {
  return (
    <div className="animate-fade-up flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0d0c22]">{title}</h1>
        {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

const TONES = {
  pink: "bg-pink-50 text-pink-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

export function StatCard({ i = 0, value, label, tone = "pink" }) {
  return (
    <div style={stagger(i)} className="animate-fade-up rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className={`inline-flex rounded-full px-3 py-1 text-2xl font-extrabold ${TONES[tone]}`}>{value}</div>
      <div className="mt-2 text-sm text-gray-500">{label}</div>
    </div>
  );
}