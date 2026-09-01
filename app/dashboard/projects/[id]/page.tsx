"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Label, Switch, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@noirly-dev/ui";
import { ImageUploadField, SaveBar } from "@/components/admin/image-upload";
import { FeatureGraphicPreview } from "@/components/admin/feature-graphic-preview";
import type { Project } from "@/lib/types/portfolio";

const empty: Omit<Project, "_id"> = {
  title: "",
  type: "",
  description: "",
  stack: [],
  url: "",
  githubUrl: "#",
  category: "Web",
  order: 0,
  published: true,
  featureGraphic: null,
  featureGraphicDark: null,
  logo: null,
  logoDark: null,
};

export default function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const isNew = id === "new";
  const [project, setProject] = useState<Omit<Project, "_id">>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void params.then(({ id: routeId }) => {
      setId(routeId);
      if (routeId === "new") {
        setLoading(false);
        return;
      }
      fetch(`/api/admin/projects/${routeId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.title) {
            const { _id, ...rest } = data;
            setProject(rest);
          }
        })
        .finally(() => setLoading(false));
    });
  }, [params]);

  async function save() {
    setSaving(true);
    const res = await fetch(
      isNew ? "/api/admin/projects" : `/api/admin/projects/${id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      },
    );
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard/projects/${data._id ?? id}`);
      router.refresh();
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted-foreground)]">Loading project…</p>;
  }

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title={isNew ? "New project" : "Edit project"}
        action={
          <div className="flex items-center gap-3">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={project.published}
              onCheckedChange={(published) => setProject({ ...project, published })}
            />
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Title</Label>
            <Input value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Input value={project.type} onChange={(e) => setProject({ ...project, type: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={project.category} onChange={(e) => setProject({ ...project, category: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} rows={4} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Stack (one per line)</Label>
            <Textarea
              value={project.stack.join("\n")}
              onChange={(e) =>
                setProject({
                  ...project,
                  stack: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                })
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Live URL</Label>
            <Input value={project.url} onChange={(e) => setProject({ ...project, url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL</Label>
            <Input value={project.githubUrl} onChange={(e) => setProject({ ...project, githubUrl: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <FeatureGraphicPreview
            title={project.title}
            type={project.type}
            description={project.description}
            stack={project.stack}
          />
          <div className="space-y-2 sm:col-span-2">
            <p className="text-sm text-[var(--muted-foreground)]">
              Feature graphics and project icons are generated on the portfolio from your theme tokens.
              Upload a logo only if you need a custom brand mark instead of the themed initials badge.
            </p>
          </div>
          <ImageUploadField
            label="Custom logo (optional override)"
            value={project.logo}
            onChange={(v) => setProject({ ...project, logo: v, logoDark: v })}
            folder="portfolio/logos"
          />
        </CardContent>
      </Card>

      <SaveBar saving={saving} onSave={save} label={isNew ? "Create project" : "Save project"} />
    </div>
  );
}
