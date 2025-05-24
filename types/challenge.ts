export type SortEmbersField = 'totalXp' | 'createdAt';
export type SortChallengesField = 'createdAt' | 'volume';
export type SortDirection = 'ASC' | 'DESC';

export type SortFieldOption<T> = {
  key: T;
  label: string;
};

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
  totalXp: bigint; // total XP earned by the ember
}

export interface Deposit {
  id: string;
  amount: number;
  blockNumber: number;
  createdAt: string;
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
  reward: number; // how many % goes to the zharrior (eg 7000 = 70%)
  volume: bigint; // total amount staked in the challenge
  disputePeriod: string; // in seconds
  igniter: Ember;
  zharrior: Ember;
}
