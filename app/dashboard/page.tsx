import Link from "next/link";
import { ExternalLink, FolderKanban, Palette, UserRound, Wrench, Briefcase } from "lucide-react";
import { withDb } from "@/lib/db/mongodb";
import { ExperienceModel } from "@/lib/db/models/Experience";
import { ProfileModel } from "@/lib/db/models/Profile";
import { ProjectModel } from "@/lib/db/models/Project";
import { SettingsModel } from "@/lib/db/models/Settings";
import { SkillModel } from "@/lib/db/models/Skill";
import { DEFAULT_THEME_ID, getTheme } from "@/lib/themes/manifest";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getStats() {
  try {
    return await withDb(async () => {
      const [profile, projects, experience, skills, settings] = await Promise.all([
        ProfileModel.findOne({ slug: "default" }).lean(),
        ProjectModel.countDocuments(),
        ExperienceModel.countDocuments(),
        SkillModel.countDocuments(),
        SettingsModel.findOne({ slug: "portfolio" }).lean(),
      ]);
      const theme = getTheme(settings?.themeId ?? DEFAULT_THEME_ID);
      return { profile: !!profile, projects, experience, skills, theme: theme?.name ?? "Warm Gold" };
    });
  } catch {
    return { profile: false, projects: 0, experience: 0, skills: 0, theme: "Warm Gold" };
  }
}

const cards = [
  { href: "/dashboard/profile", label: "Profile", icon: UserRound, key: "profile" as const },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, key: "projects" as const },
  { href: "/dashboard/experience", label: "Experience", icon: Briefcase, key: "experience" as const },
  { href: "/dashboard/skills", label: "Skills", icon: Wrench, key: "skills" as const },
  { href: "/dashboard/theme", label: "Theme", icon: Palette, key: "theme" as const },
];

export default async function DashboardPage() {
  const stats = await getStats();
  const portfolioUrl = process.env.PORTFOLIO_ORIGIN?.split(",")[0]?.trim();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-tight">Overview</h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted-foreground)]">
            Manage portfolio content stored in MongoDB. Images upload to Cloudflare R2 and sync to your live site via the public content API.
          </p>
        </div>
        {portfolioUrl ? (
          <Link
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--hairline)] px-4 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            View portfolio
            <ExternalLink size={14} />
          </Link>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ href, label, icon: Icon, key }) => (
          <Link key={href} href={href}>
            <Card className="relative overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Icon size={18} className="text-[var(--accent)]" />
                  <Badge>
                    {key === "profile"
                      ? stats.profile
                        ? "Configured"
                        : "Empty"
                      : key === "theme"
                        ? stats.theme
                        : stats[key]}
                  </Badge>
                </div>
                <CardTitle>{label}</CardTitle>
                <CardDescription>
                  {key === "profile"
                    ? "Hero, about, contact, and CTA copy"
                    : key === "theme"
                      ? "Portfolio color palette (light + dark)"
                      : `Manage ${label.toLowerCase()} shown on the portfolio`}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public API</CardTitle>
          <CardDescription>
            Your portfolio fetches content from this endpoint. Set{" "}
            <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 font-mono text-xs">
              PORTFOLIO_CONTENT_API_URL
            </code>{" "}
            in the portfolio project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-xl border border-[var(--hairline)] bg-[var(--surface-2)] p-4 font-mono text-xs text-[var(--text-secondary)]">
            GET /api/public/content
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
