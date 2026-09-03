import apiClient from '@/api/client';
import type { Photograph, Video } from '@/types';

export const getPhotographs = async (): Promise<Photograph[]> => {
  const res = await apiClient.get('/photographs', { params: { limit: 100 } });
  return res.data.data.photographs ?? [];
};

export const getVideos = async (): Promise<Video[]> => {
  const res = await apiClient.get('/videos', { params: { limit: 100 } });
  return res.data.data.videos ?? [];
};

export const getPhotographById = async (id: string): Promise<Photograph | undefined> => {
  const res = await apiClient.get(`/photographs/${id}`);
  return res.data.data.photograph ?? undefined;
};

export const getVideoById = async (id: string): Promise<Video | undefined> => {
  const res = await apiClient.get(`/videos/${id}`);
  return res.data.data.video ?? undefined;
};
