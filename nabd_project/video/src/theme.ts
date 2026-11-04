// Nabd style bible (CLAUDE.md "المرحلة 2" + brand/style_frame_reference.html)
export const C = {
  bg: "#EFE6D6",
  card: "#F8F2E6",
  cardShadow: "#D9CBB2",
  ink: "#2B2A28",
  key: "#D9622B",
  warn: "#C23B32",
  iconBg: "#CFE0EE",
  skin: "#E7B79C",
  bad: "#9CC48A", // harmful bacteria (green)
  badDark: "#7FAE6B",
  virus: "#B7A3D6",
  virusDark: "#8E78B8",
  good: "#9DC9E8", // beneficial bacteria (blue)
  shield: "#8A8F98",
  brand: "#FE5D54",
  source: "#7A746B",
  white: "#FFFDF8",
  capsule: "#F7F1E8",
  paper: "#FFFCF4",
  agar: "#F1E3BC",
  glass: "#E4EEF3",
};
export const STROKE = 6; // ~6px on 1080 wide, round caps
export const FONT = "IBM Plex Sans Arabic";
export const W = 1080;
export const H = 1920;
// safe area: no text in the bottom 20 % or the right-most 12 %
export const SAFE = { bottom: H * 0.8, right: W * 0.88 };
