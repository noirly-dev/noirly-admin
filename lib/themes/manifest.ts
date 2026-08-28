export interface ThemePalette {
  bg: string;
  surface: string;
  text: string;
  accent: string;
  accentInk: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  light: ThemePalette;
  dark: ThemePalette;
}

export const PORTFOLIO_THEMES: ThemeDefinition[] = [
  {
    id: "blue",
    name: "Ocean Blue",
    light: { bg: "#fafaf9", surface: "#ffffff", text: "#08080a", accent: "#1d4ed8", accentInk: "#ffffff" },
    dark: { bg: "#050506", surface: "#0c0c0e", text: "#f7f7f5", accent: "#7ca6ff", accentInk: "#06121f" },
  },
  {
    id: "gold",
    name: "Warm Gold",
    light: { bg: "#faf8f2", surface: "#fffef8", text: "#222222", accent: "#8a6b00", accentInk: "#ffffff" },
    dark: { bg: "#0a0a08", surface: "#121210", text: "#f5f3ea", accent: "#ffe66d", accentInk: "#222222" },
  },
  {
    id: "forest",
    name: "Forest Green",
    light: { bg: "#f7faf8", surface: "#ffffff", text: "#0a1a12", accent: "#047857", accentInk: "#ffffff" },
    dark: { bg: "#040a07", surface: "#0b1410", text: "#ecfdf5", accent: "#34d399", accentInk: "#052e1f" },
  },
  {
    id: "coral",
    name: "Coral Ember",
    light: { bg: "#faf8f7", surface: "#ffffff", text: "#1a0a08", accent: "#c2410c", accentInk: "#ffffff" },
    dark: { bg: "#0a0605", surface: "#140c0a", text: "#fff5f2", accent: "#ff8a7a", accentInk: "#2a0a06" },
  },
  {
    id: "violet",
    name: "Soft Violet",
    light: { bg: "#f9f8fc", surface: "#ffffff", text: "#120a1f", accent: "#6d28d9", accentInk: "#ffffff" },
    dark: { bg: "#07050c", surface: "#100d18", text: "#f5f0ff", accent: "#a78bfa", accentInk: "#1a0a2e" },
  },
  {
    id: "teal",
    name: "Deep Teal",
    light: { bg: "#f6fbfb", surface: "#ffffff", text: "#082120", accent: "#0f766e", accentInk: "#ffffff" },
    dark: { bg: "#040c0b", surface: "#0a1413", text: "#ecfeff", accent: "#2dd4bf", accentInk: "#042f2e" },
  },
  {
    id: "rose",
    name: "Rose Quartz",
    light: { bg: "#faf7f8", surface: "#ffffff", text: "#1a0810", accent: "#be123c", accentInk: "#ffffff" },
    dark: { bg: "#0a0507", surface: "#140a0e", text: "#fff1f4", accent: "#fb7185", accentInk: "#2a0610" },
  },
];

export const DEFAULT_THEME_ID = "gold";

export const THEME_IDS = PORTFOLIO_THEMES.map((t) => t.id);

export function getTheme(id: string): ThemeDefinition | undefined {
  return PORTFOLIO_THEMES.find((t) => t.id === id);
}

export function isValidThemeId(id: string): boolean {
  return THEME_IDS.includes(id);
}

function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)} ${parseInt(h.slice(2, 4), 16)} ${parseInt(h.slice(4, 6), 16)}`;
}

function softAccent(hex: string, opacity: number): string {
  return `rgb(${hexToRgb(hex)} / ${opacity})`;
}

export function buildThemeCss(theme: ThemeDefinition): string {
  const { light: l, dark: d } = theme;

  return `:root {
  --bg: ${l.bg};
  --bg-deep: color-mix(in srgb, ${l.bg} 88%, ${l.text} 12%);
  --surface: ${l.surface};
  --surface-2: color-mix(in srgb, ${l.surface} 92%, ${l.text} 8%);
  --text: ${l.text};
  --text-secondary: rgb(${hexToRgb(l.text)} / 0.66);
  --text-muted: rgb(${hexToRgb(l.text)} / 0.58);
  --hairline: rgb(${hexToRgb(l.text)} / 0.1);
  --hairline-strong: rgb(${hexToRgb(l.text)} / 0.18);
  --accent: ${l.accent};
  --accent-ink: ${l.accentInk};
  --accent-soft: ${softAccent(l.accent, 0.1)};
  --elev-1: 0 1px 2px -1px rgb(${hexToRgb(l.text)} / 0.08), 0 4px 12px -6px rgb(${hexToRgb(l.text)} / 0.1);
  --elev-2: 0 2px 4px -2px rgb(${hexToRgb(l.text)} / 0.08), 0 18px 40px -20px rgb(${hexToRgb(l.text)} / 0.18);
  --background: var(--bg);
  --foreground: var(--text);
  --muted: var(--surface-2);
  --muted-foreground: var(--text-muted);
  --border: var(--hairline);
  --ring: var(--accent);
}
.dark {
  --bg: ${d.bg};
  --bg-deep: #000000;
  --surface: ${d.surface};
  --surface-2: color-mix(in srgb, ${d.surface} 88%, ${d.text} 12%);
  --text: ${d.text};
  --text-secondary: rgb(${hexToRgb(d.text)} / 0.68);
  --text-muted: rgb(${hexToRgb(d.text)} / 0.49);
  --hairline: rgb(${hexToRgb(d.text)} / 0.09);
  --hairline-strong: rgb(${hexToRgb(d.text)} / 0.18);
  --accent: ${d.accent};
  --accent-ink: ${d.accentInk};
  --accent-soft: ${softAccent(d.accent, 0.14)};
  --elev-1: 0 1px 2px -1px rgb(0 0 0 / 0.6), 0 4px 12px -6px rgb(0 0 0 / 0.5);
  --elev-2: 0 2px 4px -2px rgb(0 0 0 / 0.6), 0 18px 40px -24px rgb(0 0 0 / 0.7);
  --background: var(--bg);
  --foreground: var(--text);
  --muted: var(--surface-2);
  --muted-foreground: var(--text-muted);
  --border: var(--hairline);
  --ring: var(--accent);
}`;
}
