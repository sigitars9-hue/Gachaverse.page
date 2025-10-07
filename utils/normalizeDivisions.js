// utils/normalizeDivisions.js
export function normalizeDivisions(admin) {
  // jika data sudah menyediakan divisions, pakai itu
  const current = new Set(Array.isArray(admin.divisions) ? admin.divisions : []);

  const role = String(admin.role || '').toLowerCase();
  const resp = String(admin.responsibility || '').toLowerCase();
  const skills = (Array.isArray(admin.skills) ? admin.skills : [])
    .map((s) => String(s).toLowerCase());

  const hay = [role, resp, skills.join(' ')].join(' ');

  // Babel
  if (
    /(founder|co[\s-]?founder|head\s*admin|kreator\s*expert|content\s*creator\s*expert)/.test(
      hay,
    )
  ) {
    current.add('Babel');
  }

  // Posting
  if (/(content|posting|design|creative|editor)/.test(hay)) {
    current.add('Posting');
  }

  // Pentung
  if (/pentung/.test(hay)) current.add('Pentung');

  // Translator
  if (/translator|terjemah|translate/.test(hay)) current.add('Translator');

  // Leaks
  if (/leak|leaks/.test(hay)) current.add('Leaks');

  // Owner Grup
  if (/owner\s*grup|owner\s*group/.test(hay)) current.add('Owner Grup');

  // Admin Grup
  if (/admin\s*grup|admin\s*group/.test(hay)) current.add('Admin Grup');

  // Discord (moderator)
  if (/moderator(?!.*partnership)/.test(hay)) current.add('Discord');

  // AI (Mascot)
  if (/mascot/.test(hay)) current.add('AI');

  // Gvs
  if (/gvstore|sekretaris|bendahara|worker|gvs/.test(hay)) current.add('Gvs');

  // Partnership
  if (/partnership/.test(hay)) current.add('Partnership');

  return Array.from(current);
}