"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Label, Card, CardContent, CardHeader, CardTitle } from "@noirly-dev/ui";
import { ImageUploadField, SaveBar } from "@/components/admin/image-upload";
import type { Profile } from "@/lib/types/portfolio";

function StringListEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea
        value={values.join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        rows={4}
      />
      <p className="text-xs text-[var(--muted-foreground)]">One item per line</p>
    </div>
  );
}

function HeroStatsEditor({
  values,
  onChange,
}: {
  values: Profile["heroStats"];
  onChange: (values: Profile["heroStats"]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Hero stats</Label>
      {values.map((stat, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-2">
          <Input
            value={stat.value}
            placeholder="Value"
            onChange={(e) => {
              const next = [...values];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
          />
          <Input
            value={stat.label}
            placeholder="Label"
            onChange={(e) => {
              const next = [...values];
              next[i] = { ...next[i], label: e.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onChange([...values, { value: "", label: "" }])}
      >
        Add stat
      </Button>
    </div>
  );
}

const emptyProfile: Profile = {
  name: "",
  role: "",
  badge: "",
  title: "",
  titleAccent: "",
  description: "",
  heroStats: [],
  techChips: [],
  aboutTitle: "",
  aboutBio: "",
  aboutPoints: [],
  heroHighlights: [],
  experienceSubtitle: "",
  secondaryCta: "",
  stackSubtitle: "",
  servicesSubtitle: "",
  workSubtitle: "",
  ctaTitle: "",
  ctaSubtitle: "",
  contact: {
    email: { label: "", href: "" },
    linkedin: { label: "", href: "" },
    github: { label: "", href: "" },
  },
  profileImage: null,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.name) setProfile({ ...emptyProfile, ...data });
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setMessage(res.ok ? "Profile saved" : "Failed to save profile");
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading profile…</p>;
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Profile</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Hero copy, about section, contact links, and page subtitles.
        </p>
      </div>

      {message ? (
        <p className="text-sm text-[var(--accent)]">{message}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="badge">Badge</Label>
            <Input id="badge" value={profile.badge} onChange={(e) => setProfile({ ...profile, badge: e.target.value })} />
          </div>
          <ImageUploadField
            label="Profile image"
            value={profile.profileImage ?? null}
            onChange={(url) => setProfile({ ...profile, profileImage: url })}
            folder="profile"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Title accent</Label>
              <Input value={profile.titleAccent} onChange={(e) => setProfile({ ...profile, titleAccent: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} rows={3} />
          </div>
          <HeroStatsEditor values={profile.heroStats} onChange={(heroStats) => setProfile({ ...profile, heroStats })} />
          <StringListEditor label="Tech chips" values={profile.techChips} onChange={(techChips) => setProfile({ ...profile, techChips })} />
          <StringListEditor label="Hero highlights" values={profile.heroHighlights} onChange={(heroHighlights) => setProfile({ ...profile, heroHighlights })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About & sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>About title</Label>
            <Input value={profile.aboutTitle} onChange={(e) => setProfile({ ...profile, aboutTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>About bio</Label>
            <Textarea value={profile.aboutBio} onChange={(e) => setProfile({ ...profile, aboutBio: e.target.value })} rows={4} />
          </div>
          <StringListEditor label="About points" values={profile.aboutPoints} onChange={(aboutPoints) => setProfile({ ...profile, aboutPoints })} />
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ["experienceSubtitle", "Experience subtitle"],
              ["stackSubtitle", "Stack subtitle"],
              ["workSubtitle", "Work subtitle"],
              ["ctaTitle", "CTA title"],
              ["ctaSubtitle", "CTA subtitle"],
              ["secondaryCta", "Secondary CTA"],
            ] as const).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label>{label}</Label>
                <Input
                  value={profile[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(["email", "linkedin", "github"] as const).map((key) => (
            <div key={key} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{key} label</Label>
                <Input
                  value={profile.contact[key].label}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        [key]: { ...profile.contact[key], label: e.target.value },
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>{key} href</Label>
                <Input
                  value={profile.contact[key].href}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        [key]: { ...profile.contact[key], href: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <SaveBar saving={saving} onSave={save} />
    </div>
  );
}
