import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/context/PortfolioContext';
import { renderDynamicIcon } from '@/lib/icons';

export const Services: React.FC = () => {
  const { data } = usePortfolio();

  return (
    <section id="services" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Services
          </h2>
          <div className="w-20 h-1 bg-gradient-premium rounded-full mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="glassmorphism p-8 rounded-3xl group border-white/5 hover:border-primary/30 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-premium opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                {renderDynamicIcon(service.icon, {
                  className: "w-7 h-7 text-primary group-hover:text-accent transition-colors"
                })}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 font-heading">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
