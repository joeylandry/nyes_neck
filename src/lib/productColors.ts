const colorSwatches: Record<string, string> = {
  berry: "#8a3650",
  "black heather": "#2f3033",
  "black melange": "#38393c",
  blossom: "#e7b2b8",
  brick: "#9f4d42",
  "bubble pink": "#ee9eb8",
  "chalky mint": "#a8cdbd",
  chambray: "#83a2b8",
  "charcoal heather": "#525559",
  "collegiate navy melange": "#36475d",
  "collegiate royal melange": "#536f9a",
  "collegiate royal": "#2e5c9a",
  crunchberry: "#b84d70",
  denim: "#586f84",
  fossil: "#c7bfad",
  granite: "#696b6d",
  "grey one heather": "#b6b5b2",
  "grey three": "#85888b",
  grill: "#51545a",
  hydrangea: "#87a4c3",
  "island reef": "#70b7af",
  moss: "#687258",
  "navy/khaki": "#46505a",
  sage: "#98a991",
  sandstone: "#c3ad8c",
  yam: "#c66a3b",
  "true navy": "#1d2e48",
  "collegiate navy": "#243853",
  "french navy": "#1d304c",
  "coastal navy": "#183247",
  "navy blue": "#182b49",
  navy: "#182b49",
  "blue spruce": "#4e7570",
  "blue jean": "#5f7e98",
  "atlantic blue": "#52799d",
  "royal blue": "#2455a4",
  "light blue": "#b9d7e8",
  "flo blue": "#6eb7c9",
  "sea glass": "#9bcfc4",
  seafoam: "#9bcfc4",
  "light green": "#a1b98b",
  "forest green": "#355d42",
  "military green": "#62674c",
  pepper: "#5d5b57",
  graphite: "#55575a",
  charcoal: "#414448",
  "dark heather": "#55565a",
  "heather grey": "#a5a4a0",
  "cool heather grey": "#a5a4a0",
  "sport grey": "#b4b4b2",
  "sport gray": "#b4b4b2",
  grey: "#787878",
  gray: "#787878",
  black: "#191919",
  white: "#ffffff",
  ivory: "#f3f0dc",
  "warm white": "#f4f1e7",
  cream: "#f5edda",
  natural: "#d5c6a6",
  "natural canvas": "#d5c6a6",
  sand: "#d8c7a8",
  "weathered sand": "#c6b28e",
  dune: "#c9b58d",
  espresso: "#4a362f",
  crimson: "#c8102e",
  maroon: "#651d32",
  red: "#b42b2b",
  watermelon: "#e97d85",
  peachy: "#ecad96",
  butter: "#eedb87",
  orchid: "#b789b5",
  violet: "#70618b",
};

function usableColorCode(value?: string) {
  const code = value?.trim();
  return code && (/^#[\da-f]{3,8}$/i.test(code) || /^rgba?\([\d\s,.%]+\)$/i.test(code)) ? code : undefined;
}

/** Returns a safe, garment-oriented swatch color, with the supplier's hex value taking precedence. */
export function getProductColor(color: string, colorCode?: string) {
  const suppliedCode = usableColorCode(colorCode);
  if (suppliedCode) return suppliedCode;

  const normalized = color.toLowerCase().trim().replace(/\s+/g, " ");
  if (colorSwatches[normalized]) return colorSwatches[normalized];
  const partial = Object.entries(colorSwatches).find(([name]) => normalized.includes(name));
  return partial?.[1] ?? "#a8a8a3";
}
