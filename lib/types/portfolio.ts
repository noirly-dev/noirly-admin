export interface HeroStat {
  value: string;
  label: string;
}

export interface ContactEntry {
  label: string;
  href: string;
}

export interface ProfileContact {
  email: ContactEntry;
  linkedin: ContactEntry;
  github: ContactEntry;
}

export interface Profile {
  name: string;
  role: string;
  badge: string;
  title: string;
  titleAccent: string;
  description: string;
  heroStats: HeroStat[];
  techChips: string[];
  aboutTitle: string;
  aboutBio: string;
  aboutPoints: string[];
  heroHighlights: string[];
  experienceSubtitle: string;
  secondaryCta: string;
  stackSubtitle: string;
  servicesSubtitle: string;
  workSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  contact: ProfileContact;
  profileImage?: string | null;
}

export interface Project {
  _id?: string;
  title: string;
  type: string;
  description: string;
  stack: string[];
  url: string;
  githubUrl?: string;
  category?: string;
  order: number;
  published: boolean;
  featureGraphic: string | null;
  featureGraphicDark: string | null;
  logo: string | null;
  logoDark: string | null;
}

export interface WorkExperience {
  _id?: string;
  role: string;
  company: string;
  period: string;
  achievements: string[];
  order: number;
}

export interface Skill {
  _id?: string;
  label: string;
  category: string;
  color: string;
  iconKey: string;
  order: number;
}

export interface PortfolioTheme {
  id: string;
  name: string;
}

export interface PortfolioContent {
  profile: Profile;
  projects: Project[];
  experience: WorkExperience[];
  skills: Skill[];
  theme: PortfolioTheme;
  updatedAt: string;
}
