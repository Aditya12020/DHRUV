import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video as VideoIcon, Play } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import VideoCard from '@/components/cards/VideoCard';
import { videos } from '@/data/videos';
import type { Video } from '@/types';

const types = ['All', 'documentary', 'expedition_footage', 'educational', 'news'];

export default function Videos() {
  const [type, setType] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filtered = useMemo(() => {
    return videos.filter(v => type === 'All' || v.type === type);
  }, [type]);

  const typeLabels: Record<string, string> = {
    documentary: 'Documentaries',
    expedition_footage: 'Expedition Footage',
    educational: 'Educational Media',
    news: 'News & Symposia'
  };

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="pt-6 pb-2 text-center border-b border-line">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1">
            <VideoIcon className="w-3.5 h-3.5" />
            Multimedia &amp; Cinematography Archive
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mt-2">
            Expedition Films &amp; Scientific Documentaries
          </h1>
          <p className="text-xs sm:text-sm text-ink-light max-w-xl mx-auto mt-1 leading-relaxed">
            Curated historical expedition footage, field interviews, documentaries, and outreach lectures from Indian polar programs.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 pb-2">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                type === t 
                  ? 'bg-forest-600 text-white font-semibold shadow-xs' 
                  : 'bg-white text-ink-light hover:text-ink border border-line shadow-subtle'
              }`}
            >
              {t === 'All' ? 'All Video Records' : typeLabels[t]}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((video, i) => (
              <motion.div 
                key={video.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.05 }}
              >
                <VideoCard video={video} onClick={() => setSelectedVideo(video)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      <Modal isOpen={!!selectedVideo} onClose={() => setSelectedVideo(null)} title={selectedVideo?.title || ''} size="xl">
        {selectedVideo && (
          <div className="bg-white rounded overflow-hidden">
            <div className="relative w-full aspect-video bg-black">
              {selectedVideo.youtubeId ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`} 
                  title={selectedVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <img src={selectedVideo.thumbnailUrl} alt={selectedVideo.title} className="w-full h-full object-cover opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-forest-700/90 rounded-full flex items-center justify-center text-white backdrop-blur-xs">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 bg-black/70 px-3 py-1 rounded text-xs text-slate-300">
                    Video stream unavailable offline
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 uppercase">
                  {typeLabels[selectedVideo.type] || selectedVideo.type}
                </span>
                <span className="text-xs text-ink-light">{selectedVideo.date}</span>
                <span className="text-xs text-ink-light">• {selectedVideo.duration}</span>
              </div>
              <p className="text-xs text-ink-light mb-4 leading-relaxed">{selectedVideo.description}</p>
              
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-line">
                {selectedVideo.tags.map(tag => (
                  <span key={tag} className="text-[11px] text-ink-light bg-canvas-subtle px-2 py-0.5 rounded border border-line">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
