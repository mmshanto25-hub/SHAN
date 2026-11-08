import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  ExternalLink, 
  Github, 
  Layers, 
  Search, 
  ArrowLeft, 
  Sparkles, 
  Smartphone, 
  Globe, 
  Wand2, 
  Eye, 
  X 
} from 'lucide-react';
import { useLocation } from 'wouter';
import { fetchWorkProjects, type WorkProject } from '@/lib/extendedApi';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { VisitorChatWidget } from '@/components/VisitorChatWidget';

export const WorkPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);

  useEffect(() => {
    void fetchWorkProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });

    const handler = () => {
      void fetchWorkProjects().then(setProjects);
    };
    window.addEventListener('work-changed', handler);
    return () => window.removeEventListener('work-changed', handler);
  }, []);

  // Compute unique dynamic categories
  const categories = useMemo(() => {
    const defaultCats = ['All', 'Web Development', 'App Development', 'AI & Image Editing'];
    const projectCats = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    const merged = Array.from(new Set([...defaultCats, ...projectCats]));
    return merged;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('app')) return Smartphone;
    if (category.toLowerCase().includes('web')) return Globe;
    if (category.toLowerCase().includes('ai') || category.toLowerCase().includes('image')) return Wand2;
    return Layers;
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 container mx-auto max-w-7xl">
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => setLocation('/')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-white transition-colors py-1 px-3 rounded-full bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>

        {/* Hero Header */}
        <section className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Curated Engineering &amp; Creative Portfolio
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4"
          >
            Featured <span className="text-gradient">Work &amp; Solutions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed"
          >
            Specialized client deliveries and creative applications spanning mobile software, enterprise web systems, and AI image manipulation.
          </motion.p>
        </section>

        {/* Categories Bar & Search Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-premium text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tech or title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading projects showcase…</div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const CategoryIcon = getCategoryIcon(project.category);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group rounded-3xl glassmorphism bg-card/60 border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col justify-between"
                >
                  {/* Image Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-emerald-900/30 text-emerald-400">
                        <Briefcase className="w-10 h-10 opacity-40" />
                      </div>
                    )}

                    {/* Category Floating Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                      <CategoryIcon className="w-3 h-3 text-emerald-400" />
                      <span>{project.category}</span>
                    </div>

                    {/* Quick Preview Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-3.5 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-semibold hover:bg-white/30 transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2">
                        {project.title}
                      </h2>
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags & Action Buttons */}
                    <div className="space-y-4 pt-3 border-t border-white/5">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          Learn more →
                        </button>

                        <div className="flex items-center gap-2">
                          {project.repoUrl && (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                              title="Source code"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                              title="Live site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-background/95 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
            >
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {selectedProject.imageUrl && (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h1 className="text-2xl font-bold font-heading text-white">
                  {selectedProject.title}
                </h1>

                <p className="text-sm text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {selectedProject.description}
                </p>

                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Technologies &amp; Architecture
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-gradient-premium text-white text-xs font-semibold flex items-center gap-2 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Live Project
                    </a>
                  )}
                  {selectedProject.repoUrl && (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-white/10"
                    >
                      <Github className="w-4 h-4" /> View Source Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <VisitorChatWidget />
    </div>
  );
};

export default WorkPage;
