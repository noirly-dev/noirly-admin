"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types/portfolio";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/projects");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    void load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold">Projects</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Featured work shown on the portfolio homepage.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus size={16} />
            New project
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--muted-foreground)]">Loading projects…</p>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-[var(--muted-foreground)]">
            No projects yet. Create your first featured project.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project._id}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{project.title}</CardTitle>
                    <Badge>{project.type}</Badge>
                    {!project.published ? (
                      <Badge className="border-amber-500/30 text-amber-400">Draft</Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                    {project.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="secondary" size="icon">
                    <Link href={`/dashboard/projects/${project._id}`}>
                      <Pencil size={14} />
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => project._id && remove(project._id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
