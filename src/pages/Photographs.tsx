import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Camera } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import Modal from '@/components/ui/Modal';
import PhotoCard from '@/components/cards/PhotoCard';
import { photographs } from '@/data/photographs';
import type { Photograph, Region } from '@/types';

const regions: ('All' | Region)[] = ['All', 'Arctic', 'Antarctic', 'Southern Ocean'];

export default function Photographs() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<Photograph | null>(null);

  const filtered = useMemo(() => {
    return photographs.filter(p => {
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
      const matchRegion = region === 'All' || p.region === region;
      return matchQuery && matchRegion;
    });
  }, [query, region]);

  const handlePrev = () => {
    if (!selectedPhoto) return;
    const idx = filtered.findIndex(p => p.id === selectedPhoto.id);
    if (idx > 0) setSelectedPhoto(filtered[idx - 1]);
  };

  const handleNext = () => {
    if (!selectedPhoto) return;
    const idx = filtered.findIndex(p => p.id === selectedPhoto.id);
    if (idx < filtered.length - 1) setSelectedPhoto(filtered[idx + 1]);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, filtered]);

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="pt-6 pb-2 border-b border-line flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              Expedition Visual Records
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mt-2">
              Polar Photographic Archive
            </h1>
            <p className="text-xs sm:text-sm text-ink-light max-w-xl mt-1 leading-relaxed">
              Historical and scientific documentation of polar fieldwork, wildlife biology, glaciology, and research station operations.
            </p>
          </div>
          <div className="bg-white p-3 rounded border border-line text-center px-6 shadow-subtle">
            <div className="text-2xl font-serif font-bold text-ink">{photographs.length}</div>
            <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">Archived Photos</div>
          </div>
        </header>

        {/* Search & Region Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <SearchBar value={query} onChange={setQuery} placeholder="Search photographs by keyword, subject, or location..." />
          </div>
          <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto py-1">
            {regions.map(r => (
              <button 
                key={r} 
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  region === r 
                    ? 'bg-forest-600 text-white font-semibold shadow-xs' 
                    : 'bg-white text-ink-light hover:text-ink border border-line shadow-subtle'
                }`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filtered.map(photo => (
              <motion.div 
                key={photo.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="break-inside-avoid"
              >
                <PhotoCard photo={photo} onClick={() => setSelectedPhoto(photo)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} title="" size="xl">
        {selectedPhoto && (
          <div className="relative bg-white rounded overflow-hidden flex flex-col">
            <div className="relative bg-ink flex items-center justify-center min-h-[50vh] max-h-[70vh]">
              <img src={selectedPhoto.url} alt={selectedPhoto.title} className="max-w-full max-h-[70vh] object-contain" />
              
              <button 
                onClick={handlePrev} 
                className="absolute left-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNext} 
                className="absolute right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-3 bg-white border-t border-line">
              <h2 className="text-xl font-serif font-bold text-ink">{selectedPhoto.title}</h2>
              <p className="text-xs text-ink-light leading-relaxed">{selectedPhoto.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-ink pt-3 border-t border-line/70">
                <div><span className="block text-[11px] text-ink-faint uppercase font-semibold mb-0.5">Photographer</span> {selectedPhoto.photographer}</div>
                <div><span className="block text-[11px] text-ink-faint uppercase font-semibold mb-0.5">Location</span> {selectedPhoto.location}</div>
                <div><span className="block text-[11px] text-ink-faint uppercase font-semibold mb-0.5">Date</span> {selectedPhoto.date}</div>
                <div><span className="block text-[11px] text-ink-faint uppercase font-semibold mb-0.5">License</span> {selectedPhoto.license}</div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedPhoto.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-canvas-subtle rounded text-[11px] text-ink-light border border-line">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
