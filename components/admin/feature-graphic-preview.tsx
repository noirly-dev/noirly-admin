"use client";

import { Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ProjectFeatureGraphic } from "@/components/admin/project-feature-graphic";

interface FeatureGraphicPreviewProps {
  title: string;
  type: string;
  description: string;
  stack: string[];
}

export function FeatureGraphicPreview({
  title,
  type,
  description,
  stack,
}: FeatureGraphicPreviewProps) {
  return (
    <Card className="sm:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={18} className="text-[var(--accent)]" />
          Feature graphic preview
        </CardTitle>
        <CardDescription>
          Rendered live on the portfolio from project details and your active theme — no PNGs needed.
          Change the theme and this updates automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label>Live preview (matches portfolio)</Label>
        <div className="overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--bg-deep)]">
          {title.trim() && type.trim() ? (
            <ProjectFeatureGraphic
              title={title}
              type={type}
              description={description}
              stack={stack}
              className="min-h-[220px]"
            />
          ) : (
            <p className="p-8 text-sm text-[var(--muted-foreground)]">
              Add a title and type to preview the dynamic feature graphic.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
