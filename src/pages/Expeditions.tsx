import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Activity, CheckCircle2, Clock, Compass } from 'lucide-react';
import ExpeditionCard from '@/components/cards/ExpeditionCard';
import { expeditions } from '@/data/expeditions';
import type { Region } from '@/types';

const regions: ('All' | Region)[] = ['All', 'Arctic', 'Antarctic', 'Southern Ocean', 'Sub-Antarctic'];
const statuses = ['All', 'completed', 'ongoing', 'planned'];

export default function Expeditions() {
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filtered = useMemo(() => {
    return [...expeditions]
      .filter(e => regionFilter === 'All' || e.region === regionFilter)
      .filter(e => statusFilter === 'All' || e.status === statusFilter)
      .sort((a, b) => b.year - a.year);
  }, [regionFilter, statusFilter]);

  const stats = {
    total: expeditions.length,
    arctic: expeditions.filter(e => e.region === 'Arctic').length,
    antarctic: expeditions.filter(e => e.region === 'Antarctic').length,
    ongoing: expeditions.filter(e => e.status === 'ongoing').length,
  };

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="pt-6 pb-2 border-b border-line">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Historical &amp; Active Field Campaigns
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mt-2">
                Indian Polar Science Expeditions
              </h1>
              <p className="text-xs sm:text-sm text-ink-light max-w-xl mt-1 leading-relaxed">
                Chronicle of scientific field voyages to Antarctica (Maitri &amp; Bharati stations), the Arctic (Himadri), and Southern Ocean cruises.
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white p-3 rounded border border-line text-center min-w-[90px] shadow-subtle">
                <div className="text-xl font-serif font-bold text-ink">{stats.arctic}</div>
                <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">Arctic</div>
              </div>
              <div className="bg-white p-3 rounded border border-line text-center min-w-[90px] shadow-subtle">
                <div className="text-xl font-serif font-bold text-ink">{stats.antarctic}</div>
                <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">Antarctic</div>
              </div>
              <div className="bg-white p-3 rounded border border-line text-center min-w-[90px] shadow-subtle">
                <div className="text-xl font-serif font-bold text-forest-700">{stats.ongoing}</div>
                <div className="text-[11px] text-forest-700 font-medium uppercase tracking-wider">Active</div>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded border border-line flex flex-col md:flex-row gap-5 shadow-subtle">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-2.5 flex items-center">
              <Map className="w-3.5 h-3.5 mr-1 text-forest-600"/> Region
            </h3>
            <div className="flex flex-wrap gap-2">
              {regions.map(r => (
                <button 
                  key={r} 
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    regionFilter === r 
                      ? 'bg-forest-600 text-white font-semibold shadow-xs' 
                      : 'bg-canvas-subtle text-ink-light hover:text-ink border border-line'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 md:border-l md:border-line md:pl-5">
            <h3 className="text-xs font-semibold text-ink-light uppercase tracking-wider mb-2.5 flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1 text-forest-600"/> Mission Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button 
                  key={s} 
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    statusFilter === s 
                      ? 'bg-forest-600 text-white font-semibold shadow-xs' 
                      : 'bg-canvas-subtle text-ink-light hover:text-ink border border-line'
                  }`}
                >
                  {s === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1 inline"/>}
                  {s === 'ongoing' && <Activity className="w-3 h-3 mr-1 inline"/>}
                  {s === 'planned' && <Clock className="w-3 h-3 mr-1 inline"/>}
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter & Grid */}
        <div className="text-xs text-ink-light">
          Showing <strong className="text-ink font-semibold">{filtered.length}</strong> expeditions
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-line rounded p-8 text-ink-light text-sm">
            No expeditions found matching the selected filters.
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((exp, i) => (
                <motion.div 
                  key={exp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: i * 0.03 }}
                >
                  <ExpeditionCard expedition={exp} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
