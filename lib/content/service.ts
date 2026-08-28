import { withDb } from "@/lib/db/mongodb";
import { ExperienceModel } from "@/lib/db/models/Experience";
import { ProfileModel } from "@/lib/db/models/Profile";
import { ProjectModel } from "@/lib/db/models/Project";
import { SettingsModel } from "@/lib/db/models/Settings";
import { SkillModel } from "@/lib/db/models/Skill";
import { DEFAULT_THEME_ID, getTheme } from "@/lib/themes/manifest";
import type { PortfolioContent } from "@/lib/types/portfolio";

function serializeDoc<T extends { _id?: unknown; toObject?: () => object }>(
  doc: T,
) {
  const obj = doc.toObject?.() ?? doc;
  const { _id, __v, ...rest } = obj as Record<string, unknown>;
  return { _id: String(_id), ...rest };
}

export async function getPortfolioContent(): Promise<PortfolioContent | null> {
  return withDb(async () => {
    const [profile, projects, experience, skills, settings] = await Promise.all([
      ProfileModel.findOne({ slug: "default" }).lean(),
      ProjectModel.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean(),
      ExperienceModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      SkillModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      SettingsModel.findOne({ slug: "portfolio" }).lean(),
    ]);

    if (!profile) return null;

    const updatedAt = [
      profile.updatedAt,
      settings?.updatedAt,
      ...projects.map((p) => p.updatedAt),
      ...experience.map((e) => e.updatedAt),
      ...skills.map((s) => s.updatedAt),
    ]
      .filter(Boolean)
      .map((d) => new Date(d as Date).getTime())
      .sort((a, b) => b - a)[0];

    const themeId = settings?.themeId ?? DEFAULT_THEME_ID;
    const themeDef = getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!;

    return {
      profile: {
        name: profile.name,
        role: profile.role,
        badge: profile.badge,
        title: profile.title,
        titleAccent: profile.titleAccent,
        description: profile.description,
        heroStats: profile.heroStats ?? [],
        techChips: profile.techChips ?? [],
        aboutTitle: profile.aboutTitle,
        aboutBio: profile.aboutBio,
        aboutPoints: profile.aboutPoints ?? [],
        heroHighlights: profile.heroHighlights ?? [],
        experienceSubtitle: profile.experienceSubtitle ?? "",
        secondaryCta: profile.secondaryCta ?? "",
        stackSubtitle: profile.stackSubtitle ?? "",
        servicesSubtitle: profile.servicesSubtitle ?? "",
        workSubtitle: profile.workSubtitle ?? "",
        ctaTitle: profile.ctaTitle ?? "",
        ctaSubtitle: profile.ctaSubtitle ?? "",
        contact: profile.contact as PortfolioContent["profile"]["contact"],
        profileImage: profile.profileImage ?? null,
      },
      projects: projects.map((p) => ({
        _id: String(p._id),
        title: p.title,
        type: p.type,
        description: p.description,
        stack: p.stack ?? [],
        url: p.url,
        githubUrl: p.githubUrl,
        category: p.category,
        order: p.order ?? 0,
        published: p.published ?? true,
        featureGraphic: p.featureGraphic ?? null,
        featureGraphicDark: p.featureGraphicDark ?? null,
        logo: p.logo ?? null,
        logoDark: p.logoDark ?? null,
      })),
      experience: experience.map((e) => ({
        _id: String(e._id),
        role: e.role,
        company: e.company,
        period: e.period,
        achievements: e.achievements ?? [],
        order: e.order ?? 0,
      })),
      skills: skills.map((s) => ({
        _id: String(s._id),
        label: s.label,
        category: s.category,
        color: s.color,
        iconKey: s.iconKey,
        order: s.order ?? 0,
      })),
      theme: { id: themeDef.id, name: themeDef.name },
      updatedAt: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
    };
  });
}

export { serializeDoc };

export async function requireAdmin() {
  const { isAuthenticated } = await import("@/lib/auth/session");
  const ok = await isAuthenticated();
  if (!ok) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export function corsHeaders(origin?: string | null) {
  const allowed = process.env.PORTFOLIO_ORIGIN?.split(",").map((o) => o.trim()) ?? [];
  const match = origin && allowed.includes(origin) ? origin : allowed[0] ?? "*";
  return {
    "Access-Control-Allow-Origin": match,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  };
}
