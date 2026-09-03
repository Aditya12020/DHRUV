import apiClient from '@/api/client';
import type { OutreachContent, OutreachContentType, AudienceMode, ResourceType, ContentClaim } from '@/types';

export const generateOutreachContent = async (
  sourceId: string,
  sourceType: ResourceType,
  audience: AudienceMode,
  contentType: OutreachContentType
): Promise<OutreachContent> => {
  const res = await apiClient.post('/ai/outreach', { sourceId, sourceType, audience, contentType });
  return res.data.data.outreachContent as OutreachContent;
};

export const verifyContent = async (contentId: string): Promise<ContentClaim[]> => {
  const res = await apiClient.post(`/ai/outreach/${contentId}/verify`);
  return res.data.data.claims as ContentClaim[];
};
