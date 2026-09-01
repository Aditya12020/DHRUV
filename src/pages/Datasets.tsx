import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/ui/SearchBar';
import DatasetCard from '@/components/cards/DatasetCard';
import { datasets } from '@/data/datasets';
import type { Region } from '@/types';
import { Database, Filter } from 'lucide-react';

const regions: ('All' | Region)[] = ['All', 'Arctic', 'Antarctic', 'Southern Ocean'];
const types = ['All', ...Array.from(new Set(datasets.map(d => d.type)))];
const formats = ['All', ...Array.from(new Set(datasets.map(d => d.format)))];

export default function Datasets() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');
  const [format, setFormat] = useState('All');

  const filtered = useMemo(() => {
    return datasets.filter(d => {
      const matchQuery = d.title.toLowerCase().includes(query.toLowerCase()) || d.description.toLowerCase().includes(query.toLowerCase());
      const matchRegion = region === 'All' || d.region === region;
      const matchType = type === 'All' || d.type === type;
      const matchFormat = format === 'All' || d.format === format;
      return matchQuery && matchRegion && matchType && matchFormat;
    });
  }, [query, region, type, format]);

  const stats = {
    total: datasets.length,
    records: datasets.reduce((acc, curr) => acc + curr.recordCount, 0),
    formats: formats.length - 1
  };

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="pt-6 pb-2 border-b border-line flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              Observational &amp; Survey Data Catalog
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mt-2">
              Polar Research Datasets
            </h1>
            <p className="text-xs sm:text-sm text-ink-light max-w-xl mt-1 leading-relaxed">
              Curated, peer-reviewed atmospheric, cryospheric, oceanographic, and glaciological raw measurement series.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white p-3 rounded border border-line text-center min-w-[90px] shadow-subtle">
              <div className="text-xl font-serif font-bold text-ink">{stats.total}</div>
              <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">Datasets</div>
            </div>
            <div className="bg-white p-3 rounded border border-line text-center min-w-[90px] shadow-subtle">
              <div className="text-xl font-serif font-bold text-ink">{(stats.records / 1000000).toFixed(1)}M+</div>
              <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">Records</div>
            </div>
            <div className="bg-white p-3 rounded border border-line text-center min-w-[90px] shadow-subtle">
              <div className="text-xl font-serif font-bold text-forest-700">{stats.formats}</div>
              <div className="text-[11px] text-forest-700 font-medium uppercase tracking-wider">Formats</div>
            </div>
          </div>
        </header>

        {/* Search */}
        <SearchBar 
          value={query} 
          onChange={setQuery} 
          placeholder="Search datasets by variable, location, or parameters..." 
        />

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded border border-line flex flex-col lg:flex-row gap-5 shadow-subtle">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold text-ink-light uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-forest-600" /> Region:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {regions.map(r => (
                <button 
                  key={r} 
                  onClick={() => setRegion(r)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    region === r
                      ? 'bg-forest-600 text-white font-semibold shadow-xs'
                      : 'bg-canvas-subtle text-ink-light hover:text-ink border border-line'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 space-y-2 lg:border-l lg:border-line lg:pl-5">
            <span className="text-xs font-semibold text-ink-light uppercase tracking-wider">Data Domain:</span>
            <div className="flex flex-wrap gap-1.5">
              {types.map(t => (
                <button 
                  key={t} 
                  onClick={() => setType(t)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    type === t
                      ? 'bg-forest-600 text-white font-semibold shadow-xs'
                      : 'bg-canvas-subtle text-ink-light hover:text-ink border border-line'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 lg:border-l lg:border-line lg:pl-5">
            <span className="text-xs font-semibold text-ink-light uppercase tracking-wider block">File Format:</span>
            <select 
              value={format} 
              onChange={(e) => setFormat(e.target.value)} 
              className="bg-canvas-subtle border border-line rounded px-2.5 py-1 text-xs text-ink outline-none focus:border-forest-600 w-full lg:w-auto"
            >
              {formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs text-ink-light">
          Showing <strong className="text-ink font-semibold">{filtered.length}</strong> research datasets
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-line rounded p-8 text-ink-light text-sm">
            No datasets found matching your search and filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((ds, i) => (
                <motion.div 
                  key={ds.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <DatasetCard dataset={ds} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}
