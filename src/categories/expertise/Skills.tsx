import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { renderDynamicIcon } from '@/lib/icons';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            {data.settings.skillsHeading}
          </h2>
          <div className="w-20 h-1 bg-gradient-premium rounded-full mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.skillCategories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glassmorphism rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all"
            >
              <h3 className="text-2xl font-bold text-white mb-6 font-heading">{category.title}</h3>
              <div className="space-y-6">
                {category.skills.map((skill) => {
                  const safePercent = Math.min(100, Math.max(0, skill.percent));
                  return (
                    <div key={skill.id}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {renderDynamicIcon(skill.icon, {
                            className: 'w-5 h-5',
                            style: { color: skill.color }
                          })}
                          <span className="font-medium text-white">{skill.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{safePercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${safePercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                          className="h-full bg-gradient-premium rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
