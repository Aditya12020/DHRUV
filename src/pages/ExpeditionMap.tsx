import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ExpeditionMarker, { Expedition } from '@/components/map/ExpeditionMarker';
// import { expeditions } from '@/data/expeditions';

// Mocking expeditions data as requested since it's an external import
const expeditions: Expedition[] = [
  {
    id: 'exp-2024-ant',
    name: 'Indian Scientific Expedition to Antarctica 43',
    shortName: 'ISEA-43',
    year: 2024,
    region: 'Antarctic',
    description: '43rd scientific expedition to Antarctica focusing on glaciology and atmospheric sciences.',
    objectives: ['Ice core drilling', 'Aerosol measurements'],
    teamSize: 45,
    duration: '6 months',
    startDate: '2023-11-01',
    endDate: '2024-05-01',
    leadResearcher: 'Dr. Pavan Chandan',
    researchers: ['Dr. Pavan Chandan'],
    institution: 'NCPOR',
    locations: [{ name: 'Bharati Station', lat: -69.408, lng: 76.195 }],
    findings: ['Lambert Glacier 12% Faster'],
    tags: ['glaciology'],
    status: 'ongoing'
  },
  {
    id: 'exp-2023-arc',
    name: 'Indian Arctic Expedition 14',
    shortName: 'IAE-14',
    year: 2023,
    region: 'Arctic',
    description: '14th scientific expedition to the Arctic focusing on permafrost.',
    objectives: ['Permafrost monitoring', 'Marine biology'],
    teamSize: 20,
    duration: '2 months',
    startDate: '2023-06-01',
    endDate: '2023-08-01',
    leadResearcher: 'Dr. Anjali Sinha',
    researchers: ['Dr. Anjali Sinha'],
    institution: 'NCPOR',
    locations: [{ name: 'Himadri Station', lat: 78.922, lng: 11.928 }],
    findings: ['Permafrost 18cm thicker active layer'],
    tags: ['permafrost'],
    status: 'completed'
  },
];

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ExpeditionMap: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<'All' | 'Arctic' | 'Antarctic' | 'Southern Ocean'>('All');

  const filteredExpeditions = expeditions.filter(exp => 
    regionFilter === 'All' ? true : exp.region === regionFilter
  );

  return (
    <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden bg-navy-950">
      {/* Sidebar */}
      <div className="hidden md:flex w-72 flex-col bg-navy-900 border-r border-polar-border p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Expeditions</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Arctic', 'Antarctic', 'Southern Ocean'].map((region) => (
            <button
              key={region}
              onClick={() => setRegionFilter(region as any)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                regionFilter === region 
                  ? 'bg-ice-600/30 border-ice-400 text-ice-400' 
                  : 'bg-polar-surface border-polar-border text-slate-300 hover:bg-polar-surface/80'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-2 flex-1">
          {filteredExpeditions.map(exp => (
            <div
              key={exp.id}
              onClick={() => setSelectedId(exp.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors border-l-2 ${
                selectedId === exp.id 
                  ? 'bg-ice-600/20 border-ice-400' 
                  : 'bg-polar-surface border-transparent hover:bg-polar-surface/80'
              }`}
            >
              <div className="text-sm font-semibold text-white">{exp.shortName}</div>
              <div className="text-xs text-slate-400">{exp.year} • {exp.region}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {filteredExpeditions.map(exp => (
            <ExpeditionMarker 
              key={exp.id} 
              expedition={exp} 
              isSelected={selectedId === exp.id} 
            />
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-[400] bg-navy-900 border border-polar-border rounded-lg p-3 shadow-lg">
          <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Regions</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22d3ee]"></div>
              <span className="text-sm text-slate-300">Arctic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-sm text-slate-300">Antarctic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
              <span className="text-sm text-slate-300">Southern Ocean</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpeditionMap;
