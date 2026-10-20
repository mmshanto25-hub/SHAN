export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  color: string;
  codeUrl?: string;
  liveUrl?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  date: string;
  description: string;
  initials: string;
}

export const PROJECTS: ProjectItem[] = [
  {
    title: "E-Commerce Platform",
    description: "Full-featured online store with real-time inventory, secure checkout, and admin dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    color: "from-blue-600 to-cyan-500",
    codeUrl: "#",
    liveUrl: "#"
  },
  {
    title: "AI Analytics Dashboard",
    description: "Analytics dashboard with AI-powered insights, predictive modeling, and custom reports.",
    tags: ["React", "Python", "OpenAI", "Redis"],
    color: "from-purple-600 to-pink-500",
    codeUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Enterprise Design System",
    description: "Comprehensive React component library used by 20+ teams to maintain visual consistency.",
    tags: ["React", "Storybook", "Figma", "Tailwind"],
    color: "from-emerald-500 to-teal-400",
    codeUrl: "#",
    liveUrl: "#"
  },
  {
    title: "SaaS Management Platform",
    description: "Multi-tenant B2B platform with role-based access control and automated billing.",
    tags: ["Node.js", "React", "AWS", "PostgreSQL"],
    color: "from-orange-500 to-red-500",
    codeUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Mobile Banking App",
    description: "Fintech application serving 50k+ users with instant transfers and spending analysis.",
    tags: ["React Native", "TypeScript", "Firebase"],
    color: "from-indigo-500 to-blue-500",
    codeUrl: "#",
    liveUrl: "#"
  },
  {
    title: "Interactive Portfolio Generator",
    description: "A drag-and-drop tool that generates stunning 3D portfolios without code.",
    tags: ["React", "Three.js", "GSAP"],
    color: "from-rose-500 to-orange-400",
    codeUrl: "#",
    liveUrl: "#"
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    date: "Jan 2023 – Present",
    description: "Led frontend architecture for enterprise SaaS platform serving 100k+ users. Improved performance by 40% and established comprehensive component library.",
    initials: "TC"
  },
  {
    role: "Full Stack Developer",
    company: "StartupXYZ",
    date: "Jun 2021 – Dec 2022",
    description: "Built end-to-end features for B2C marketplace. Reduced API response time by 60% with caching strategies and optimized database queries.",
    initials: "SX"
  },
  {
    role: "UI/UX Designer & Developer",
    company: "DesignStudio",
    date: "Mar 2019 – May 2021",
    description: "Designed and developed brand identities and web presences for 20+ clients. Won 3 industry design awards for innovative interactive experiences.",
    initials: "DS"
  },
  {
    role: "Junior Developer",
    company: "WebAgency",
    date: "Jan 2018 – Feb 2019",
    description: "Built and maintained client websites. First professional experience with React and modern JavaScript ecosystems.",
    initials: "WA"
  }
];
