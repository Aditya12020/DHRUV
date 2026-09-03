import apiClient from '@/api/client';
import type { Dataset, SearchFilters } from '@/types';

export const getDatasets = async (): Promise<Dataset[]> => {
  const res = await apiClient.get('/datasets', { params: { limit: 100 } });
  return res.data.data.datasets ?? [];
};

export const getDatasetById = async (id: string): Promise<Dataset | undefined> => {
  const res = await apiClient.get(`/datasets/${id}`);
  return res.data.data.dataset ?? undefined;
};

export const searchDatasets = async (query: string, filters?: Partial<SearchFilters>): Promise<Dataset[]> => {
  const res = await apiClient.get('/datasets/search', {
    params: { q: query, region: filters?.region, domain: filters?.domain },
  });
  return res.data.data.datasets ?? [];
};
