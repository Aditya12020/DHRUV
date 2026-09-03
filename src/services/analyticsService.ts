import apiClient from '@/api/client';
import type { AnalyticsData } from '@/types';

// Fallback data when backend is not yet available
const FALLBACK: AnalyticsData = {
  publicationsByYear: [
    { year: 2020, count: 12 }, { year: 2021, count: 18 }, { year: 2022, count: 22 },
    { year: 2023, count: 28 }, { year: 2024, count: 35 },
  ],
  expeditionsByYear: [
    { year: 2020, count: 2 }, { year: 2021, count: 2 }, { year: 2022, count: 3 },
    { year: 2023, count: 3 }, { year: 2024, count: 4 },
  ],
  regionDistribution: [
    { region: 'Antarctic', count: 45 }, { region: 'Arctic', count: 28 },
    { region: 'Southern Ocean', count: 18 }, { region: 'Both', count: 9 },
  ],
  domainBreakdown: [
    { domain: 'Glaciology', count: 22 }, { domain: 'Atmospheric Science', count: 18 },
    { domain: 'Marine Biology', count: 15 }, { domain: 'Paleoceanography', count: 12 },
    { domain: 'Geocryology', count: 8 }, { domain: 'Geology', count: 7 },
    { domain: 'Biogeochemistry', count: 10 },
  ],
  institutionContributions: [
    { institution: 'NCPOR', publications: 78, datasets: 45 },
    { institution: 'IITM', publications: 12, datasets: 8 },
    { institution: 'INCOIS', publications: 10, datasets: 6 },
  ],
  datasetGrowth: [
    { year: 2020, cumulative: 25 }, { year: 2021, cumulative: 32 }, { year: 2022, cumulative: 41 },
    { year: 2023, cumulative: 52 }, { year: 2024, cumulative: 68 },
  ],
  resourceTypeDistribution: [
    { type: 'Publications', count: 89 }, { type: 'Datasets', count: 68 },
    { type: 'Photographs', count: 342 }, { type: 'Videos', count: 47 },
    { type: 'Expeditions', count: 24 },
  ],
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const res = await apiClient.get('/analytics/full');
    const a = res.data.data.analytics;
    return {
      publicationsByYear: a.publicationsByYear ?? FALLBACK.publicationsByYear,
      expeditionsByYear: a.expeditionsByYear ?? FALLBACK.expeditionsByYear,
      regionDistribution: a.regionDistribution ?? FALLBACK.regionDistribution,
      domainBreakdown: a.domainBreakdown ?? FALLBACK.domainBreakdown,
      institutionContributions: a.institutionContributions ?? FALLBACK.institutionContributions,
      datasetGrowth: FALLBACK.datasetGrowth,
      resourceTypeDistribution: a.resourceTypeDistribution ?? FALLBACK.resourceTypeDistribution,
    };
  } catch {
    return FALLBACK;
  }
}

export function getPublicationTrend() {
  return FALLBACK.publicationsByYear;
}

export function getRegionStats() {
  const total = FALLBACK.regionDistribution.reduce((s, r) => s + r.count, 0);
  return FALLBACK.regionDistribution.map((r) => ({
    ...r,
    percentage: Math.round((r.count / total) * 100),
  }));
}

export function getTopInstitutions() {
  return FALLBACK.institutionContributions
    .map((i) => ({ ...i, total: i.publications + i.datasets }))
    .sort((a, b) => b.total - a.total);
}
