import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';
import { NAV_CATEGORIES } from '@/categories/navigationData';
import { usePortfolio } from '@/context/PortfolioContext';
import { getWhatsAppUrl } from '@/lib/format';
import { renderDynamicIcon } from '@/lib/icons';

export const Footer: React.FC = () => {
  const { data } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  };

  const getContactHref = (item: any) => {
    if (item.href) return item.href;
    const type = (item.type || '').toLowerCase();
    if (type === 'email') return `mailto:${item.value}`;
    if (type === 'phone') return `tel:${item.value}`;
    if (type === 'whatsapp') return getWhatsAppUrl(item.value);
    return undefined;
  };

  return (
    <footer className="relative z-10 pt-20 pb-10 border-t border-white/10 bg-background/50 backdrop-blur-lg mt-20">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Col 1 - Brand & Tagline */}
          <div className="space-y-6">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToTop(); }} 
              className="text-2xl font-bold font-heading tracking-tight inline-block"
            >
              <span className="text-gradient">
                {data.settings.firstName || 'Meskatul Masa'}{' '}
              </span>
              {data.settings.lastName || 'bhi Shanto'}
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {data.settings.footerTagline || 'Crafting premium digital experiences through elegant code and meticulous design.'}
            </p>
            <div className="flex gap-3 flex-wrap">
              {data.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                  aria-label={link.label}
                  title={link.label}
                >
                  {renderDynamicIcon(link.icon, { className: 'w-4 h-4' })}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Navigation Categories */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Navigation</h4>
            <ul className="space-y-3">
              {NAV_CATEGORIES.map(category => (
                <li key={category.id}>
                  <a 
                    href={category.href} 
                    onClick={(e) => { e.preventDefault(); scrollTo(category.href); }}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center justify-between group"
                  >
                    <span>{category.label}</span>
                    <span className="text-[11px] text-muted-foreground/50 group-hover:text-primary/70">
                      {category.subItems.map(s => s.label).join(' · ')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Services Offerings */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Services</h4>
            <ul className="space-y-3">
              {data.services.slice(0, 6).map(service => (
                <li key={service.id}>
                  <a 
                    href="#services" 
                    onClick={(e) => { e.preventDefault(); scrollTo('#services'); }}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 font-heading">Contact Info</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {data.contactInfo.map(info => {
                const href = getContactHref(info);
                return (
                  <li key={info.id}>
                    {href ? (
                      <a 
                        href={href} 
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noreferrer' : undefined}
                        className="hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span>{info.value}</span>
                    )}
                  </li>
                );
              })}
              <li className="pt-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  {data.settings.contactAvailabilityText || 'Available for remote work'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <div className="flex items-center gap-4 text-muted-foreground text-sm flex-wrap">
            <p>
              © {new Date().getFullYear()} {data.settings.name}. {data.settings.footerCopyrightText || 'All rights reserved.'}
            </p>
            <span>·</span>
            <a 
              href="/admin" 
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Shield className="w-3 h-3" /> Admin Panel
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full glassmorphism flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 transition-all group cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
