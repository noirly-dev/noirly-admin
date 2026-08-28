/**
 * Seed the admin database with current portfolio static content.
 * Run: npm run seed
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

const profile = {
  slug: "default",
  name: "Aneesh Pissay",
  role: "Full Stack Developer",
  badge: "FULL STACK DEVELOPER • 5+ YEARS EXPERIENCE",
  title: "Building Scalable",
  titleAccent: "Web & Mobile Experiences",
  description:
    "Full stack software design and delivery — responsive interfaces, mobile apps, APIs, databases, and production deployments.",
  heroStats: [
    { value: "5+", label: "Years experience" },
    { value: "Full Stack", label: "Web + Mobile" },
    { value: "Cloud Ready", label: "Docker + CI/CD" },
  ],
  techChips: ["React", "Next.js", "TypeScript", "React Native", "Node.js", "MongoDB", "AWS", "Docker"],
  aboutTitle: "Approach to engineering",
  aboutBio:
    "Across 5+ years in the industry, work has spanned the full stack — schema design, API contracts, component libraries, mobile builds, and release pipelines. The focus is readable code, sensible scaling, and polished product experiences.",
  aboutPoints: [
    "Clear architecture — typed interfaces, reusable components, and APIs that are straightforward to extend",
    "End-to-end ownership — comfortable moving from UI details to database queries and deployment config",
    "Production discipline — performance tuning, error handling, and CI/CD so releases stay predictable",
  ],
  heroHighlights: [
    "Web apps with React, Next.js, and TypeScript",
    "Cross-platform mobile with React Native",
    "Node.js backends, MongoDB, AWS, and Docker",
  ],
  experienceSubtitle: "Chronology of building production-grade web and mobile systems.",
  secondaryCta: "Get in touch",
  stackSubtitle: "Technologies used for full stack web and mobile engineering",
  servicesSubtitle: "Areas of technical focus",
  workSubtitle: "Selected projects that showcase an approach to design and engineering",
  ctaTitle: "Let's connect",
  ctaSubtitle:
    "Open to full stack developer opportunities and interesting technical collaborations.",
  contact: {
    email: { label: "aneeshpissay330@gmail.com", href: "mailto:aneeshpissay330@gmail.com" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aneesh-pissay-1559a31a9",
    },
    github: { label: "GitHub", href: "https://github.com/aneesh-pissay" },
  },
  profileImage: null,
};

const projects = [
  {
    title: "Noirly Flow",
    type: "Task Management",
    description:
      "Boards, workspaces, and realtime collaboration for Noirly products — signed in through Noirly Identity.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.flow.aneesh-pissay.in/",
    githubUrl: "#",
    category: "Web",
    order: 0,
    published: true,
    logo: "/projects/noirly-flow-light.png",
  },
  {
    title: "Noirly Ledger",
    type: "Finance",
    description:
      "Personal and team money tracking — budgets, expenses, pools, approvals, and reports across workspaces.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.ledger.aneesh-pissay.in/",
    githubUrl: "#",
    category: "Web",
    order: 1,
    published: true,
    logo: "/projects/noirly-ledger-light.png",
  },
  {
    title: "Noirly Pulse",
    type: "Messaging",
    description:
      "Realtime chat for workspaces — channels, DMs, threads, reactions, and presence.",
    stack: ["Next.js", "React", "TypeScript", "MongoDB", "Auth.js"],
    url: "https://noirly.pulse.aneesh-pissay.in/",
    githubUrl: "#",
    category: "Web",
    order: 2,
    published: true,
    logo: "/projects/noirly-pulse-light.png",
  },
];

const experience = [
  {
    role: "Full Stack Developer",
    company: "Cloudsight Nexus Inc.",
    period: "September 2021 – Present",
    achievements: [
      "Built scalable Full Stack web and mobile applications.",
      "Developed backend services and REST APIs.",
      "Created reusable component libraries improving development efficiency.",
      "Implemented authentication, state management and API integrations.",
      "Managed Cloud deployments and CI/CD workflows.",
      "Optimized application performance for production environments.",
    ],
    order: 0,
  },
];

const skills = [
  { label: "JavaScript", category: "Frontend & Languages", color: "#F7DF1E", iconKey: "javascript", order: 0 },
  { label: "TypeScript", category: "Frontend & Languages", color: "#3178C6", iconKey: "typescript", order: 1 },
  { label: "React", category: "Frontend & Languages", color: "#61DAFB", iconKey: "react", order: 2 },
  { label: "Next.js", category: "Frontend & Languages", color: "#000000", iconKey: "react", order: 3 },
  { label: "React Native", category: "Mobile & Backend", color: "#61DAFB", iconKey: "react", order: 4 },
  { label: "Android", category: "Mobile & Backend", color: "#3DDC84", iconKey: "android", order: 5 },
  { label: "Node.js", category: "Mobile & Backend", color: "#339933", iconKey: "nodejs", order: 6 },
  { label: "Firebase", category: "Mobile & Backend", color: "#FFCA28", iconKey: "firebase", order: 7 },
  { label: "MongoDB", category: "Mobile & Backend", color: "#47A248", iconKey: "mongodb", order: 8 },
  { label: "Azure", category: "DevOps & Cloud", color: "#0078D4", iconKey: "azure", order: 9 },
  { label: "Git", category: "DevOps & Cloud", color: "#F05032", iconKey: "git", order: 10 },
  { label: "Docker", category: "DevOps & Cloud", color: "#2496ED", iconKey: "docker", order: 11 },
  { label: "Jest", category: "Testing & QA", color: "#C21325", iconKey: "jest", order: 12 },
  { label: "Cypress", category: "Testing & QA", color: "#17202C", iconKey: "cypress", order: 13 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db;
  await db.collection("profiles").updateOne({ slug: "default" }, { $set: profile }, { upsert: true });

  await db.collection("projects").deleteMany({});
  await db.collection("projects").insertMany(projects);

  await db.collection("experiences").deleteMany({});
  await db.collection("experiences").insertMany(experience);

  await db.collection("skills").deleteMany({});
  await db.collection("skills").insertMany(skills);

  await db.collection("settings").updateOne(
    { slug: "portfolio" },
    { $set: { slug: "portfolio", themeId: "gold" } },
    { upsert: true },
  );

  console.log("Seeded profile, projects, experience, skills, and theme settings.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
