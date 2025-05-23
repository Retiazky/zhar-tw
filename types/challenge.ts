export interface Ignited {
  id: string;
}

export interface Ember {
  id: string;
  createdAt: string;
  blockNumber: number;
  name: string;
  updatedAt: string;
  ignited: Ignited;
}

export interface Deposit {
  amount: number;
  blockNumber: number;
  createdAt: string;
  id: string;
  txHash: string;
}
export type ChallengeStatus =
  | 'Active'
  | 'ProofSubmitted'
  | 'ValidationByOracle'
  | 'Completed'
  | 'Expired'
  | 'Failed';

export type ProfileChallengeStatus = 'ignited' | 'stoked' | 'active' | 'completed';

export interface Challenge {
  id: string;
  amount: number;
  blockNumber: number;
  description: string;
  expiration: string;
  contract: string;
  createdAt: string;
  depositCount: number;
  deposits: Deposit[];
  status: ChallengeStatus;
  updatedAt: string;
  uri: string;
  volume: bigint;
}
