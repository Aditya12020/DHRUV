import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Calendar, Users, Building, FileText, 
  Database, Image as ImageIcon, Video, CheckCircle2, Target
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { expeditions } from '@/data/expeditions';

export default function ExpeditionDetail() {
  const { id } = useParams<{ id: string }>();
  const expedition = expeditions.find(e => e.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'objectives' | 'findings' | 'resources'>('overview');

  if (!expedition) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center text-ink">
        <h2 className="text-xl font-serif font-bold text-ink mb-3">Expedition Record Not Found</h2>
        <Link to="/explore/expeditions" className="btn-secondary text-xs flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5"/> Return to Expeditions Catalog
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Mission Overview' },
    { id: 'objectives', label: 'Scientific Objectives' },
    { id: 'findings', label: 'Field Findings' },
    { id: 'resources', label: 'Archival Resources' },
  ] as const;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Header Masthead */}
      <div className="bg-canvas-subtle border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <Link to="/explore/expeditions" className="inline-flex items-center text-xs text-ink-light hover:text-ink mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Expeditions Archive {'>'} {expedition.shortName}
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="region">{expedition.region}</Badge>
                <Badge variant="status">{expedition.status}</Badge>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-line text-ink">
                  Year {expedition.year}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-ink mb-1.5 leading-tight">
                {expedition.name}
              </h1>
              <p className="text-base font-serif italic text-forest-700">{expedition.shortName}</p>
            </div>
            {expedition.coverImage && (
              <div className="hidden lg:block w-44 h-44 rounded overflow-hidden border border-line shadow-subtle shrink-0">
                <img src={expedition.coverImage} alt={expedition.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-line overflow-x-auto mb-8 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id 
                  ? 'border-forest-600 text-forest-700 bg-canvas-subtle/50' 
                  : 'border-transparent text-ink-light hover:text-ink hover:bg-canvas-subtle/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-line rounded p-6 shadow-subtle">
                  <h3 className="text-lg font-serif font-bold text-ink mb-3 pb-2 border-b border-line">Mission Narrative</h3>
                  <p className="text-xs sm:text-sm text-ink-light leading-relaxed">{expedition.description}</p>
                </div>
                
                {expedition.locations.length > 0 && (
                  <div className="bg-white border border-line rounded p-6 shadow-subtle">
                    <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-2 border-b border-line flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-forest-600" /> Geographic Coordinates &amp; Field Stations
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {expedition.locations.map((loc, i) => (
                        <div key={i} className="bg-canvas-subtle border border-line rounded p-3 text-xs">
                          <h4 className="font-semibold font-serif text-ink mb-0.5">{loc.name}</h4>
                          <p className="text-[11px] font-mono text-ink-faint mb-1.5">Lat: {loc.lat} | Lng: {loc.lng}</p>
                          {loc.description && <p className="text-xs text-ink-light">{loc.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="bg-white border border-line rounded p-6 shadow-subtle">
                  <h4 className="text-base font-serif font-bold text-ink mb-4 border-b border-line pb-2">Expedition Dossier</h4>
                  <div className="space-y-4 text-xs">
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 text-forest-600 mt-0.5 mr-2.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-ink-faint uppercase font-semibold">Duration</div>
                        <div className="font-medium text-ink">{expedition.duration}</div>
                        <div className="text-[11px] text-ink-light mt-0.5">{expedition.startDate} – {expedition.endDate}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="w-4 h-4 text-forest-600 mt-0.5 mr-2.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-ink-faint uppercase font-semibold">Scientific Contingent</div>
                        <div className="font-medium text-ink">{expedition.teamSize} Researchers</div>
                        <div className="text-[11px] text-ink-light mt-0.5">Leader: {expedition.leadResearcher}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Building className="w-4 h-4 text-forest-600 mt-0.5 mr-2.5 shrink-0" />
                      <div>
                        <div className="text-[11px] text-ink-faint uppercase font-semibold">Affiliated Institute</div>
                        <div className="font-medium text-ink">{expedition.institution}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {expedition.tags.map(tag => (
                    <span key={tag} className="tag text-[10px] bg-canvas-subtle text-ink-light border border-line">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div className="max-w-4xl bg-white border border-line rounded p-6 shadow-subtle">
              <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-2 border-b border-line flex items-center gap-2">
                <Target className="w-4 h-4 text-forest-600" /> Scientific Objectives
              </h3>
              <ul className="space-y-3">
                {expedition.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-3 p-3.5 rounded bg-canvas-subtle border border-line/70 text-xs">
                    <div className="w-6 h-6 rounded bg-forest-50 text-forest-700 border border-forest-200 flex items-center justify-center font-bold shrink-0 text-xs">
                      {i + 1}
                    </div>
                    <p className="text-ink leading-relaxed pt-0.5">{obj}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="max-w-4xl bg-white border border-line rounded p-6 shadow-subtle">
              <h3 className="text-lg font-serif font-bold text-ink mb-4 pb-2 border-b border-line">Field Findings &amp; Observations</h3>
              {expedition.findings.length > 0 ? (
                <div className="space-y-3">
                  {expedition.findings.map((finding, i) => (
                    <div key={i} className="flex items-start p-3.5 rounded bg-canvas-subtle border border-line/70 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-forest-600 mr-3 shrink-0 mt-0.5" />
                      <p className="text-ink leading-relaxed">{finding}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-ink-light italic py-4">Field findings for this campaign are currently being compiled into the repository.</p>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div>
              <h3 className="text-lg font-serif font-bold text-ink mb-4">Associated Scientific Records</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <Link to={`/explore/publications?expedition=${expedition.id}`}>
                  <div className="bg-white border border-line rounded p-5 h-full flex flex-col items-center text-center shadow-subtle hover:border-forest-400 transition-all">
                    <div className="w-12 h-12 rounded bg-canvas-subtle flex items-center justify-center mb-3 text-forest-700">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-ink mb-1">{expedition.publicationIds.length}</div>
                    <div className="text-xs text-ink-light font-medium">Publications</div>
                  </div>
                </Link>

                <Link to={`/explore/datasets?expedition=${expedition.id}`}>
                  <div className="bg-white border border-line rounded p-5 h-full flex flex-col items-center text-center shadow-subtle hover:border-forest-400 transition-all">
                    <div className="w-12 h-12 rounded bg-canvas-subtle flex items-center justify-center mb-3 text-forest-700">
                      <Database className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-ink mb-1">{expedition.datasetIds.length}</div>
                    <div className="text-xs text-ink-light font-medium">Datasets</div>
                  </div>
                </Link>

                <Link to={`/explore/photographs?expedition=${expedition.id}`}>
                  <div className="bg-white border border-line rounded p-5 h-full flex flex-col items-center text-center shadow-subtle hover:border-forest-400 transition-all">
                    <div className="w-12 h-12 rounded bg-canvas-subtle flex items-center justify-center mb-3 text-forest-700">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-ink mb-1">{expedition.photographIds.length}</div>
                    <div className="text-xs text-ink-light font-medium">Photographs</div>
                  </div>
                </Link>

                <Link to={`/explore/videos?expedition=${expedition.id}`}>
                  <div className="bg-white border border-line rounded p-5 h-full flex flex-col items-center text-center shadow-subtle hover:border-forest-400 transition-all">
                    <div className="w-12 h-12 rounded bg-canvas-subtle flex items-center justify-center mb-3 text-forest-700">
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-ink mb-1">{expedition.videoIds.length}</div>
                    <div className="text-xs text-ink-light font-medium">Videos</div>
                  </div>
                </Link>

              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
