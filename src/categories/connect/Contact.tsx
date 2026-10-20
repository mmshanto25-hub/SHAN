import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { getWhatsAppUrl } from '@/lib/format';
import { renderDynamicIcon } from '@/lib/icons';

const DEFAULT_ICON_MAP: Record<string, any> = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  whatsapp: MessageSquare
};

export const Contact: React.FC = () => {
  const { data } = usePortfolio();

  const getContactHref = (item: any) => {
    if (item.href) return item.href;
    const type = (item.type || '').toLowerCase();
    if (type === 'email') return `mailto:${item.value}`;
    if (type === 'phone') return `tel:${item.value}`;
    if (type === 'whatsapp') return getWhatsAppUrl(item.value);
    return undefined;
  };

  const openFloatingChat = () => {
    // Find the floating chat button and click it
    const chatBtn = document.querySelector('button[aria-label="Open message chat"]') as HTMLButtonElement;
    if (chatBtn) {
      chatBtn.click();
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left Column - Contact Channels */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                {data.settings.contactHeadingTitle || "Let's Work Together"}
              </h2>
              <div className="w-20 h-1 bg-gradient-premium rounded-full mb-6" />
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.settings.contactHeadingSubtitle}
              </p>
            </div>

            <div className="space-y-5">
              {data.contactInfo.map((info) => {
                const FallbackIcon = DEFAULT_ICON_MAP[info.type.toLowerCase()] || MapPin;
                const href = getContactHref(info);

                return (
                  <ContactCard 
                    key={info.id} 
                    iconName={info.type}
                    fallbackIcon={FallbackIcon}
                    title={info.title} 
                    value={info.value} 
                    href={href} 
                  />
                );
              })}
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 font-heading">
                {data.settings.contactSocialsHeading || "Connect with me"}
              </h3>
              <div className="flex gap-3 flex-wrap">
                {data.socialLinks.map((link) => (
                  <a 
                    key={link.id} 
                    href={link.url} 
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-xl glassmorphism flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all transform hover:-translate-y-1"
                    aria-label={link.label}
                    title={link.label}
                  >
                    {renderDynamicIcon(link.icon, { className: 'w-5 h-5' })}
                  </a>
                ))}
              </div>
            </div>

            {/* Map Visual Graphic */}
            <div className="w-full h-44 rounded-3xl glassmorphism overflow-hidden relative group border-white/10">
              <div className="absolute inset-0 bg-[#0F172A]" />
              <div 
                className="absolute inset-0 opacity-20" 
                style={{ 
                  backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }} 
              />
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,50 Q25,30 50,50 T100,30" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M20,0 L30,100" stroke="#8B5CF6" strokeWidth="1" fill="none" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute" />
                <div className="w-4 h-4 bg-primary rounded-full relative z-10 border-2 border-white shadow-lg" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Right Column - Direct Live Chat & Fast Connect Hub */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glassmorphism p-8 md:p-10 rounded-3xl border-white/10 relative overflow-hidden space-y-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {data.settings.contactAvailabilityText || "Available for remote work"}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white font-heading">
                  Start a Conversation
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Send a message directly through the site via the floating chat widget, or connect instantly over WhatsApp and email.
                </p>
              </div>

              {/* Chat action card */}
              <div className="space-y-4">
                <button
                  onClick={openFloatingChat}
                  className="w-full p-6 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/40 hover:border-primary text-left group transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base group-hover:text-primary transition-colors">
                        Open Live Chat
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Chat directly on this site · Saved to inbox
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>

                {/* WhatsApp Chat Card */}
                <a
                  href={getWhatsAppUrl(data.settings.hireMeWhatsappNumber)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/5 text-left group transition-all flex items-center justify-between block no-underline"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shadow-lg group-hover:scale-105 transition-transform">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base group-hover:text-green-400 transition-colors">
                        Chat on WhatsApp
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Direct to {data.settings.hireMeWhatsappNumber}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </div>

              {/* Guarantees */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Fast reply within 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Direct developer contact</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const ContactCard = ({ 
  iconName,
  fallbackIcon: FallbackIcon, 
  title, 
  value, 
  href 
}: { 
  iconName: string;
  fallbackIcon: any; 
  title: string; 
  value: string; 
  href?: string;
}) => {
  const content = (
    <div className="flex items-center gap-5 p-4 rounded-2xl glassmorphism border-white/5 hover:border-primary/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0">
        {renderDynamicIcon(iconName, { className: 'w-5 h-5 text-primary' })}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium mb-0.5">{title}</p>
        <p className="text-base text-white font-semibold truncate group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        className="block no-underline"
      >
        {content}
      </a>
    );
  }

  return content;
};
