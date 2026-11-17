export const ROLE_ORDER = ["Founder","Co-founder","Head Admin","Owner Gvstore","Sekretaris","Best Creator","Moderator","Owner Group","Co-owner Group","Mascot","Admin"];
export const GAME_ICON_MAP = { /* salin isi aslinya */ };
const GAME_ALIAS = {
  genshin: "gi", r1999: "reverse", reverse1999: "reverse", "1999": "reverse",
  "fate-go": "fgo", hi3: "hi", gfl2: "gfl", "aether-gazer": "ag", "limbus-company": "limbus",
};
export const cleanGames = (list = []) => [
  ...new Set(
    list.map((g) => String(g).toLowerCase().trim()).map((g) => GAME_ALIAS[g] ?? g).filter((g) => GAME_ICON_MAP[g])
  ),
];