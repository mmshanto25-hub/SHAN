import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { 
  Menu, 
  X, 
  ChevronDown, 
  MoreVertical, 
  FileDown, 
  FileText,
  Send, 
  ArrowUp,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Shield
} from 'lucide-react';
import { NAV_CATEGORIES, ALL_NAV_SECTIONS, NavCategory } from '@/categories/navigationData';
import { usePortfolio } from '@/context/PortfolioContext';
import { getWhatsAppUrl } from '@/lib/format';
import { renderDynamicIcon } from '@/lib/icons';

export const Header: React.FC = () => {
  const { data } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const desktopNavRef = useRef<HTMLElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useScrollProgress();

  // Determine which top-level category is currently active based on section in view
  const activeCategoryId = NAV_CATEGORIES.find(cat => 
    cat.subItems.some(sub => sub.href.substring(1) === activeSection)
  )?.id || 'overview';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Scroll spy logic across all sections
      const sections = ALL_NAV_SECTIONS.map(item => document.getElementById(item.href.substring(1)));
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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreMenuRef.current && 
        !moreMenuRef.current.contains(event.target as Node)
      ) {
        setMoreMenuOpen(false);
      }
      if (
        desktopNavRef.current && 
        !desktopNavRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdownId(null);
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
    setOpenDropdownId(null);
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
    setOpenDropdownId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'h-[80px] glassmorphism' : 'h-[100px] bg-transparent'
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
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#home');
          }}
          className="text-2xl font-bold font-heading tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Meskatul Masabhi Shanto - Home"
        >
          <span className="text-gradient">{data.settings.firstName} </span>{data.settings.lastName}
        </a>

        {/* Desktop 4-Item Navigation */}
        <nav 
          ref={desktopNavRef}
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-2"
        >
          {NAV_CATEGORIES.map((category: NavCategory) => {
            const isCategoryActive = activeCategoryId === category.id;
            const isDropdownOpen = openDropdownId === category.id;

            return (
              <div 
                key={category.id} 
                className="relative"
                onMouseEnter={() => setOpenDropdownId(category.id)}
                onMouseLeave={() => setOpenDropdownId(null)}
              >
                <button
                  onClick={() => {
                    if (openDropdownId === category.id) {
                      setOpenDropdownId(null);
                    } else {
                      setOpenDropdownId(category.id);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenDropdownId(isDropdownOpen ? null : category.id);
                    }
                  }}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  className={`group relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isCategoryActive || isDropdownOpen
                      ? 'text-white bg-white/10'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{category.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180 text-primary' : 'text-muted-foreground group-hover:text-white'
                    }`}
                  />
                  {isCategoryActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-premium rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl glassmorphism bg-background/95 border border-white/15 shadow-2xl backdrop-blur-2xl z-50"
                    >
                      <div className="px-3 py-1.5 mb-1 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/80 border-b border-white/5">
                        {category.label}
                      </div>

                      <div className="space-y-1">
                        {category.subItems.map(subItem => {
                          const isSubActive = activeSection === subItem.href.substring(1);
                          const SubIcon = subItem.icon;

                          return (
                            <a
                              key={subItem.label}
                              href={subItem.href}
                              onClick={(e) => {
                                e.preventDefault();
                                scrollTo(subItem.href);
                              }}
                              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                isSubActive
                                  ? 'bg-primary/15 text-white border border-primary/30'
                                  : 'hover:bg-white/10 text-muted-foreground hover:text-white border border-transparent'
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                                isSubActive ? 'bg-primary text-white' : 'bg-white/5 group-hover:bg-primary/20 text-primary group-hover:text-white'
                              }`}>
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-white">
                                    {subItem.label}
                                  </span>
                                  {isSubActive && (
                                    <span className="text-[10px] uppercase font-bold text-primary px-1.5 py-0.5 rounded-full bg-primary/20">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground/90 mt-0.5 line-clamp-1">
                                  {subItem.description}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                  {/* Quick Jump - All 8 Sections */}
                  <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        All Navigation Sections
                      </span>
                      <span className="text-[10px] text-primary/80 font-mono">8 sections</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {ALL_NAV_SECTIONS.map((section) => {
                        const isSectionActive = activeSection === section.href.substring(1);
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
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block px-1">
                      Quick Actions
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <a
                        href={getWhatsAppUrl(data.settings.hireMeWhatsappNumber)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-gradient-premium text-white text-xs font-semibold hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> {data.settings.hireMeLabel}
                      </a>
                      <a
                        href="/resume"
                        onClick={() => setMoreMenuOpen(false)}
                        className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" /> Resume
                      </a>
                      <a
                        href={data.settings.resumeFileUrl}
                        download={data.settings.resumeFileName}
                        className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border border-white/20 hover:border-primary/50 hover:bg-white/10 text-white text-xs font-semibold transition-all"
                      >
                        <FileDown className="w-3.5 h-3.5" /> PDF
                      </a>
                      <a
                        href="/admin"
                        onClick={() => setMoreMenuOpen(false)}
                        className="flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white text-xs font-semibold transition-all"
                        title="Admin Panel"
                      >
                        <Shield className="w-3.5 h-3.5" /> Admin
                      </a>
                    </div>
                  </div>

                  {/* Dynamic Social Channels & Back to Top */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-[200px]">
                      {data.socialLinks.map((link) => (
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

                    <button
                      onClick={scrollToTop}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                    >
                      <ArrowUp className="w-3.5 h-3.5" /> Top
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden w-10 h-10 rounded-full glassmorphism flex items-center justify-center text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 right-0 glassmorphism bg-background/95 border-t border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Grouped 4 Categories with sublinks */}
            <div className="space-y-4">
              {NAV_CATEGORIES.map((category) => {
                const isCatActive = activeCategoryId === category.id;

                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        isCatActive ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {category.label}
                      </span>
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pl-2">
                      {category.subItems.map((subItem) => {
                        const isSubActive = activeSection === subItem.href.substring(1);
                        const SubIcon = subItem.icon;

                        return (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollTo(subItem.href);
                            }}
                            className={`flex items-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-all ${
                              isSubActive
                                ? 'bg-primary/20 text-white border border-primary/40'
                                : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 text-primary shrink-0" />
                            <span className="truncate">{subItem.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Socials for Mobile */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={getWhatsAppUrl(data.settings.hireMeWhatsappNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 rounded-xl bg-gradient-premium text-white font-semibold text-center text-xs flex items-center justify-center"
                >
                  {data.settings.hireMeLabel}
                </a>
                <a
                  href="/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl border border-primary/40 bg-primary/10 text-primary font-semibold text-center text-xs flex items-center justify-center"
                >
                  Resume
                </a>
                <a
                  href={data.settings.resumeFileUrl}
                  download={data.settings.resumeFileName}
                  className="py-2.5 rounded-xl border border-white/20 text-white font-semibold text-center text-xs hover:bg-white/5 flex items-center justify-center"
                >
                  PDF CV
                </a>
                <a
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-white font-semibold text-center text-xs flex items-center justify-center"
                >
                  Admin
                </a>
              </div>

              <div className="flex justify-center items-center gap-4 pt-2 flex-wrap">
                {data.socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full glassmorphism flex items-center justify-center text-muted-foreground hover:text-white"
                    aria-label={link.label}
                    title={link.label}
                  >
                    {renderDynamicIcon(link.icon, { className: 'w-4 h-4' })}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
