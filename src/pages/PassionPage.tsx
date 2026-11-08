import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Film, 
  Palette, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  X, 
  MapPin, 
  Sliders 
} from 'lucide-react';
import { useLocation } from 'wouter';
import { fetchPassionItems, type PassionItem } from '@/lib/extendedApi';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { VisitorChatWidget } from '@/components/VisitorChatWidget';

export const PassionPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<PassionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PassionItem | null>(null);

  useEffect(() => {
    void fetchPassionItems().then((data) => {
      setItems(data);
      setLoading(false);
    });

    const handler = () => {
      void fetchPassionItems().then(setItems);
    };
    window.addEventListener('passion-changed', handler);
    return () => window.removeEventListener('passion-changed', handler);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    return url;
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> Visual Arts, Lenses &amp; Motion
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight mb-4"
          >
            Creative <span className="text-gradient">Passions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-sm sm:text-base leading-relaxed"
          >
            A dedicated sanctuary celebrating cinematography, natural landscape photography, street candid frames, and conceptual generative art.
          </motion.p>
        </section>

        {/* Filter Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 pb-6 border-b border-white/10">
          {[
            { id: 'all', label: 'All Creative Works', icon: Sparkles },
            { id: 'photography', label: 'Photography', icon: Camera },
            { id: 'cinematography', label: 'Cinematography', icon: Film },
            { id: 'visual_art', label: 'Visual & 3D Arts', icon: Palette },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-premium text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Masonry / Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading creative gallery…</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items in this collection yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const isVideo = item.category === 'cinematography';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer relative rounded-3xl overflow-hidden glassmorphism bg-card/60 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] aspect-[4/3] flex flex-col justify-end"
                >
                  {/* Media Background */}
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  {/* Video Play Badge if Cinematography */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                    {item.category === 'photography' && <Camera className="w-3 h-3 text-pink-400" />}
                    {item.category === 'cinematography' && <Film className="w-3 h-3 text-purple-400" />}
                    {item.category === 'visual_art' && <Palette className="w-3 h-3 text-blue-400" />}
                    <span>{item.category.replace('_', ' ')}</span>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="relative z-10 p-5">
                    <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>

                    {item.location && (
                      <div className="flex items-center gap-1 text-[11px] text-pink-400/90 mt-2">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[92vh] bg-background/95 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-400 font-bold uppercase tracking-wider">
                  {selectedItem.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-muted-foreground hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Media Embed / Image */}
                {selectedItem.category === 'cinematography' && selectedItem.mediaUrl ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg">
                    <iframe
                      src={getEmbedUrl(selectedItem.mediaUrl) || ''}
                      title={selectedItem.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="max-h-[60vh] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={selectedItem.mediaUrl || selectedItem.thumbnailUrl}
                      alt={selectedItem.title}
                      className="max-h-[60vh] w-auto object-contain mx-auto"
                    />
                  </div>
                )}

                <h1 className="text-2xl font-bold font-heading text-white">
                  {selectedItem.title}
                </h1>

                <p className="text-sm text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {selectedItem.description}
                </p>

                {/* Metadata Grid */}
                {(selectedItem.location || selectedItem.gearInfo) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                    {selectedItem.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                        <span><strong>Location:</strong> {selectedItem.location}</span>
                      </div>
                    )}
                    {selectedItem.gearInfo && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                        <span><strong>Gear / Tech:</strong> {selectedItem.gearInfo}</span>
                      </div>
                    )}
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

export default PassionPage;
