import { IconType } from 'react-icons';
import { 
  SiReact, 
  SiTypescript, 
  SiNextdotjs, 
  SiVuedotjs, 
  SiHtml5, 
  SiNodedotjs, 
  SiExpress, 
  SiPython, 
  SiGraphql, 
  SiPostgresql, 
  SiMongodb, 
  SiRedis, 
  SiMysql, 
  SiFigma, 
  SiFramer, 
  SiGit, 
  SiDocker, 
  SiTailwindcss, 
  SiWebpack 
} from 'react-icons/si';
import { Code, Layers, Zap, Monitor, Search, Gauge, LucideIcon } from 'lucide-react';

export interface SkillItem {
  name: string;
  percent: number;
  icon: IconType;
  color: string;
}

export interface SkillCategory {
  title: string;
  skills: SkillItem[];
}

export interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend",
    skills: [
      { name: "React", percent: 95, icon: SiReact, color: "#61DAFB" },
      { name: "TypeScript", percent: 92, icon: SiTypescript, color: "#3178C6" },
      { name: "Next.js", percent: 90, icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "Vue.js", percent: 80, icon: SiVuedotjs, color: "#4FC08D" },
      { name: "HTML/CSS", percent: 98, icon: SiHtml5, color: "#E34F26" }
    ]
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", percent: 88, icon: SiNodedotjs, color: "#339933" },
      { name: "Express", percent: 85, icon: SiExpress, color: "#FFFFFF" },
      { name: "Python", percent: 75, icon: SiPython, color: "#3776AB" },
      { name: "GraphQL", percent: 78, icon: SiGraphql, color: "#E10098" }
    ]
  },
  {
    title: "Database",
    skills: [
      { name: "PostgreSQL", percent: 82, icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", percent: 80, icon: SiMongodb, color: "#47A248" },
      { name: "Redis", percent: 70, icon: SiRedis, color: "#DC382D" },
      { name: "MySQL", percent: 75, icon: SiMysql, color: "#4479A1" }
    ]
  },
  {
    title: "UI/UX",
    skills: [
      { name: "Figma", percent: 90, icon: SiFigma, color: "#F24E1E" },
      { name: "Framer", percent: 80, icon: SiFramer, color: "#0055FF" }
    ]
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", percent: 95, icon: SiGit, color: "#F05032" },
      { name: "Docker", percent: 78, icon: SiDocker, color: "#2496ED" },
      { name: "Tailwind CSS", percent: 90, icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Webpack", percent: 80, icon: SiWebpack, color: "#8DD6F9" }
    ]
  }
];

export const SERVICES: ServiceItem[] = [
  {
    icon: Code,
    title: "Web Development",
    description: "Building scalable, performant web applications with modern tech stacks.",
  },
  {
    icon: Layers,
    title: "UI/UX Design",
    description: "Crafting intuitive interfaces that delight users and drive engagement.",
  },
  {
    icon: Zap,
    title: "API Development",
    description: "Designing robust RESTful & GraphQL APIs for seamless integrations.",
  },
  {
    icon: Monitor,
    title: "Responsive Design",
    description: "Pixel-perfect layouts that work flawlessly across all devices.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Boosting visibility and organic reach through technical SEO best practices.",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    description: "Achieving sub-second load times and 95+ Lighthouse scores.",
  }
];
