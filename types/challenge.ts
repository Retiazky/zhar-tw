export interface Challenge {
  id: string;
  title: string;
  description: string;
  fulfilled: boolean;
  creator: string;
  solver: string;
  xp: number;
  staked: number;
  createdAt: Date;
  expiresAt: Date;
}
