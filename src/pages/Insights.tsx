import React from 'react';
import { motion } from 'framer-motion';
import { analyticsData } from '@/data/analytics';
import { useTheme } from '@/context/ThemeContext';
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  Bar,
  Line,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Globe2, Building2 } from 'lucide-react';

export default function Insights() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const totalPubs = analyticsData.publicationsByYear.reduce((acc, curr) => acc + curr.count, 0);
  const totalExp = analyticsData.expeditionsByYear.reduce((acc, curr) => acc + curr.count, 0);

  // Dynamic contrast-aware chart configuration
  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDark ? '#211F1B' : '#FFFFFF',
      border: isDark ? '1px solid #3A3730' : '1px solid #D9D6CF',
      borderRadius: '6px',
      color: isDark ? '#F3F1EA' : '#252525',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    },
    itemStyle: {
      color: isDark ? '#8DAA9B' : '#24463A',
      fontWeight: 600,
    }
  };

  const gridStroke = isDark ? '#3A3730' : '#E8E5DE';
  const axisStroke = isDark ? '#B7B3AA' : '#66635F';
  const primaryChartColor = isDark ? '#6F9A87' : '#24463A';
  const secondaryChartColor = isDark ? '#87969B' : '#71808A';
  const accentWarmColor = isDark ? '#A99476' : '#B7A68A';

  const PIE_COLORS: Record<string, string> = {
    'Arctic': isDark ? '#6F9A87' : '#24463A',
    'Antarctic': isDark ? '#8DAA9B' : '#466657',
    'Southern Ocean': isDark ? '#87969B' : '#71808A',
    'Both': isDark ? '#A99476' : '#B7A68A',
    'Sub-Antarctic': isDark ? '#78756D' : '#66635F'
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-ink space-y-6">
      {/* Header */}
      <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="border-b border-line pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200 inline-flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics &amp; Bibliometrics
        </span>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink mt-2">
          Polar Research Analytics &amp; Trends
        </h1>
        <p className="text-xs sm:text-sm text-ink-light mt-0.5">
          Observational growth metrics, disciplinary distribution, and multi-institutional output across 40+ years of polar exploration.
        </p>
      </motion.div>

      {/* KPI Cards (Selective Highlighting) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Verified Publications', value: totalPubs.toLocaleString(), sub: 'Peer-reviewed articles' },
          { label: 'Missions Catalogued', value: totalExp.toLocaleString(), sub: 'Antarctic, Arctic & Ocean' },
          { label: 'Open Datasets', value: '210+', sub: 'Calibrated time-series' },
          { label: 'Partner Institutions', value: '38', sub: 'National & Global' }
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            initial={{opacity: 0, y: 10}} 
            animate={{opacity: 1, y: 0}} 
            transition={{delay: idx * 0.05}}
            className="bg-white border border-line rounded p-4 shadow-subtle hover:border-forest-400 transition-colors"
          >
            <div className="text-[11px] text-ink-light font-semibold uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className="text-2xl font-serif font-bold text-forest-700">{kpi.value}</div>
            <div className="text-[11px] text-ink-faint mt-0.5">{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section 
          initial={{opacity: 0, y: 15}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.4}} 
          className="bg-white border border-line rounded p-5 sm:p-6 shadow-subtle flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
            <h2 className="text-base font-serif font-bold text-ink flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-forest-600" />
              Scientific Publications Output by Year
            </h2>
            <span className="text-[11px] font-mono text-ink-faint">Annual Volume</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.publicationsByYear} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pubGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryChartColor} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={primaryChartColor} stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis dataKey="year" stroke={axisStroke} tick={{fill: axisStroke, fontSize: 11}} tickMargin={8} />
                <YAxis stroke={axisStroke} tick={{fill: axisStroke, fontSize: 11}} />
                <Tooltip {...tooltipStyle}/>
                <Area type="monotone" dataKey="count" stroke={primaryChartColor} strokeWidth={2} fill="url(#pubGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section 
          initial={{opacity: 0, y: 15}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.4, delay: 0.05}} 
          className="bg-white border border-line rounded p-5 sm:p-6 shadow-subtle flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
            <h2 className="text-base font-serif font-bold text-ink flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-forest-600" />
              Regional Mission Distribution
            </h2>
            <span className="text-[11px] font-mono text-ink-faint">Geographic Share</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={analyticsData.regionDistribution} 
                  cx="50%" 
                  cy="45%" 
                  innerRadius={60} 
                  outerRadius={90} 
                  paddingAngle={4} 
                  dataKey="count"
                >
                  {analyticsData.regionDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PIE_COLORS[entry.region] || primaryChartColor} 
                      stroke={isDark ? '#211F1B' : '#FFFFFF'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend 
                  verticalAlign="bottom" 
                  height={32} 
                  iconType="circle" 
                  wrapperStyle={{ fontSize: '11px', color: axisStroke, paddingTop: '10px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.section 
          initial={{opacity: 0, y: 15}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.4, delay: 0.1}} 
          className="bg-white border border-line rounded p-5 sm:p-6 shadow-subtle"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-line">
            <h2 className="text-base font-serif font-bold text-ink">
              Publications by Scientific Domain
            </h2>
            <span className="text-[11px] font-mono text-ink-faint">Disciplines</span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.domainBreakdown} layout="vertical" margin={{left: 30, right: 15, top: 5, bottom: 5}}>
                <CartesianGrid stroke={gridStroke} horizontal={false} strokeDasharray="3 3"/>
                <XAxis type="number" stroke={axisStroke} tick={{fill: axisStroke, fontSize: 11}} />
                <YAxis type="category" dataKey="domain" stroke={axisStroke} width={110} tick={{fill: axisStroke, fontSize: 11}} />
                <Tooltip {...tooltipStyle} cursor={{fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="count" fill={primaryChartColor} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section 
          initial={{opacity: 0, y: 15}} 
          animate={{opacity: 1, y: 0}} 
          transition={{duration: 0.4, delay: 0.15}} 
          className="bg-white border border-line rounded p-5 sm:p-6 shadow-subtle flex flex-col justify-between gap-5"
        >
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
              <h2 className="text-base font-serif font-bold text-ink">
                Cumulative Dataset Acquisition
              </h2>
              <span className="text-[11px] font-mono text-ink-faint">Growth Trend</span>
            </div>
            <div className="w-full h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.datasetGrowth} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3"/>
                  <XAxis dataKey="year" stroke={axisStroke} tick={{fill: axisStroke, fontSize: 10}} />
                  <YAxis stroke={axisStroke} tick={{fill: axisStroke, fontSize: 10}} />
                  <Tooltip {...tooltipStyle}/>
                  <Line type="monotone" dataKey="cumulative" stroke={secondaryChartColor} strokeWidth={2.5} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-line">
              <h2 className="text-base font-serif font-bold text-ink flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-forest-600" />
                Institutional Activity Profile
              </h2>
              <span className="text-[11px] font-mono text-ink-faint">Contributions</span>
            </div>
            <div className="w-full h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.institutionContributions} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3"/>
                  <XAxis dataKey="institution" stroke={axisStroke} tick={{fill: axisStroke, fontSize: 10}} />
                  <YAxis stroke={axisStroke} tick={{fill: axisStroke, fontSize: 10}} />
                  <Tooltip {...tooltipStyle} cursor={{fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}} />
                  <Bar dataKey="publications" fill={primaryChartColor} stackId="a" />
                  <Bar dataKey="datasets" fill={accentWarmColor} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
