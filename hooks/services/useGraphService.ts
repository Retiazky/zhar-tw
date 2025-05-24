import {
  Challenge,
  Ember,
  SortChallengesField,
  SortDirection,
  SortEmbersField,
} from '@/types/challenge';
import { ofetch } from 'ofetch';

const api = ofetch.create({
  baseURL: process.env.EXPO_PUBLIC_GQL_URL,
});

type GetChallengeResponse = {
  data: {
    challengeById: Challenge;
  };
};

export default function useGraphService() {
  const getChallenge = async (id: string) => {
    const query = `query GetChallenge($id: String!) {
        challengeById(id: $id) {
          id
          blockNumber
          description
          expiration
          contract
          createdAt
          depositCount
          deposits {
            id
            amount
            blockNumber
            createdAt
            txHash
          }
          status
          updatedAt
          uri
          amount
          reward
          volume
          disputePeriod
          igniter {
            id
            createdAt
            blockNumber
            name
            updatedAt
          }
          zharrior {
            id
            createdAt
            blockNumber
            name
            updatedAt
          }
        }
      }`;
    try {
      const resp = await api<GetChallengeResponse>('/graphql', {
        method: 'POST',
        body: { query, operationName: 'GetChallenge', variables: { id } },
      });
      return resp.data.challengeById;
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
  const getChallenges = async (
    sortField: SortChallengesField,
    direction: SortDirection,
    address?: string,
  ) => {
    const query = `
    query GetChallenges ${address ? '($id: String!)' : ''} {
        challenges(orderBy: ${sortField}_${direction} ${address ? ', where: { status_eq: Active,zharrior: {id_eq: $id}, OR: {igniter: {id_eq: $id}} }' : ''}) {
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
                stoker {
                    id
                }
            }
            igniter {
                id
            }
            zharrior {
                id
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
        body: { query, operationName: 'GetChallenges', variables: { id: address?.toLowerCase() } },
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

  const getEmbers = async (sortField: SortEmbersField, direction: SortDirection) => {
    const query = `query GetEmbers {
            embers (orderBy: ${sortField}_${direction}, where: { name_isNull: false }) {
                id
                createdAt
                blockNumber
                name
                updatedAt
                ignited {
                    id
                }
                totalXp
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

  type GetEmberResponse = {
    data: {
      emberById: Ember;
    };
  };

  const getEmber = async (address: string) => {
    const query = `query GetEmber($address: String!) {
        emberById(id: $address) {
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
      const resp = await api<GetEmberResponse>('/graphql', {
        method: 'POST',
        body: { query, operationName: 'GetEmber', variables: { address: address.toLowerCase() } },
      });
      return resp.data.emberById;
    } catch (e) {
      console.error('Error fetching embers:', e);
      throw e;
    }
  };

  return {
    getChallenges,
    getChallenge,
    getEmbers,
    getEmber,
  };
}
