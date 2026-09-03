import apiClient from '@/api/client';
import type { Researcher } from '@/types';

export const getResearchers = async (): Promise<Researcher[]> => {
  const res = await apiClient.get('/researchers', { params: { limit: 100 } });
  return res.data.data.researchers ?? [];
};

export const getResearcherById = async (id: string): Promise<Researcher | undefined> => {
  const res = await apiClient.get(`/researchers/${id}`);
  return res.data.data.researcher ?? undefined;
};
