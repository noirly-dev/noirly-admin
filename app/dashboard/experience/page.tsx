"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaveBar } from "@/components/admin/image-upload";
import type { WorkExperience } from "@/lib/types/portfolio";

type ExperienceItem = WorkExperience & { _id?: string };

export default function ExperiencePage() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/experience");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function updateItem(index: number, patch: Partial<ExperienceItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function saveAll() {
    setSaving(true);
    for (const item of items) {
      const payload = {
        role: item.role,
        company: item.company,
        period: item.period,
        achievements: item.achievements,
        order: item.order,
      };
      if (item._id) {
        await fetch(`/api/admin/experience/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        item._id = created._id;
      }
    }
    setSaving(false);
    void load();
  }

  async function remove(id?: string, index?: number) {
    if (id) {
      await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
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
          <h2 className="font-display text-3xl font-semibold">Experience</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Work history and achievements shown on the portfolio.
          </p>
        </div>
        <Button
          onClick={() =>
            setItems((prev) => [
              ...prev,
              { role: "", company: "", period: "", achievements: [], order: prev.length },
            ])
          }
        >
          <Plus size={16} />
          Add role
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading experience…</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <Card key={item._id ?? `new-${index}`}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>Role {index + 1}</CardTitle>
                <Button variant="destructive" size="icon" onClick={() => remove(item._id, index)}>
                  <Trash2 size={14} />
                </Button>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={item.role} onChange={(e) => updateItem(index, { role: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={item.company} onChange={(e) => updateItem(index, { company: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Period</Label>
                  <Input value={item.period} onChange={(e) => updateItem(index, { period: e.target.value })} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Achievements (one per line)</Label>
                  <Textarea
                    value={item.achievements.join("\n")}
                    onChange={(e) =>
                      updateItem(index, {
                        achievements: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    rows={5}
                  />
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
