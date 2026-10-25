import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';

export const Testimonials: React.FC = () => {
  const { data } = usePortfolio();
  const testimonials = data.testimonials || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex % testimonials.length];

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            {data.settings.testimonialsHeading}
          </h2>
          <div className="w-20 h-1 bg-gradient-premium rounded-full mx-auto" />
        </motion.div>

        <div
          className="max-w-4xl mx-auto relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex justify-center items-center relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id || currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute w-full"
              >
                <div className="glassmorphism p-10 md:p-12 rounded-3xl border-white/10 relative">
                  <div className="text-6xl text-primary/20 absolute top-6 left-6 font-serif">"</div>

                  <div className="flex flex-col items-center text-center relative z-10">
                    <div className="flex gap-1 mb-6 text-yellow-500">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="w-5 h-5 fill-current" />
                      ))}
                    </div>

                    <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed mb-10 italic">
                      {current.text}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${current.color || 'from-blue-400 to-indigo-500'} p-1`}>
                        <div className="w-full h-full bg-card rounded-full flex items-center justify-center font-bold text-white">
                          {current.initials}
                        </div>
                      </div>
                      <div className="text-left">
                        <h4 className="text-white font-bold text-lg">{current.name}</h4>
                        <p className="text-primary text-sm font-medium">{current.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {testimonials.length > 1 && (
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full glassmorphism flex items-center justify-center text-white hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'bg-primary w-8' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full glassmorphism flex items-center justify-center text-white hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
