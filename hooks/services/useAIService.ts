import { ofetch } from 'ofetch';

const api = ofetch.create({
  baseURL: process.env.EXPO_PUBLIC_AI_URL,
});

type GetScoreResponse = {
  score: number;
};

export function useAIService() {
  const getScore = async (situation: string) => {
    const resp = await api<GetScoreResponse>('/score', {
      method: 'POST',
      body: { situation },
    });
    return resp.score;
  };

  return {
    getScore,
  };
}
