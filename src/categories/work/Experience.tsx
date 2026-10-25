import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';

export const Experience: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="experience" className="py-24 relative z-10">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            {data.settings.experienceHeading}
          </h2>
          <div className="w-20 h-1 bg-gradient-premium rounded-full mx-auto" />
        </motion.div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 md:-translate-x-1/2" />

          {data.experiences.map((exp, idx: number) => {
            const isEven = idx % 2 === 0;
            return (
              <div key={exp.id} className="relative flex items-center justify-between mb-16 md:mb-24 flex-col md:flex-row last:mb-0">
                
                {/* Desktop Empty Space for staggering */}
                <div className={`hidden md:block w-[45%] ${isEven ? 'order-1' : 'order-3'}`} />
                
                {/* Timeline Dot */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-background border-4 border-primary z-10 -translate-x-[23px] md:-translate-x-1/2 flex items-center justify-center top-0 md:top-1/2 md:-translate-y-1/2"
                >
                  <div className="w-full h-full rounded-full bg-gradient-premium opacity-20" />
                </motion.div>

                {/* Content Card */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`w-full md:w-[45%] pl-24 md:pl-0 ${isEven ? 'md:pr-12 md:text-right order-2 md:order-1' : 'md:pl-12 order-2 md:order-3'}`}
                >
                  <div className="glassmorphism p-8 rounded-3xl hover:border-primary/30 transition-colors relative group">
                    <div className={`absolute top-8 ${isEven ? 'md:right-8 left-8 md:left-auto' : 'left-8'} w-14 h-14 rounded-full bg-gradient-premium p-[2px] opacity-20 group-hover:opacity-100 transition-opacity`}>
                       <div className="w-full h-full bg-card rounded-full flex items-center justify-center font-bold text-white text-sm">
                         {exp.initials}
                       </div>
                    </div>
                    
                    <span className="text-sm font-bold text-primary mb-2 block pt-16 md:pt-0">{exp.date}</span>
                    <h3 className="text-2xl font-bold text-white mb-1 font-heading">{exp.role}</h3>
                    <h4 className="text-lg text-white/60 mb-4">{exp.company}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
