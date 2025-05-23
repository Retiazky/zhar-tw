import { Challenge, Ember } from '@/types/challenge';
import { ofetch } from 'ofetch';

const api = ofetch.create({
  baseURL: process.env.EXPO_PUBLIC_GQL_URL,
});

interface GraphResponse {
  data: {
    challenges: Challenge[];
    embers: Ember[];
  };
}

export default function useGraphService() {
  const getChallenges = async () => {
    const query = `query GetChallenges {
    challenges {
        id
        amount
        blockNumber
        description
        contract
        expiration
        createdAt
        depositCount
        deposits {
        amount
        blockNumber
        createdAt
        id
        txHash
        }
        status
        updatedAt
        uri
        volume
    }
    embers {
        id
        createdAt
        blockNumber
        name
        updatedAt
        ignited {
            id
        }
    }
    }`;
    try {
      const resp = await api<GraphResponse>('/graphql', {
        method: 'POST',
        body: { query, operationName: 'GetChallenges', variables: null },
      });
      return resp.data;
    } catch (e) {
      console.error('Error fetching challenges:', e);
      throw e;
    }
  };

  return {
    getChallenges,
  };
}
