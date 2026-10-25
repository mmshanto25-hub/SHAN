import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
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
import { usePortfolio } from '@/context/PortfolioContext';

// Standalone Pages
import AdminPage from '@/pages/AdminPage';
import { ResumePage } from '@/pages/ResumePage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

const LoadingScreen = () => {
  return (
    <div className="orbit-loader" role="status" aria-label="Loading">
      <div className="orbit-loader__animation" aria-hidden="true">
        <span className="orbit-loader__track orbit-loader__track--outer" />
        <span className="orbit-loader__track orbit-loader__track--inner" />
        <img className="orbit-loader__favicon" src="/favicon.png" alt="" />
      </div>
    </div>
  );
};

const PortfolioHome = () => {
  const { data } = usePortfolio();

  return (
    <>
      {data.sectionVisibility.header !== false && <Header />}
      <main>
        {data.sectionVisibility.hero !== false && <Hero />}
        {data.sectionVisibility.about !== false && <About />}

        {data.sectionVisibility.skills !== false && <Skills />}
        {data.sectionVisibility.services !== false && <Services />}

        {data.sectionVisibility.projects !== false && <Projects />}
        {data.sectionVisibility.experience !== false && <Experience />}

        {data.sectionVisibility.testimonials !== false && <Testimonials />}
        {data.sectionVisibility.contact !== false && <Contact />}
      </main>
      {data.sectionVisibility.footer !== false && <Footer />}
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PortfolioProvider>
          {loading && <LoadingScreen />}

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
