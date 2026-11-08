import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, Tv, Briefcase, Camera } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  accentColor: string;
  glowColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
    accentColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.7)',
  },
  {
    id: 'vlog',
    label: 'Vlog',
    path: '/vlog',
    icon: Tv,
    accentColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.7)',
  },
  {
    id: 'work',
    label: 'Work',
    path: '/work',
    icon: Briefcase,
    accentColor: 'text-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.7)',
  },
  {
    id: 'passion',
    label: 'Passion',
    path: '/passion',
    icon: Camera,
    accentColor: 'text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.7)',
  },
];

export const BottomAppBar: React.FC = () => {
  const [location, setLocation] = useLocation();

  // Hide BottomAppBar on admin dashboard
  if (location.startsWith('/admin')) {
    return null;
  }

  // Determine active item: exact match or prefix
  const getIsActive = (path: string) => {
    if (path === '/') return location === '/' || location === '';
    return location.startsWith(path);
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-4 left-3 right-3 z-40"
    >
      {/* Outer Floating Glow Frame */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/40 to-pink-500/30 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        
        {/* Main Bar Container */}
        <div className="relative flex items-center justify-around px-2 py-2 rounded-3xl bg-background/85 backdrop-blur-xl border border-white/10 overflow-hidden">
          
          {/* Subtle Ambient Glow inside the bar */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />

          {NAV_ITEMS.map((item) => {
            const isActive = getIsActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setLocation(item.path);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative flex-1 py-1.5 px-1 flex flex-col items-center justify-center gap-1 transition-all group focus:outline-none"
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Neon Wave / Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="neonWaveMobile"
                    className="absolute inset-x-1 inset-y-0 rounded-2xl bg-white/10 border border-white/20"
                    style={{
                      boxShadow: `0 0 20px ${item.glowColor}, inset 0 0 12px ${item.glowColor}`,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 32,
                    }}
                  >
                    {/* Top Neon Wave Crest Line */}
                    <div
                      className="absolute -top-[1px] left-2 right-2 h-[2px] rounded-full"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${item.glowColor}, transparent)`,
                        boxShadow: `0 0 8px ${item.glowColor}`,
                      }}
                    />
                  </motion.div>
                )}

                {/* Icon with Motion and Active Glow */}
                <div className="relative z-10">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? `${item.accentColor} scale-110`
                        : 'text-muted-foreground group-hover:text-white'
                    }`}
                  />
                  {isActive && (
                    <motion.span
                      layoutId="neonDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#fff]"
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`relative z-10 text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-white font-bold' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
