import { Text } from '@/components/ui/text';
import { ChallengeStatus } from '@/types/challenge';
import { router } from 'expo-router';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { formatEther } from 'viem';
import CountdownTimer from './CountdownTimer';

type Props = {
  id: string;
  title: string;
  xp: bigint;
  staked: bigint;
  status: ChallengeStatus;
  expiresAt: Date;
  type?: 'ember' | 'igniter' | 'zharrior';
};
const ChallengeCard: React.FC<Props> = ({
  id,
  title,
  xp,
  staked,
  expiresAt,
  status,
  type = 'ember',
}) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/challenges/${id}`)}
      className="w-full flex flex-row justify-between p-2">
      <View className="flex flex-col">
        <Text className="text-lg text-white font-semibold">{title}</Text>
        {status === 'Active' && (
          <View className="flex flex-row items-center gap-2">
            <Text className="text-sm text-secondary-foreground">Time Left:</Text>
            <CountdownTimer expiration={expiresAt.toISOString()} flat />
          </View>
        )}
        <Text className="text-sm text-secondary-foreground">
          Staked: {formatEther(staked)} EURØP
        </Text>
      </View>
      <View className="flex flex-col gap-2 items-end ">
        {status === 'Completed' ? (
          <View className="rounded-full flex items-center justify-center h-[24px] bg-primary px-2">
            <Text className="text-xs text-primary-foreground">Done</Text>
          </View>
        ) : type !== 'ember' ? (
          <View className="rounded-full flex items-center justify-center h-[24px] bg-secondary px-2">
            <Text className="text-xs text-secondary-foreground">
              {type === 'igniter' ? 'Igniter' : 'Zharrior'}
            </Text>
          </View>
        ) : (
          <View className=" h-[24px]" />
        )}
        <View className="flex flex-row items-center  gap-1">
          <Text className="text-md text-white">{formatEther(xp)}</Text>
          <Text className="text-sm ">🔥</Text>
          <Text className="text-md text-white">XP</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeCard);
