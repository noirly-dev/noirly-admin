"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@noirly-dev/ui";
import { SaveBar } from "@/components/admin/image-upload";
import type { Skill } from "@/lib/types/portfolio";

const ICON_OPTIONS = [
  "react", "typescript", "javascript", "nodejs", "mongodb", "docker",
  "git", "firebase", "android", "azure", "jest", "cypress", "github-actions",
];

type SkillItem = Skill & { _id?: string };

export default function SkillsPage() {
  const [items, setItems] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/skills");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function updateItem(index: number, patch: Partial<SkillItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function saveAll() {
    setSaving(true);
    for (const item of items) {
      const payload = {
        label: item.label,
        category: item.category,
        color: item.color,
        iconKey: item.iconKey,
        order: item.order,
      };
      if (item._id) {
        await fetch(`/api/admin/skills/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    }
    setSaving(false);
    void load();
  }

  async function remove(id?: string, index?: number) {
    if (id) {
      await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
      void load();
      return;
    }
    if (index !== undefined) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Skills</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Technology stack cards with icon keys mapped in the portfolio.
          </p>
        </div>
        <Button
          onClick={() =>
            setItems((prev) => [
              ...prev,
              {
                label: "",
                category: "Frontend & Languages",
                color: "#61DAFB",
                iconKey: "react",
                order: prev.length,
              },
            ])
          }
        >
          <Plus size={16} />
          Add skill
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading skills…</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item._id ?? `new-${index}`}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>{item.label || `Skill ${index + 1}`}</CardTitle>
                <Button variant="destructive" size="icon" onClick={() => remove(item._id, index)}>
                  <Trash2 size={14} />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input value={item.label} onChange={(e) => updateItem(index, { label: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={item.category} onChange={(e) => updateItem(index, { category: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input value={item.color} onChange={(e) => updateItem(index, { color: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Icon key</Label>
                  <select
                    value={item.iconKey}
                    onChange={(e) => updateItem(index, { iconKey: e.target.value })}
                    className="flex h-10 w-full rounded-xl border border-[var(--hairline)] bg-[var(--surface)] px-3 text-base sm:text-sm"
                  >
                    {ICON_OPTIONS.map((key) => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SaveBar saving={saving} onSave={saveAll} />
    </div>
  );
}
