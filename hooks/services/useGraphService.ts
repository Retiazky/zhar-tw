import { Challenge, Ember } from '@/types/challenge';
import { ofetch } from 'ofetch';

const api = ofetch.create({
  baseURL: process.env.EXPO_PUBLIC_GQL_URL,
});

type GetChallengeResponse = {
  data: {
    challenge: Challenge;
  };
};

export default function useGraphService() {
  const getChallenge = async (id: string) => {
    const query = `query GetChallenge($id: String!) {
        challenge(id: $id) {
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
        }}`;
    try {
      const resp = await api<GetChallengeResponse>('/graphql', {
        method: 'POST',
        body: { query, operationName: 'GetChallenge', variables: { id } },
      });
      return resp.data.challenge;
    } catch (e) {
      console.error('Error fetching challenge:', e);
      throw e;
    }
  };

  interface GetChallengesResponse {
    data: {
      challenges: Challenge[];
    };
  }
  const getChallenges = async (active: boolean = false) => {
    const query = `
    query GetChallenges {
        challenges${active ? '(where: { status_eq: Active })' : ''} {
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
    }`;
    try {
      const resp = await api<GetChallengesResponse>('/graphql', {
        method: 'POST',
        body: { query, operationName: 'GetChallenges', variables: null },
      });
      return resp.data.challenges;
    } catch (e) {
      console.error('Error fetching challenges:', e);
      throw e;
    }
  };

  interface GetEmbersResponse {
    data: {
      embers: Ember[];
    };
  }

  const getEmbers = async () => {
    const query = `query GetEmbers {
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
      const resp = await api<GetEmbersResponse>('/graphql', {
        method: 'POST',
        body: { query, operationName: 'GetEmbers', variables: null },
      });
      return resp.data.embers;
    } catch (e) {
      console.error('Error fetching embers:', e);
      throw e;
    }
  };

  return {
    getChallenges,
    getChallenge,
    getEmbers,
  };
}
