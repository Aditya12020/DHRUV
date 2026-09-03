import apiClient from '@/api/client';
import type { Expedition, SearchFilters } from '@/types';

export const expeditionService = {
  getAll: async (params?: Partial<SearchFilters>): Promise<{ expeditions: Expedition[]; meta: object }> => {
    const res = await apiClient.get('/expeditions', { params });
    return res.data.data;
  },

  getById: async (id: string): Promise<Expedition | null> => {
    const res = await apiClient.get(`/expeditions/${id}`);
    return res.data.data.expedition ?? null;
  },

  search: async (filters: Partial<SearchFilters>): Promise<Expedition[]> => {
    const params = { q: filters.query, region: filters.region, year: filters.year };
    const res = await apiClient.get('/expeditions/search', { params });
    return res.data.data.expeditions ?? [];
  },

  getFeatured: async (): Promise<Expedition[]> => {
    const res = await apiClient.get('/expeditions/featured');
    return res.data.data.expeditions ?? [];
  },
};
