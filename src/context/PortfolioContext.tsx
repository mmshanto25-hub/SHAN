import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchPublicPortfolio, type PortfolioData } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { OVERVIEW_DATA } from '@/categories/overview/overviewData';
import { SKILL_CATEGORIES, SERVICES } from '@/categories/expertise/expertiseData';
import { PROJECTS, EXPERIENCE } from '@/categories/work/workData';
import { TESTIMONIALS, CONTACT_INFO, CONNECT_HEADING } from '@/categories/connect/connectData';

// Fallback initial state ensuring seamless instant render without layout shift
export const FALLBACK_DATA: PortfolioData = {
  settings: {
    id: 'main',
    name: OVERVIEW_DATA.name,
    firstName: OVERVIEW_DATA.firstName,
    lastName: OVERVIEW_DATA.lastName,
    bioHeadline: OVERVIEW_DATA.bioHeadline,
    tagline: OVERVIEW_DATA.tagline,
    statusText: OVERVIEW_DATA.status,
    typingRoles: OVERVIEW_DATA.typingRoles,
    hireMeLabel: 'Hire Me',
    hireMeWhatsappNumber: '019258787852',
    downloadCvLabel: 'Download CV',
    heroAvatarUrl: '/profile.jpg',
    aboutHeading: 'About Me',
    aboutDescription1: OVERVIEW_DATA.aboutDescription1,
    aboutDescription2: OVERVIEW_DATA.aboutDescription2,
    aboutDescription3: OVERVIEW_DATA.aboutDescription3,
    aboutAvatarUrl: '/profile1.jpg',
    resumeFileName: OVERVIEW_DATA.resumeFileName,
    resumeFileUrl: OVERVIEW_DATA.resumeUrl,
    footerBrandName: OVERVIEW_DATA.name,
    footerTagline: 'Crafting premium digital experiences through elegant code and meticulous design.',
    footerCopyrightText: 'All rights reserved.',
    contactHeadingTitle: CONNECT_HEADING.title,
    contactHeadingSubtitle: CONNECT_HEADING.subtitle,
    contactSocialsHeading: CONNECT_HEADING.socialsHeading,
    contactAvailabilityText: CONNECT_HEADING.availabilityText,
    skillsHeading: 'Technical Expertise',
    servicesHeading: 'Services',
    projectsHeading: 'Featured Work',
    experienceHeading: 'Work Experience',
    testimonialsHeading: 'What Clients Say',
    updatedAt: new Date().toISOString(),
  },
  stats: OVERVIEW_DATA.stats.map((s, idx) => ({
    id: `stat-${idx}`,
    value: s.value,
    suffix: s.suffix,
    label: s.label,
    displayOrder: idx,
    isVisible: true
  })),
  aboutTimeline: OVERVIEW_DATA.timeline.map((t, idx) => ({
    id: `atl-${idx}`,
    year: t.year,
    role: t.role,
    company: t.company,
    displayOrder: idx,
    isVisible: true
  })),
  experiences: EXPERIENCE.map((e, idx) => ({
    id: `exp-${idx}`,
    role: e.role,
    company: e.company,
    date: e.date,
    description: e.description,
    initials: e.initials,
    displayOrder: idx,
    isVisible: true
  })),
  skillCategories: SKILL_CATEGORIES.map((cat, idx) => ({
    id: `cat-${idx}`,
    title: cat.title,
    displayOrder: idx,
    isVisible: true,
    skills: cat.skills.map((s, sIdx) => ({
      id: `skill-${idx}-${sIdx}`,
      categoryId: `cat-${idx}`,
      name: s.name,
      percent: s.percent,
      icon: s.name,
      color: s.color,
      displayOrder: sIdx,
      isVisible: true
    }))
  })),
  skills: [],
  services: SERVICES.map((s, idx) => ({
    id: `svc-${idx}`,
    title: s.title,
    description: s.description,
    icon: s.title,
    displayOrder: idx,
    isVisible: true
  })),
  projects: PROJECTS.map((p, idx) => ({
    id: `proj-${idx}`,
    title: p.title,
    description: p.description,
    tags: p.tags,
    color: p.color,
    imageUrl: null,
    codeUrl: p.codeUrl || '#',
    liveUrl: p.liveUrl || '#',
    displayOrder: idx,
    isVisible: true
  })),
  testimonials: TESTIMONIALS.map((t, idx) => ({
    id: `test-${idx}`,
    name: t.name,
    position: t.position,
    text: t.text,
    initials: t.initials,
    color: t.color,
    displayOrder: idx,
    isVisible: true
  })),
  socialLinks: [
    { id: 'soc-1', platform: 'github', label: 'GitHub', url: 'https://github.com/mmshanto25-hub', icon: 'Github', displayOrder: 0, isVisible: true },
    { id: 'soc-2', platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com/in/mmshanto22', icon: 'Linkedin', displayOrder: 1, isVisible: true },
    { id: 'soc-3', platform: 'twitter', label: 'Twitter / X', url: 'https://x.com', icon: 'Twitter', displayOrder: 2, isVisible: true },
    { id: 'soc-4', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com', icon: 'Instagram', displayOrder: 3, isVisible: true }
  ],
  contactInfo: CONTACT_INFO.map((c, idx) => ({
    id: `cnt-${idx}`,
    type: c.type,
    title: c.title,
    value: c.value,
    href: c.href,
    displayOrder: idx,
    isVisible: true
  })),
  resume: {
    id: 'current',
    fileName: OVERVIEW_DATA.resumeFileName,
    originalName: OVERVIEW_DATA.resumeFileName,
    fileUrl: OVERVIEW_DATA.resumeUrl,
    fileSize: 1024 * 1024,
    mimeType: 'application/pdf',
    downloadLabel: 'Download CV',
    uploadedAt: new Date().toISOString()
  },
  sectionVisibility: {
    hero: true,
    resume: true,
    about: true,
    skills: true,
    services: true,
    projects: true,
    experience: true,
    testimonials: true,
    contact: true,
    footer: true,
  },
};

interface PortfolioContextType {
  data: PortfolioData;
  loading: boolean;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType>({
  data: FALLBACK_DATA,
  loading: false,
  refresh: async () => undefined,
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      const remote = await fetchPublicPortfolio();
      if (!remote.settings) return;
      setData({
        ...FALLBACK_DATA,
        ...remote,
        settings: { ...FALLBACK_DATA.settings, ...remote.settings },
        sectionVisibility: { ...FALLBACK_DATA.sectionVisibility, ...remote.sectionVisibility },
      });
    } catch (error) {
      console.error('Could not load portfolio data from Supabase.', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const listener = () => void refresh();
    window.addEventListener('portfolio-content-changed', listener);

    const channel = supabase?.channel('portfolio-live-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, listener)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_settings' }, listener)
      .subscribe();

    return () => {
      window.removeEventListener('portfolio-content-changed', listener);
      if (channel) void supabase?.removeChannel(channel);
    };
  }, [refresh]);

  return (
    <PortfolioContext.Provider value={{ data, loading, refresh }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export function usePortfolio(): PortfolioContextType {
  return useContext(PortfolioContext);
}
