import { zharChallengesContract } from '@/constants/thirdweb';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { readContract } from 'thirdweb';
import { zeroAddress } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIfRegistered = async (address: string) => {
  console.log('Checking if registered for address:', address);
  const [add, name, uri, isActive, totalChallengesCompleted] = await readContract({
    contract: zharChallengesContract,
    method: 'creators',
    params: [address],
  });
  if (add !== zeroAddress || name || uri || isActive || totalChallengesCompleted) {
    console.log('Address is registered!');
    return true;
  }
  console.log('Address is not registered.');
  return false;
};
