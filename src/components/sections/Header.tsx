import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { 
  Menu, 
  X, 
  MoreVertical, 
  FileDown, 
  FileText,
  Send, 
  ArrowUp,
  Shield,
  Home,
  Tv,
  Briefcase,
  Camera,
  Sparkles
} from 'lucide-react';
import { NAV_CATEGORIES } from '@/categories/navigationData';
import { usePortfolio } from '@/context/PortfolioContext';
import { getWhatsAppUrl } from '@/lib/format';
import { renderDynamicIcon } from '@/lib/icons';

export const Header: React.FC = () => {
  const { data } = usePortfolio();
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const desktopNavRef = useRef<HTMLElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress();

  // 4 Massive Navigation Items
  const primaryNavItems = useMemo(() => [
    {
      id: 'home',
      label: (data.settings as any).homeNavLabel || 'Home',
      path: '/',
      icon: Home,
    },
    {
      id: 'vlog',
      label: (data.settings as any).vlogNavLabel || 'Vlog',
      path: '/vlog',
      icon: Tv,
    },
    {
      id: 'work',
      label: (data.settings as any).workNavLabel || 'Work',
      path: '/work',
      icon: Briefcase,
    },
    {
      id: 'passion',
      label: (data.settings as any).passionNavLabel || 'Passion',
      path: '/passion',
      icon: Camera,
    },
  ], [data.settings]);

  // Existing sections for the 3-dot "More Menu" quick-jump
  const visibleNavCategories = useMemo(() => NAV_CATEGORIES
    .map((category) => ({
      ...category,
      label: ({
        overview: (data.settings as any).overviewNavLabel || 'Overview',
        expertise: (data.settings as any).expertiseNavLabel || 'Expertise',
        work: (data.settings as any).workNavLabel || 'Work',
        connect: (data.settings as any).connectNavLabel || 'Connect',
      }[category.id] ?? category.label),
      subItems: category.subItems.filter((item) => {
        const section = item.href === '#home' ? 'hero' : item.href.slice(1);
        return data.sectionVisibility[section] !== false;
      }),
    }))
    .filter((category) => category.subItems.length > 0), [data.sectionVisibility, data.settings]);

  const visibleNavSections = useMemo(() => visibleNavCategories.flatMap((category) => category.subItems), [visibleNavCategories]);

  const showQuickActions = data.sectionVisibility.headerHireAction !== false
    || data.sectionVisibility.headerAdminAction !== false
    || (data.sectionVisibility.resume !== false && (
      data.sectionVisibility.headerResumeAction !== false
      || data.sectionVisibility.headerPdfAction !== false
    ));

  const visibleSocialLinks = data.sectionVisibility.socials !== false
    ? data.socialLinks.filter((link) => link.isVisible)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Scroll spy logic across sections if on Home page
      if (location === '/' || location === '') {
        const sections = visibleNavSections.map(item => document.getElementById(item.href.substring(1)));
        let currentActive = 'home';

        sections.forEach(section => {
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom >= 120) {
              currentActive = section.id;
            }
          }
        });

        setActiveSection(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleNavSections, location]);

  // Close menus on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current && 
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMoreMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);

    if (location !== '/' && location !== '') {
      setLocation('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isNavActive = (path: string) => {
    if (path === '/') return location === '/' || location === '';
    return location.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'h-[75px] glassmorphism' : 'h-[95px] bg-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-gradient-premium transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (location !== '/' && location !== '') {
              setLocation('/');
            } else {
              scrollToTop();
            }
          }}
          className="text-2xl font-bold font-heading tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg flex items-center gap-2"
          aria-label="Home"
        >
          <span className="text-gradient">{data.settings.firstName} </span>
          <span>{data.settings.lastName}</span>
        </a>

        {/* 4 Massive Desktop Navigation Tabs */}
        <nav 
          ref={desktopNavRef}
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl glassmorphism bg-background/50 border border-white/10"
        >
          {primaryNavItems.map((item) => {
            const active = isNavActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path === '/' && (location === '/' || location === '')) {
                    scrollToTop();
                  } else {
                    setLocation(item.path);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none ${
                  active
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {/* Active Neon Wave / Pill Animation */}
                {active && (
                  <motion.div
                    layoutId="massiveNavIndicator"
                    className="absolute inset-0 rounded-xl bg-gradient-premium shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon className={`w-4 h-4 relative z-10 transition-colors ${active ? 'text-white' : 'text-primary'}`} />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Desktop 3-Dot (More) Menu & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop Three-Dot (More) Button */}
          <div ref={moreMenuRef} className="hidden md:block relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setMoreMenuOpen(!moreMenuOpen);
                }
              }}
              aria-label="More navigation and quick actions"
              aria-expanded={moreMenuOpen}
              aria-haspopup="true"
              className={`w-10 h-10 rounded-full glassmorphism flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                moreMenuOpen
                  ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'text-muted-foreground hover:text-white hover:border-primary/50'
              }`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Desktop More Menu Dropdown */}
            <AnimatePresence>
              {moreMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-3 w-80 p-4 rounded-3xl glassmorphism bg-background/95 border border-white/15 shadow-2xl backdrop-blur-2xl z-50 space-y-4"
                >
                  {/* Quick Jump - All Sections */}
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {data.settings.moreSectionsTitle || 'Home Sections'}
                      </span>
                      <span className="text-[10px] text-primary/80 font-mono">{visibleNavSections.length} sections</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {visibleNavSections.map((section) => {
                        const isSectionActive = activeSection === section.href.substring(1) && (location === '/' || location === '');
                        const SectionIcon = section.icon;

                        return (
                          <a
                            key={section.label}
                            href={section.href}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollTo(section.href);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isSectionActive
                                ? 'bg-primary/20 text-white border border-primary/40'
                                : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                            }`}
                          >
                            <SectionIcon className="w-3.5 h-3.5 shrink-0 text-primary" />
                            <span className="truncate">{section.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions & Resume */}
                  {showQuickActions && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block px-1">
                        {data.settings.moreQuickActionsTitle || 'Quick Actions'}
                      </span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {data.sectionVisibility.headerHireAction !== false && (
                          <a
                            href={getWhatsAppUrl(data.settings.hireMeWhatsappNumber)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-gradient-premium text-white text-xs font-semibold hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
                          >
                            <Send className="w-3.5 h-3.5" /> {data.settings.hireMeLabel}
                          </a>
                        )}
                        {data.sectionVisibility.resume !== false && data.sectionVisibility.headerResumeAction !== false && (
                          <a
                            href="/resume"
                            onClick={() => setMoreMenuOpen(false)}
                            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-all"
                          >
                            <FileText className="w-3.5 h-3.5" /> {data.settings.resumeActionLabel || 'Resume'}
                          </a>
                        )}
                        {data.sectionVisibility.resume !== false && data.sectionVisibility.headerPdfAction !== false && (
                          <a
                            href={data.settings.resumeFileUrl}
                            download={data.settings.resumeFileName}
                            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border border-white/20 hover:border-primary/50 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                          >
                            <FileDown className="w-3.5 h-3.5" /> {data.settings.pdfActionLabel || 'PDF'}
                          </a>
                        )}
                        {data.sectionVisibility.headerAdminAction !== false && (
                          <a
                            href="/admin"
                            onClick={() => setMoreMenuOpen(false)}
                            className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white text-xs font-semibold transition-all"
                            title="Admin Panel"
                          >
                            <Shield className="w-3.5 h-3.5" /> {data.settings.adminActionLabel || 'Admin'}
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Channels & Back to Top */}
                  {((data.sectionVisibility.socials !== false && data.sectionVisibility.headerSocialLinks !== false) || data.sectionVisibility.headerBackToTop !== false) && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      {data.sectionVisibility.socials !== false && data.sectionVisibility.headerSocialLinks !== false ? (
                        <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                          {visibleSocialLinks.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={link.label}
                              title={link.label}
                              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                            >
                              {renderDynamicIcon(link.icon, { className: 'w-3.5 h-3.5' })}
                            </a>
                          ))}
                        </div>
                      ) : <span />}

                      {data.sectionVisibility.headerBackToTop !== false && (
                        <button
                          onClick={scrollToTop}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                        >
                          <ArrowUp className="w-3.5 h-3.5" /> Top
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Top Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-full glassmorphism flex items-center justify-center text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Top Drawer (Quick Actions, Resume, Sections) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 right-0 glassmorphism bg-background/95 border-t border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* 4 Primary Nav Links for Mobile Menu */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Main Pages
              </span>
              <div className="grid grid-cols-2 gap-2">
                {primaryNavItems.map((item) => {
                  const active = isNavActive(item.path);
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLocation(item.path);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                        active
                          ? 'bg-gradient-premium text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                          : 'bg-white/5 text-muted-foreground hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Actions
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {data.sectionVisibility.headerHireAction !== false && (
                    <a
                      href={getWhatsAppUrl(data.settings.hireMeWhatsappNumber)}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 rounded-xl bg-gradient-premium text-white font-semibold text-center text-xs flex items-center justify-center"
                    >
                      {data.settings.hireMeLabel}
                    </a>
                  )}
                  {data.sectionVisibility.resume !== false && data.sectionVisibility.headerResumeAction !== false && (
                    <a
                      href="/resume"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 rounded-xl border border-primary/40 bg-primary/10 text-primary font-semibold text-center text-xs flex items-center justify-center"
                    >
                      {data.settings.resumeActionLabel || 'Resume'}
                    </a>
                  )}
                  {data.sectionVisibility.resume !== false && data.sectionVisibility.headerPdfAction !== false && (
                    <a
                      href={data.settings.resumeFileUrl}
                      download={data.settings.resumeFileName}
                      className="py-2.5 rounded-xl border border-white/20 text-white font-semibold text-center text-xs hover:bg-white/5 flex items-center justify-center"
                    >
                      {data.settings.pdfActionLabel || 'PDF'}
                    </a>
                  )}
                  {data.sectionVisibility.headerAdminAction !== false && (
                    <a
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-white font-semibold text-center text-xs flex items-center justify-center"
                    >
                      {data.settings.adminActionLabel || 'Admin'}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Home Sections Jump */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Jump to Home Sections
              </span>
              <div className="grid grid-cols-2 gap-2">
                {visibleNavSections.map((sec) => (
                  <button
                    key={sec.label}
                    onClick={() => scrollTo(sec.href)}
                    className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium bg-white/5 text-muted-foreground hover:text-white text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{sec.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
