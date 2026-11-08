import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  BookOpen, 
  Image as ImageIcon, 
  Play, 
  Search, 
  X, 
  Calendar, 
  ArrowLeft, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { useLocation } from 'wouter';
import { fetchVlogPosts, type VlogPost } from '@/lib/extendedApi';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { VisitorChatWidget } from '@/components/VisitorChatWidget';

export const VlogPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [posts, setPosts] = useState<VlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'video' | 'gallery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<VlogPost | null>(null);

  useEffect(() => {
    void fetchVlogPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });

    const handler = () => {
      void fetchVlogPosts().then(setPosts);
    };
    window.addEventListener('vlog-changed', handler);
    return () => window.removeEventListener('vlog-changed', handler);
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesFilter = activeFilter === 'all' || post.postType === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [posts, activeFilter, searchQuery]);

  // Extract embed URL for YouTube videos if available
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">
      <Header />

      {/* Main Container */}
      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 container mx-auto max-w-7xl">
        {/* Back Link & Breadcrumb */}
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Stories, Vlogs & Tech Chronicles
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4"
          >
            Vlog &amp; <span className="text-gradient">Articles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed"
          >
            Exploring software engineering, cinematography field notes, AI art workflows, and behind-the-scenes creative projects.
          </motion.p>
        </section>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          {/* Type Filters */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[
              { id: 'all', label: 'All Posts', icon: Sparkles },
              { id: 'article', label: 'Articles', icon: BookOpen },
              { id: 'video', label: 'Videos', icon: Tv },
              { id: 'gallery', label: 'Galleries', icon: ImageIcon },
            ].map((f) => {
              const Icon = f.icon;
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-premium text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts or tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading chronicles…</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No posts found matching your criteria. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setSelectedPost(post)}
                className="group cursor-pointer rounded-3xl glassmorphism bg-card/60 border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-900/30 text-primary">
                      <Tv className="w-10 h-10 opacity-40" />
                    </div>
                  )}

                  {/* Post Type Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                    {post.postType === 'video' && <Play className="w-3 h-3 text-red-400 fill-current" />}
                    {post.postType === 'article' && <BookOpen className="w-3 h-3 text-blue-400" />}
                    {post.postType === 'gallery' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                    <span>{post.postType}</span>
                  </div>

                  {/* Play Overlay for Videos */}
                  {post.postType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Info */}
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                      {post.summary}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      {/* Detail / Reader Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-background/95 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-bold uppercase tracking-wider">
                    {selectedPost.postType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selectedPost.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Media Section: Video embed or Hero Image */}
                {selectedPost.postType === 'video' && selectedPost.mediaUrl ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                    <iframe
                      src={getEmbedUrl(selectedPost.mediaUrl) || ''}
                      title={selectedPost.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : selectedPost.thumbnailUrl ? (
                  <div className="w-full h-64 rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={selectedPost.thumbnailUrl}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {selectedPost.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-primary font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <div className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed whitespace-pre-wrap space-y-4">
                  {selectedPost.content || selectedPost.summary}
                </div>

                {/* External Media link if provided */}
                {selectedPost.mediaUrl && selectedPost.postType !== 'video' && (
                  <div className="pt-4 border-t border-white/10">
                    <a
                      href={selectedPost.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View External Media Source
                    </a>
                  </div>
                )}
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

export default VlogPage;
