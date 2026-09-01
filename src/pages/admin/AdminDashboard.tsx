import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FlaskConical, BookOpen, Database, Camera, Video, Users, CheckCircle, UserPlus, AlertCircle, Download } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const stats = [
    { label: 'Expeditions Catalogued', count: 124, icon: FlaskConical },
    { label: 'Verified Publications', count: 680, icon: BookOpen },
    { label: 'Observational Datasets', count: 210, icon: Database },
    { label: 'Archival Photographs', count: 4800, icon: Camera },
    { label: 'Documentary Videos', count: 300, icon: Video },
    { label: 'Active Researchers', count: 94, icon: Users },
  ];

  const recentActivities = [
    { id: 1, text: 'New publication submitted: East Antarctic Ice Core Study', icon: BookOpen, time: '2 hours ago' },
    { id: 2, text: 'Dataset DS-009 uploaded: Prydz Bay CTD Profiling', icon: Database, time: '4 hours ago' },
    { id: 3, text: 'ISEA-44 expedition report verified', icon: CheckCircle, time: 'Yesterday' },
    { id: 4, text: 'New researcher registration: NCPOR Polar Cryosphere Lab', icon: UserPlus, time: 'Yesterday' },
    { id: 5, text: 'Photograph batch uploaded (15 images): Bharati Station', icon: Camera, time: '2 days ago' },
    { id: 6, text: 'New video: 43rd Indian Antarctic Expedition Documentary', icon: Video, time: '3 days ago' },
    { id: 7, text: 'Publication revised by author: Southern Ocean Biogeochemistry', icon: AlertCircle, time: '4 days ago' },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 text-ink p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-line p-6 rounded shadow-subtle">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
            NCPOR Administration
          </span>
          <h1 className="text-2xl font-serif font-bold text-ink mt-1">Welcome back, {user?.name || 'Administrator'}</h1>
          <p className="text-xs text-ink-light mt-0.5">{currentDate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Add Expedition', 'Add Publication', 'Upload Dataset', 'Upload Media'].map(action => (
            <button 
              key={action}
              onClick={() => alert(`${action} module available in administrative registry.`)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white border border-line p-4 rounded flex items-center gap-3.5 shadow-subtle">
              <div className="p-2.5 bg-canvas-subtle rounded text-forest-700 border border-line">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-serif font-bold text-ink">{stat.count}</div>
                <div className="text-[11px] text-ink-light font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activities & Status Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-line rounded p-6 shadow-subtle">
          <h2 className="text-base font-serif font-bold text-ink mb-4 pb-2 border-b border-line">Recent Administrative Log</h2>
          <div className="space-y-3 divide-y divide-line/70">
            {recentActivities.map(activity => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-3 pt-2.5 first:pt-0">
                  <div className="p-1.5 rounded bg-canvas-subtle text-forest-700 shrink-0 border border-line/60">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink truncate">{activity.text}</p>
                  </div>
                  <span className="text-[11px] text-ink-faint shrink-0 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-line rounded p-6 shadow-subtle">
          <h2 className="text-base font-serif font-bold text-ink mb-4 pb-2 border-b border-line">Repository Status Summary</h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-medium">Verified &amp; Public</span>
                <span className="text-forest-700 font-semibold">82%</span>
              </div>
              <div className="h-1.5 w-full bg-canvas-subtle rounded-full overflow-hidden border border-line">
                <div className="h-full bg-forest-600 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-medium">In Verification Queue</span>
                <span className="text-amber-800 font-semibold">12%</span>
              </div>
              <div className="h-1.5 w-full bg-canvas-subtle rounded-full overflow-hidden border border-line">
                <div className="h-full bg-amber-600 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-ink font-medium">Revisions In Progress</span>
                <span className="text-red-700 font-semibold">6%</span>
              </div>
              <div className="h-1.5 w-full bg-canvas-subtle rounded-full overflow-hidden border border-line">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
