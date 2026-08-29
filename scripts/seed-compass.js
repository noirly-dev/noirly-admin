/**
 * MongoDB Compass / mongosh seed script.
 *
 * 1. Open Compass → Connect to your cluster → Mongosh tab
 * 2. Paste this entire file and press Run
 *
 * Or from terminal:
 *   mongosh "YOUR_MONGODB_URI" --file scripts/seed-compass.js
 */
const dbName = "noirly-admin";
const db = db.getSiblingDB(dbName);

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
  techChips: [
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Node.js",
    "MongoDB",
    "AWS",
    "Docker",
  ],
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
  experienceSubtitle:
    "Chronology of building production-grade web and mobile systems.",
  secondaryCta: "Get in touch",
  stackSubtitle: "Technologies used for full stack web and mobile engineering",
  servicesSubtitle: "Areas of technical focus",
  workSubtitle:
    "Selected projects that showcase an approach to design and engineering",
  ctaTitle: "Let's connect",
  ctaSubtitle:
    "Open to full stack developer opportunities and interesting technical collaborations.",
  contact: {
    email: {
      label: "aneeshpissay330@gmail.com",
      href: "mailto:aneeshpissay330@gmail.com",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aneesh-pissay-1559a31a9",
    },
    github: { label: "GitHub", href: "https://github.com/aneesh-pissay" },
  },
  profileImage: null,
  createdAt: new Date(),
  updatedAt: new Date(),
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
    featureGraphic: null,
    featureGraphicDark: null,
    logo: "/projects/noirly-flow-light.png",
    logoDark: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    featureGraphic: null,
    featureGraphicDark: null,
    logo: "/projects/noirly-ledger-light.png",
    logoDark: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    featureGraphic: null,
    featureGraphicDark: null,
    logo: "/projects/noirly-pulse-light.png",
    logoDark: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const skills = [
  { label: "JavaScript", category: "Frontend & Languages", color: "#F7DF1E", iconKey: "javascript", order: 0, createdAt: new Date(), updatedAt: new Date() },
  { label: "TypeScript", category: "Frontend & Languages", color: "#3178C6", iconKey: "typescript", order: 1, createdAt: new Date(), updatedAt: new Date() },
  { label: "React", category: "Frontend & Languages", color: "#61DAFB", iconKey: "react", order: 2, createdAt: new Date(), updatedAt: new Date() },
  { label: "Next.js", category: "Frontend & Languages", color: "#000000", iconKey: "react", order: 3, createdAt: new Date(), updatedAt: new Date() },
  { label: "React Native", category: "Mobile & Backend", color: "#61DAFB", iconKey: "react", order: 4, createdAt: new Date(), updatedAt: new Date() },
  { label: "Android", category: "Mobile & Backend", color: "#3DDC84", iconKey: "android", order: 5, createdAt: new Date(), updatedAt: new Date() },
  { label: "Node.js", category: "Mobile & Backend", color: "#339933", iconKey: "nodejs", order: 6, createdAt: new Date(), updatedAt: new Date() },
  { label: "Firebase", category: "Mobile & Backend", color: "#FFCA28", iconKey: "firebase", order: 7, createdAt: new Date(), updatedAt: new Date() },
  { label: "MongoDB", category: "Mobile & Backend", color: "#47A248", iconKey: "mongodb", order: 8, createdAt: new Date(), updatedAt: new Date() },
  { label: "Azure", category: "DevOps & Cloud", color: "#0078D4", iconKey: "azure", order: 9, createdAt: new Date(), updatedAt: new Date() },
  { label: "Git", category: "DevOps & Cloud", color: "#F05032", iconKey: "git", order: 10, createdAt: new Date(), updatedAt: new Date() },
  { label: "Docker", category: "DevOps & Cloud", color: "#2496ED", iconKey: "docker", order: 11, createdAt: new Date(), updatedAt: new Date() },
  { label: "Jest", category: "Testing & QA", color: "#C21325", iconKey: "jest", order: 12, createdAt: new Date(), updatedAt: new Date() },
  { label: "Cypress", category: "Testing & QA", color: "#17202C", iconKey: "cypress", order: 13, createdAt: new Date(), updatedAt: new Date() },
];

db.profiles.updateOne({ slug: "default" }, { $set: profile }, { upsert: true });

db.projects.deleteMany({});
db.projects.insertMany(projects);

db.experiences.deleteMany({});
db.experiences.insertMany(experience);

db.skills.deleteMany({});
db.skills.insertMany(skills);

db.settings.updateOne(
  { slug: "portfolio" },
  {
    $set: {
      slug: "portfolio",
      themeId: "gold",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  { upsert: true },
);

print(`Seeded ${dbName}: profile, ${projects.length} projects, ${experience.length} experience, ${skills.length} skills, theme settings.`);
