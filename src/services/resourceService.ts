import apiClient from '@/api/client';
import type { SearchFilters, SearchResult } from '@/types';

export const resourceService = {
  search: async (filters: SearchFilters): Promise<SearchResult> => {
    const res = await apiClient.get('/search', {
      params: { q: filters.query, region: filters.region, year: filters.year, type: filters.type },
    });
    return res.data.data as SearchResult;
  },
};
