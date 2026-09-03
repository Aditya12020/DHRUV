import apiClient from '@/api/client';
import type { AIMessage, AISource, AudienceMode } from '@/types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const aiService = {
  sendMessage: async (
    question: string,
    mode: AudienceMode = 'researcher'
  ): Promise<AIMessage> => {
    const res = await apiClient.post('/ai/ask', { question, audienceMode: mode });
    const { answer, sources, suggestedQuestions } = res.data.data;

    const mappedSources: AISource[] = (sources ?? []).map((s: AISource) => ({
      id: s.id ?? generateId(),
      title: s.title,
      type: s.type,
      snippet: s.snippet,
      relevanceScore: s.relevanceScore ?? 0.85,
      url: s.url,
    }));

    return {
      id: generateId(),
      role: 'assistant',
      content: answer,
      sources: mappedSources,
      suggestedQuestions: suggestedQuestions ?? [],
      timestamp: new Date(),
      audienceMode: mode,
    };
  },
};
