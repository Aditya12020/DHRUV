import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map, Calendar, FolderOpen, Image as ImageIcon, Video, BookOpen, Layers } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';
import Badge from '@/components/ui/Badge';
import ExpeditionCard from '@/components/cards/ExpeditionCard';
import PublicationCard from '@/components/cards/PublicationCard';
import DatasetCard from '@/components/cards/DatasetCard';
import PhotoCard from '@/components/cards/PhotoCard';
import VideoCard from '@/components/cards/VideoCard';
import { expeditions } from '@/data/expeditions';
import { publications } from '@/data/publications';
import { datasets } from '@/data/datasets';
import { photographs } from '@/data/photographs';
import { videos } from '@/data/videos';

const tabs = [
  { id: 'all', label: 'All Collections', icon: <Layers className="w-3.5 h-3.5 mr-1.5" /> },
  { id: 'expeditions', label: 'Expeditions', icon: <Map className="w-3.5 h-3.5 mr-1.5" /> },
  { id: 'publications', label: 'Publications', icon: <BookOpen className="w-3.5 h-3.5 mr-1.5" /> },
  { id: 'datasets', label: 'Datasets', icon: <FolderOpen className="w-3.5 h-3.5 mr-1.5" /> },
  { id: 'photographs', label: 'Photographs', icon: <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> },
  { id: 'videos', label: 'Media & Videos', icon: <Video className="w-3.5 h-3.5 mr-1.5" /> }
];

const regions = ['All', 'Arctic', 'Antarctic', 'Southern Ocean'];
const currentYear = new Date().getFullYear();
const years = ['All', ...Array.from({ length: 15 }, (_, i) => (currentYear - i).toString())];

