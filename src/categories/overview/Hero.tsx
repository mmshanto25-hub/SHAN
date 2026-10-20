import React from 'react';
import { motion } from 'framer-motion';
import { SiReact, SiTypescript, SiNodedotjs, SiFigma } from 'react-icons/si';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { usePortfolio } from '@/context/PortfolioContext';
import { getWhatsAppUrl } from '@/lib/format';
import { renderDynamicIcon } from '@/lib/icons';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();

  const typingRoles = data.settings.typingRoles && data.settings.typingRoles.length > 0
    ? data.settings.typingRoles
    : ['Developer'];

  const typingText = useTypingEffect(
    typingRoles,
    80,
    40,
    2000
  );

  return (
    <section id="home" className="min-h-[100dvh] flex items-center relative pt-20">
      {/* Floating Tech Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-[10%] opacity-20">
          <SiReact className="w-16 h-16 text-[#61DAFB]" />
        </motion.div>
        <motion.div animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[25%] left-[5%] opacity-20">
          <SiTypescript className="w-12 h-12 text-[#3178C6]" />
        </motion.div>
        <motion.div animate={{ y: [0, -25, 0], rotate: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] right-[15%] opacity-20">
          <SiNodedotjs className="w-14 h-14 text-[#339933]" />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism w-max border border-primary/20 bg-primary/5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-primary-foreground/80">{data.settings.statusText}</span>
          </div>

          <div className="space-y-2">
            <p className="text-xl text-muted-foreground font-medium">{data.settings.bioHeadline}</p>
            <h1 className="text-5xl md:text-7xl font-bold font-heading text-white tracking-tight">
              {data.settings.name}
            </h1>
            <div className="h-12 flex items-center">
              <p className="text-2xl md:text-3xl font-semibold text-gradient">
                {typingText}<span className="animate-pulse">|</span>
              </p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            {data.settings.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={getWhatsAppUrl(data.settings.hireMeWhatsappNumber)}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-full bg-gradient-premium text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-1"
            >
              {data.settings.hireMeLabel}
            </a>
            <a
              href={data.settings.resumeFileUrl}
              download={data.settings.resumeFileName}
              className="px-8 py-3.5 rounded-full border border-white/20 hover:border-primary/50 hover:bg-primary/5 text-white font-semibold transition-all"
            >
              {data.settings.downloadCvLabel}
            </a>
          </div>

          <div className="flex items-center gap-4 pt-4 flex-wrap">
            {data.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
                className="w-12 h-12 rounded-full glassmorphism flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-1"
              >
                {renderDynamicIcon(link.icon, { className: "w-5 h-5" })}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right Content - Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center items-center h-[500px]"
        >
          {/* Decorative rings */}
          <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-accent/20 animate-[spin_15s_linear_infinite_reverse]" />

          {/* Card behind avatar */}
          <div className="absolute w-[280px] h-[320px] glassmorphism rounded-3xl rotate-12 bg-white/5 opacity-50" />
          <div className="absolute w-[280px] h-[320px] glassmorphism rounded-3xl -rotate-6 bg-primary/10 opacity-50" />

          {/* Avatar Container */}
          <div className="relative w-[300px] h-[300px] rounded-full p-1 bg-gradient-to-tr from-primary via-purple-500 to-accent shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full rounded-full bg-card overflow-hidden flex items-center justify-center relative">
              <img
                src={data.settings.heroAvatarUrl || "/profile.jpg"}
                alt={data.settings.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/profile.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay" />
            </div>
          </div>

          {/* Floating Badges */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 glassmorphism p-3 rounded-2xl flex items-center gap-2 border-primary/30"
          >
            <SiReact className="w-6 h-6 text-[#61DAFB]" />
            <span className="font-semibold text-sm">React</span>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-10 glassmorphism p-3 rounded-2xl flex items-center gap-2 border-accent/30"
          >
            <SiFigma className="w-6 h-6 text-[#F24E1E]" />
            <span className="font-semibold text-sm">Design</span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
