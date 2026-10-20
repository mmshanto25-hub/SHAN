import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from '@/context/PortfolioContext';

// Global aesthetic components
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CustomCursor } from '@/components/CustomCursor';

// Category Section Components
import { Header } from '@/components/sections/Header';
import { Hero } from '@/categories/overview/Hero';
import { About } from '@/categories/overview/About';
import { Skills } from '@/categories/expertise/Skills';
import { Services } from '@/categories/expertise/Services';
import { Projects } from '@/categories/work/Projects';
import { Experience } from '@/categories/work/Experience';
import { Testimonials } from '@/categories/connect/Testimonials';
import { Contact } from '@/categories/connect/Contact';
import { Footer } from '@/components/sections/Footer';

// Standalone Pages
import AdminPage from '@/pages/AdminPage';
import { ResumePage } from '@/pages/ResumePage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

// Initial Loading Screen
const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold font-heading tracking-tight"
        >
          <span className="text-gradient">Meskatul Masa</span>bhi Shanto
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="absolute -bottom-2 left-0 h-[2px] bg-gradient-premium"
        />
      </div>
    </motion.div>
  );
};

const PortfolioHome = () => {
  return (
    <>
      <Header />
      <main>
        {/* Category 1: Overview */}
        <Hero />
        <About />

        {/* Category 2: Expertise */}
        <Skills />
        <Services />

        {/* Category 3: Work */}
        <Projects />
        <Experience />

        {/* Category 4: Connect */}
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PortfolioProvider>
          <AnimatePresence>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
          </AnimatePresence>

          <div className="min-h-screen bg-transparent relative selection:bg-primary/30 selection:text-white">
            {/* Global Background and Cursor */}
            <AnimatedBackground />
            <CustomCursor />

            {!loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Switch>
                  <Route path="/" component={PortfolioHome} />
                  <Route path="/resume" component={ResumePage} />
                  <Route path="/admin" component={AdminPage} />
                  <Route component={NotFound} />
                </Switch>
              </motion.div>
            )}
          </div>

          <Toaster />
        </PortfolioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
