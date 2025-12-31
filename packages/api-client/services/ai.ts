import axios from 'axios';

const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:4001';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  success: boolean;
}

export interface MissionSuggestion {
  title: string;
  description: string;
  type: string;
  xp: number;
}

export const aiService = {
  chat: async (
    message: string,
    history: ChatMessage[] = [],
    organizationId?: string,
    userId?: string
  ): Promise<ChatResponse> => {
    const response = await axios.post(`${AI_BASE_URL}/ai/chat`, {
      message,
      history,
      organizationId: organizationId || 'org_default',
      userId: userId || 'user_default',
    });
    return response.data;
  },

  chatStream: async (
    message: string,
    history: ChatMessage[] = [],
    onChunk: (chunk: string) => void,
    organizationId?: string,
    userId?: string
  ): Promise<void> => {
    const response = await fetch(`${AI_BASE_URL}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        organizationId: organizationId || 'org_default',
        userId: userId || 'user_default',
      }),
    });

    if (!response.ok) {
      throw new Error('Stream request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  },

  suggestMissions: async (organizationId?: string): Promise<MissionSuggestion[]> => {
    const response = await axios.post(`${AI_BASE_URL}/ai/missions/suggest`, {
      organizationId: organizationId || 'org_default',
    });
    return response.data.suggestions;
  },

  analyzeMetric: async (metric: string, organizationId?: string): Promise<string> => {
    const response = await axios.post(`${AI_BASE_URL}/ai/analytics/analyze`, {
      metric,
      organizationId: organizationId || 'org_default',
    });
    return response.data.analysis;
  },
};
