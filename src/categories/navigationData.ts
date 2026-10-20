import { 
  Home, 
  User, 
  Sparkles, 
  Wrench, 
  Briefcase, 
  FolderGit2, 
  MessageSquareQuote, 
  Mail,
  LucideIcon
} from 'lucide-react';

export interface NavSubItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

export interface NavCategory {
  id: string;
  label: string;
  href: string;
  description: string;
  subItems: NavSubItem[];
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '#home',
    description: 'Personal introduction, background & career highlights',
    subItems: [
      {
        label: 'Home',
        href: '#home',
        description: 'Hero intro, bio & highlights',
        icon: Home
      },
      {
        label: 'About',
        href: '#about',
        description: 'Background story, timeline & stats',
        icon: User
      }
    ]
  },
  {
    id: 'expertise',
    label: 'Expertise',
    href: '#skills',
    description: 'Core technical proficiencies & development services',
    subItems: [
      {
        label: 'Skills',
        href: '#skills',
        description: 'Technical stack & proficiency levels',
        icon: Sparkles
      },
      {
        label: 'Services',
        href: '#services',
        description: 'Web dev, UI/UX, API & optimization',
        icon: Wrench
      }
    ]
  },
  {
    id: 'work',
    label: 'Work',
    href: '#projects',
    description: 'Featured project showcase & employment history',
    subItems: [
      {
        label: 'Projects',
        href: '#projects',
        description: 'Featured applications & live demos',
        icon: FolderGit2
      },
      {
        label: 'Experience',
        href: '#experience',
        description: 'Professional career roadmap',
        icon: Briefcase
      }
    ]
  },
  {
    id: 'connect',
    label: 'Connect',
    href: '#contact',
    description: 'Client reviews, contact channels & inquiry form',
    subItems: [
      {
        label: 'Testimonials',
        href: '#testimonials',
        description: 'Client feedback & recommendations',
        icon: MessageSquareQuote
      },
      {
        label: 'Contact',
        href: '#contact',
        description: 'Get in touch & project inquiries',
        icon: Mail
      }
    ]
  }
];

// Flat list of all 8 original navigation sections
export const ALL_NAV_SECTIONS = NAV_CATEGORIES.flatMap(cat => cat.subItems);
