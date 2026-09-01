"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Palette } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noirly-dev/ui";
import { SaveBar } from "@/components/admin/image-upload";
import { cn } from "@/lib/utils";

interface ThemeOption {
  id: string;
  name: string;
  light: { bg: string; surface: string; text: string; accent: string; accentInk: string };
  dark: { bg: string; surface: string; text: string; accent: string; accentInk: string };
}

function ThemePreview({
  theme,
  selected,
  onSelect,
}: {
  theme: ThemeOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full overflow-hidden rounded-[var(--r-lg)] border text-left transition-all duration-200",
        selected
          ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/30"
          : "border-[var(--hairline)] hover:border-[var(--hairline-strong)] hover:-translate-y-0.5",
      )}
    >
      <div className="grid grid-cols-2">
        {/* Light preview */}
        <div className="p-4" style={{ background: theme.light.bg, color: theme.light.text }}>
          <p className="text-[10px] uppercase tracking-[0.14em] opacity-60">Light</p>
          <p className="mt-2 text-sm font-semibold">{theme.name}</p>
          <div className="mt-3 flex gap-2">
            <span
              className="h-6 w-6 rounded-md border border-black/10"
              style={{ background: theme.light.surface }}
            />
            <span
              className="inline-flex h-6 items-center rounded-md px-2 text-[10px] font-medium"
              style={{ background: theme.light.accent, color: theme.light.accentInk }}
            >
              Accent
            </span>
          </div>
        </div>

        {/* Dark preview */}
        <div className="p-4" style={{ background: theme.dark.bg, color: theme.dark.text }}>
          <p className="text-[10px] uppercase tracking-[0.14em] opacity-60">Dark</p>
          <p className="mt-2 text-sm font-semibold">{theme.name}</p>
          <div className="mt-3 flex gap-2">
            <span
              className="h-6 w-6 rounded-md border border-white/10"
              style={{ background: theme.dark.surface }}
            />
            <span
              className="inline-flex h-6 items-center rounded-md px-2 text-[10px] font-medium"
              style={{ background: theme.dark.accent, color: theme.dark.accentInk }}
            >
              Accent
            </span>
          </div>
        </div>
      </div>

      {selected ? (
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
          <Check size={14} />
        </span>
      ) : null}
    </button>
  );
}

export default function ThemePage() {
  const router = useRouter();
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [selected, setSelected] = useState("gold");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((r) => r.json())
      .then((data) => {
        setThemes(data.themes ?? []);
        if (data.themeId) setSelected(data.themeId);
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId: selected }),
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      setMessage(`Theme updated to ${data.themeName}`);
      router.refresh();
    } else {
      setMessage("Failed to save theme");
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading themes…</p>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Palette size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Theme</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Choose the color palette for the portfolio and this admin dashboard. All themes are WCAG AA verified.
            </p>
          </div>
        </div>
      </div>

      {message ? <p className="text-sm text-[var(--accent)]">{message}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Color palettes</CardTitle>
          <CardDescription>
            Changes apply to the portfolio and admin UI on save. Light and dark mode both use the selected palette.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {themes.map((theme) => (
            <ThemePreview
              key={theme.id}
              theme={theme}
              selected={selected === theme.id}
              onSelect={() => setSelected(theme.id)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted-foreground)]">
            Active theme:{" "}
            <span className="font-medium text-[var(--foreground)]">
              {themes.find((t) => t.id === selected)?.name ?? selected}
            </span>
          </p>
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => setSelected("gold")}>
            Reset to Warm Gold
          </Button>
        </CardContent>
      </Card>

      <SaveBar saving={saving} onSave={save} label="Apply theme" />
    </div>
  );
}
