import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { formatEther } from 'viem';
import CountdownTimer from './CountdownTimer';

type Props = {
  id: string;
  name: string;
  xp?: bigint;
};

const ProfileCard: React.FC<Props> = ({ id, name, xp }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/challenges/${id}`)}
      className="w-full flex flex-row justify-between p-2">
      <View className="flex flex-col">
        <Text className="text-lg text-white font-semibold">{title}</Text>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-sm text-secondary-foreground">Time Left:</Text>
          <CountdownTimer expiration={expiresAt.toISOString()} flat />
        </View>
        <Text className="text-sm text-secondary-foreground">
          Staked: {formatEther(staked)} EURØP
        </Text>
      </View>
      <View className="flex flex-row items-center  gap-1">
        <Text className="text-md text-white">{formatEther(xp)}</Text>
        <Text className="text-sm ">🔥</Text>
        <Text className="text-md text-white">XP</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeCard);
