// utils/sorters.js
import { DIVISION_ORDER } from '@/constants/division';

export const byName = (dir = 'az') => (a, b) => {
  const x = String(a.name || '').localeCompare(String(b.name || ''), 'id');
  return dir === 'az' ? x : -x;
};

// Female → Male → Unknown
export const byGenderPriority = (a, b) => {
  const rank = (g) => {
    const s = String(g || '').toLowerCase();
    if (['perempuan', 'female', 'p', 'f', 'wanita', 'cewek'].includes(s)) return 0;
    if (['laki laki', 'laki-laki', 'laki', 'male', 'm', 'l', 'pria', 'cowok'].includes(s)) return 1;
    return 2; // unknown
  };
  return rank(a.gender) - rank(b.gender);
};

export const byDivision = (aDivs = [], bDivs = []) => {
  const idx = (list) => {
    const pos = list
      .map((d) => DIVISION_ORDER.indexOf(d))
      .filter((i) => i >= 0);
    if (!pos.length) return Number.POSITIVE_INFINITY;
    return Math.min(...pos);
  };
  return idx(aDivs) - idx(bDivs);
};
