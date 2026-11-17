import { saveAdmin } from "@/app/admin/actions";
import { ROLE_ORDER, GAME_ICON_MAP, cleanGames } from "@/lib/constants";
import { card, input } from "./ui";
import { stagger } from "./AdminKit";
import FileUploader from "./FileUploader";
import ChannelsEditor from "./ChannelsEditor";
import SubmitButton from "./SubmitButton";

const PLATFORMS = ["whatsapp", "discord", "instagram", "tiktok", "youtube", "x", "facebook"];

const Field = ({ label, className = "", children }) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-xs font-semibold text-gray-500">{label}</span>
    {children}
  </label>
);

const Section = ({ i, title, children }) => (
  <section style={stagger(i)} className={`${card} animate-fade-up`}>
    <h2 className="mb-4 font-bold">{title}</h2>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
);

const Chip = ({ name, value, checked, children }) => (
  <label className="cursor-pointer">
    <input type="checkbox" name={name} value={value} defaultChecked={checked} className="peer sr-only" />
    <span className="inline-block rounded-full border border-gray-200 px-3 py-1 text-xs font-medium transition
      peer-checked:border-[#0d0c22] peer-checked:bg-[#0d0c22] peer-checked:text-white hover:bg-gray-50">
      {children}
    </span>
  </label>
);

export default function AdminForm({ a = {} }) {
  const join = (v) => (v ?? []).join(", ");
  const isEdit = !!a.slug;
  const games = cleanGames(a.games ?? []);
  const roles = [...new Set([...ROLE_ORDER, a.role].filter(Boolean))];

  return (
    <form action={saveAdmin} className="space-y-5">
      <input type="hidden" name="original_slug" value={a.slug ?? ""} />
      <Section i={0} title="Identitas">
        <Field label="Nama"><input name="name" defaultValue={a.name} required className={input} /></Field>
        <Field label={isEdit ? "Slug (tidak bisa diubah)" : "Slug (alamat URL, huruf kecil)"}>
          <input name="slug" defaultValue={a.slug} readOnly={isEdit} required className={`${input} ${isEdit ? "bg-gray-50" : ""}`} />
        </Field>
        <Field label="Gender">
          <select name="gender" defaultValue={a.gender ?? "laki-laki"} className={input}>
            <option value="laki-laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </select>
        </Field>
        <Field label="Tahun bergabung"><input name="joined" type="number" defaultValue={a.joined} className={input} /></Field>
        <Field label="Role">
          <select name="role" defaultValue={a.role ?? "Admin"} className={input}>
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={a.status ?? "active"} className={input}>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </Field>
        <Field label="Tugas utama" className="sm:col-span-2">
          <textarea name="responsibility" defaultValue={a.responsibility} rows={3} className={input} />
        </Field>
      </Section>
<Section i={1} title="Pengunduran diri (isi jika status Nonaktif)">
  <Field label="Tanggal undur diri">
    <input type="date" name="resigned_at" defaultValue={a.resigned_at ?? ""} className={input} />
  </Field>
  <Field label="Alasan">
    <input name="resign_reason" defaultValue={a.resign_reason} placeholder="contoh: fokus kuliah" className={input} />
  </Field>
  <Field label="Kesan selama jadi admin" className="sm:col-span-2">
    <textarea name="impression" defaultValue={a.impression} rows={3} className={input} />
  </Field>
</Section>
      <Section i={1} title="Foto dan lagu tema">
        <div>
          <span className="mb-2 block text-xs font-semibold text-gray-500">Foto profil (JPG/PNG/WebP, maks 5 MB)</span>
          <FileUploader name="img" kind="image" defaultValue={a.img} />
        </div>
        <div>
          <span className="mb-2 block text-xs font-semibold text-gray-500">Lagu tema (WebM/MP3, maks 20 MB)</span>
          <FileUploader name="theme_song" kind="audio" defaultValue={a.theme_song} />
        </div>
      </Section>

      <Section i={2} title="Keahlian, divisi, bahasa">
        <Field label="Keahlian (pisah koma)" className="sm:col-span-2"><input name="skills" defaultValue={join(a.skills)} className={input} /></Field>
        <Field label="Divisi (pisah koma)"><input name="divisions" defaultValue={join(a.divisions)} className={input} /></Field>
        <Field label="Bahasa (pisah koma)"><input name="languages" defaultValue={join(a.languages)} className={input} /></Field>
        <Field label="Zona waktu"><input name="timezone" defaultValue={a.timezone} className={input} /></Field>
      </Section>

      <Section i={3} title="Platform dan kontak">
        <div className="sm:col-span-2">
          <span className="mb-2 block text-xs font-semibold text-gray-500">Ikon platform yang tampil di profil</span>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => <Chip key={p} name="platforms" value={p} checked={a.platforms?.includes(p)}>{p}</Chip>)}
          </div>
        </div>
        <Field label="WhatsApp (628xxx)"><input name="whatsapp" defaultValue={a.whatsapp} className={input} /></Field>
        <Field label="Link Discord"><input name="discord" defaultValue={a.discord} className={input} /></Field>
        <Field label="Instagram"><input name="instagram" defaultValue={a.instagram} className={input} /></Field>
        <Field label="TikTok"><input name="tiktok" defaultValue={a.tiktok} className={input} /></Field>
        <Field label="X"><input name="x" defaultValue={a.x} className={input} /></Field>
        <Field label="Facebook"><input name="facebook" defaultValue={a.facebook} className={input} /></Field>
        <Field label="Email"><input name="email" defaultValue={a.email} className={input} /></Field>
      </Section>

      <Section i={4} title="Game yang dimainkan">
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {Object.entries(GAME_ICON_MAP).map(([k, g]) => (
            <Chip key={k} name="games" value={k} checked={games.includes(k)}>{g.title}</Chip>
          ))}
        </div>
      </Section>

      <Section i={5} title="Penugasan dan media sosial">
        <div className="sm:col-span-2"><ChannelsEditor name="channels" defaultValue={a.channels ?? []} /></div>
      </Section>

      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 rounded-full bg-white/90 px-5 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="is_visible" defaultChecked={a.is_visible ?? true} /> Tampilkan di website
        </label>
        <SubmitButton>Simpan</SubmitButton>
      </div>
    </form>
  );
}