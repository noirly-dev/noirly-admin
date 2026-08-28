"use client";

import { cn } from "@/lib/utils";

export interface ProjectFeatureGraphicProps {
  title: string;
  type: string;
  description?: string;
  stack?: string[];
  className?: string;
}

function initials(title: string): string {
  const parts = title.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0]?.slice(0, 2) ?? "N").toUpperCase();
}

/** Theme-token feature graphic — mirrors portfolio component for admin preview. */
export function ProjectFeatureGraphic({
  title,
  type,
  description,
  stack = [],
  className,
}: ProjectFeatureGraphicProps) {
  const tags = stack.slice(0, 5);
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[220px] w-full flex-col overflow-hidden p-6 md:p-8",
        className,
      )}
      aria-hidden
    >
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[55%] w-[55%] rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-[15%] -right-[10%] h-[45%] w-[45%] rounded-full bg-[var(--accent-soft)] opacity-60 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="h-1 w-16 rounded-full bg-[var(--accent)]" />
        <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
          NOIRLY · FEATURED PROJECT
        </p>
        <span className="mt-4 inline-flex w-fit items-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
          {type}
        </span>
        <h3 className="font-display mt-5 max-w-[14ch] text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {title}
        </h3>
        {description ? (
          <p className="mt-4 max-w-md text-sm text-[var(--muted-foreground)]">
            {description.length > 120 ? `${description.slice(0, 119)}…` : description}
          </p>
        ) : null}
        <div className="mt-auto flex flex-col gap-4 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="hidden w-full max-w-[200px] rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--surface)] p-3 sm:block">
            <div className="h-1.5 w-16 rounded-full bg-[var(--accent)]" />
            <div className="mt-2 space-y-2">
              {[0.9, 0.55, 0.35].map((opacity) => (
                <div
                  key={opacity}
                  className="flex items-center gap-2 rounded-md border border-[var(--hairline)] bg-[var(--surface-2)] p-2"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" style={{ opacity }} />
                  <span className="h-1 flex-1 rounded-full bg-[var(--foreground)]/15" />
                </div>
              ))}
            </div>
          </div>
          {tags.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted-foreground)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p className="mt-4 text-right text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
          {slug || "project"}
        </p>
      </div>
    </div>
  );
}

export function ProjectLogoMark({ title }: { title: string }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--r-md)] border border-[var(--hairline)] bg-[var(--accent-soft)] font-display text-sm font-semibold text-[var(--accent)]">
      {initials(title)}
    </span>
  );
}