export default function Repository() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [region, setRegion] = useState('All');
  const [year, setYear] = useState('All');

  const filteredExpeditions = useMemo(() => {
    return expeditions.filter(e => {
      const matchQuery = e.name.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase());
      const matchRegion = region === 'All' || e.region === region;
      const matchYear = year === 'All' || e.year.toString() === year;
      return matchQuery && matchRegion && matchYear;
    });
  }, [query, region, year]);

  const filteredPublications = useMemo(() => {
    return publications.filter(p => {
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.abstract.toLowerCase().includes(query.toLowerCase());
      const matchRegion = region === 'All' || p.region === region;
      const matchYear = year === 'All' || p.year.toString() === year;
      return matchQuery && matchRegion && matchYear;
    });
  }, [query, region, year]);

  const filteredDatasets = useMemo(() => {
    return datasets.filter(d => {
      const matchQuery = d.title.toLowerCase().includes(query.toLowerCase()) || d.description.toLowerCase().includes(query.toLowerCase());
      const matchRegion = region === 'All' || d.region === region;
      const matchYear = year === 'All' || d.startDate.includes(year) || d.endDate.includes(year);
      return matchQuery && matchRegion && matchYear;
    });
  }, [query, region, year]);

  const filteredPhotographs = useMemo(() => {
    return photographs.filter(p => {
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
      const matchRegion = region === 'All' || p.region === region;
      const matchYear = year === 'All' || p.date.includes(year);
      return matchQuery && matchRegion && matchYear;
    });
  }, [query, region, year]);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchQuery = v.title.toLowerCase().includes(query.toLowerCase()) || v.description.toLowerCase().includes(query.toLowerCase());
      const matchRegion = region === 'All' || v.region === region;
      const matchYear = year === 'All' || v.date.includes(year);
      return matchQuery && matchRegion && matchYear;
    });
  }, [query, region, year]);

  const allCount = filteredExpeditions.length + filteredPublications.length + filteredDatasets.length + filteredPhotographs.length + filteredVideos.length;

  const renderEmptyState = () => (
    <div className="py-16 text-center flex flex-col items-center bg-white border border-line rounded p-8">
      <Search className="w-10 h-10 text-ink-faint mb-3" />
      <h3 className="text-base font-serif font-bold text-ink">No items found</h3>
      <p className="text-xs text-ink-light mt-1 max-w-sm">
        Please adjust your query or active filters to search across other polar categories.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas text-ink p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <header className="text-center space-y-2 pt-6 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200">
            NCPOR Master Catalog
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink">
            Polar Science Knowledge Repository
          </h1>
          <p className="text-xs sm:text-sm text-ink-light max-w-2xl mx-auto leading-relaxed">
            Multi-decade inventory of verified expedition reports, peer-reviewed publications, cryospheric datasets, and multimedia archives.
          </p>
        </header>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <SearchBar 
            value={query} 
            onChange={setQuery} 
            placeholder="Search across all repository resources..." 
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1 border-b border-line pb-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-forest-600 text-white font-semibold shadow-xs'
                  : 'text-ink-light hover:text-ink hover:bg-canvas-subtle'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-3.5 rounded border border-line shadow-subtle">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-ink-light flex items-center"><Map className="w-3.5 h-3.5 mr-1 text-forest-600"/> Region:</span>
            {regions.map(r => (
              <button 
                key={r} 
                onClick={() => setRegion(r)}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                  region === r
                    ? 'bg-forest-50 text-forest-700 font-semibold border border-forest-200'
                    : 'bg-canvas-subtle text-ink-light hover:text-ink border border-line'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-light flex items-center"><Calendar className="w-3.5 h-3.5 mr-1 text-forest-600"/> Year:</span>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              className="bg-canvas-subtle border border-line rounded px-2.5 py-1 text-xs text-ink focus:border-forest-600 outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div>
          <div className="text-xs text-ink-light mb-6">
            Showing <strong className="text-ink font-semibold">{activeTab === 'all' ? allCount : 
                     activeTab === 'expeditions' ? filteredExpeditions.length :
                     activeTab === 'publications' ? filteredPublications.length :
                     activeTab === 'datasets' ? filteredDatasets.length :
                     activeTab === 'photographs' ? filteredPhotographs.length :
                     filteredVideos.length}</strong> catalogued items
          </div>

          {activeTab === 'all' && allCount === 0 && renderEmptyState()}

          <AnimatePresence mode="popLayout">
            <motion.div layout className="space-y-10">
              
              {(activeTab === 'all' || activeTab === 'expeditions') && filteredExpeditions.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                      <h3 className="text-base font-serif font-bold text-ink flex items-center"><Map className="w-4 h-4 mr-1.5 text-forest-600"/> Expeditions</h3>
                      <button onClick={() => setActiveTab('expeditions')} className="text-xs text-forest-700 hover:underline">View all &rarr;</button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredExpeditions.slice(0, activeTab === 'all' ? 3 : undefined).map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <ExpeditionCard expedition={item} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {(activeTab === 'all' || activeTab === 'publications') && filteredPublications.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                      <h3 className="text-base font-serif font-bold text-ink flex items-center"><BookOpen className="w-4 h-4 mr-1.5 text-forest-600"/> Publications</h3>
                      <button onClick={() => setActiveTab('publications')} className="text-xs text-forest-700 hover:underline">View all &rarr;</button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredPublications.slice(0, activeTab === 'all' ? 3 : undefined).map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <PublicationCard publication={item} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {(activeTab === 'all' || activeTab === 'datasets') && filteredDatasets.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                      <h3 className="text-base font-serif font-bold text-ink flex items-center"><FolderOpen className="w-4 h-4 mr-1.5 text-forest-600"/> Datasets</h3>
                      <button onClick={() => setActiveTab('datasets')} className="text-xs text-forest-700 hover:underline">View all &rarr;</button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDatasets.slice(0, activeTab === 'all' ? 3 : undefined).map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <DatasetCard dataset={item} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {(activeTab === 'all' || activeTab === 'photographs') && filteredPhotographs.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                      <h3 className="text-base font-serif font-bold text-ink flex items-center"><ImageIcon className="w-4 h-4 mr-1.5 text-forest-600"/> Photographs</h3>
                      <button onClick={() => setActiveTab('photographs')} className="text-xs text-forest-700 hover:underline">View all &rarr;</button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPhotographs.slice(0, activeTab === 'all' ? 4 : undefined).map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <PhotoCard photo={item} onClick={() => {}} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {(activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
                <section>
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
                      <h3 className="text-base font-serif font-bold text-ink flex items-center"><Video className="w-4 h-4 mr-1.5 text-forest-600"/> Media &amp; Videos</h3>
                      <button onClick={() => setActiveTab('videos')} className="text-xs text-forest-700 hover:underline">View all &rarr;</button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredVideos.slice(0, activeTab === 'all' ? 3 : undefined).map((item, i) => (
                      <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <VideoCard video={item} onClick={() => {}} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
