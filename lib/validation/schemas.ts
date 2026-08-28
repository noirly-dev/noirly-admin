import { z } from "zod";

const contactEntrySchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  badge: z.string().min(1),
  title: z.string().min(1),
  titleAccent: z.string().min(1),
  description: z.string().min(1),
  heroStats: z.array(z.object({ value: z.string(), label: z.string() })),
  techChips: z.array(z.string()),
  aboutTitle: z.string().min(1),
  aboutBio: z.string().min(1),
  aboutPoints: z.array(z.string()),
  heroHighlights: z.array(z.string()),
  experienceSubtitle: z.string(),
  secondaryCta: z.string(),
  stackSubtitle: z.string(),
  servicesSubtitle: z.string(),
  workSubtitle: z.string(),
  ctaTitle: z.string(),
  ctaSubtitle: z.string(),
  contact: z.object({
    email: contactEntrySchema,
    linkedin: contactEntrySchema,
    github: contactEntrySchema,
  }),
  profileImage: z.string().nullable().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  stack: z.array(z.string()),
  url: z.string().url().or(z.string().startsWith("/")),
  githubUrl: z.string().optional(),
  category: z.string().optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
  featureGraphic: z.string().nullable().optional(),
  featureGraphicDark: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  logoDark: z.string().nullable().optional(),
});

export const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  achievements: z.array(z.string()),
  order: z.number().int().optional(),
});

export const skillSchema = z.object({
  label: z.string().min(1),
  category: z.string().min(1),
  color: z.string().min(1),
  iconKey: z.string().min(1),
  order: z.number().int().optional(),
});

export const themeSchema = z.object({
  themeId: z.enum(["blue", "gold", "forest", "coral", "violet", "teal", "rose"]),
});

export const uploadRequestSchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().optional(),
});

export const loginSchema = z.object({
  password: z.string().min(1),
});
