import apiClient from '@/api/client';
import type { Publication, SearchFilters } from '@/types';

export const getPublications = async (): Promise<Publication[]> => {
  const res = await apiClient.get('/publications', { params: { limit: 100 } });
  return res.data.data.publications ?? [];
};

export const getPublicationById = async (id: string): Promise<Publication | undefined> => {
  const res = await apiClient.get(`/publications/${id}`);
  return res.data.data.publication ?? undefined;
};

export const searchPublications = async (query: string, filters?: Partial<SearchFilters>): Promise<Publication[]> => {
  const res = await apiClient.get('/publications/search', {
    params: { q: query, region: filters?.region, year: filters?.year, domain: filters?.domain },
  });
  return res.data.data.publications ?? [];
};
