import React from 'react';
import { motion } from 'framer-motion';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { usePortfolio } from '@/context/PortfolioContext';

export const About: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="about" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
                {data.settings.aboutHeading || 'About Me'}
              </h2>
              <div className="w-20 h-1 bg-gradient-premium rounded-full" />
            </div>

            <div className="flex gap-6 items-center">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-accent shrink-0">
                <div className="w-full h-full rounded-full bg-card overflow-hidden relative">
                  <img
                    src={data.settings.aboutAvatarUrl || "/profile1.jpg"}
                    alt={data.settings.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/profile1.jpg';
                    }}
                  />
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {data.settings.aboutDescription1}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {data.stats.map((stat) => (
                <StatCard key={stat.id} value={stat.value} suffix={stat.suffix} label={stat.label} />
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                {data.settings.aboutDescription2}
              </p>
              <p>
                {data.settings.aboutDescription3}
              </p>
            </div>

            {/* Mini Timeline (2023, 2021, 2019, 2018 editable) */}
            <div className="relative pl-6 border-l border-white/10 space-y-8 mt-10">
              {data.aboutTimeline.map((item) => (
                <TimelineItem key={item.id} year={item.year} role={item.role} company={item.company} />
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

const StatCard = ({ value, suffix, label }: { value: number, suffix: string, label: string }) => {
  const { count, ref } = useCounterAnimation(value, 2000);
  
  return (
    <div className="glassmorphism p-6 rounded-2xl border-white/5 hover:border-primary/20 transition-colors">
      <div className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-baseline gap-1" ref={ref}>
        {count}<span className="text-primary">{suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

const TimelineItem = ({ year, role, company }: { year: string, role: string, company: string }) => (
  <div className="relative">
    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary" />
    <span className="text-sm text-primary font-bold">{year}</span>
    <h4 className="text-lg font-semibold text-white mt-1">{role}</h4>
    <span className="text-muted-foreground">{company}</span>
  </div>
);
