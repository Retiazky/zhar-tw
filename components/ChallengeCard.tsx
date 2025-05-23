import { router } from 'expo-router';
import { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formatEther } from 'viem';
type Props = {
  id: string;
  title: string;
  xp: bigint;
  staked: bigint;
  expiresAt: Date;
};
const ChallengeCard: React.FC<Props> = ({ id, title, xp, staked, expiresAt }) => {
  const expiresIn = useMemo(() => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  }, [expiresAt]);
  return (
    <TouchableOpacity
      onPress={() => router.push(`/challenges/${id}`)}
      className="w-full flex flex-row justify-between p-2">
      <View className="flex flex-col">
        <Text className="text-lg text-white font-semibold">{title}</Text>
        <Text className="text-sm  text-secondary-foreground">
          Staked: {formatEther(staked)} EURØP
        </Text>
        <Text className="text-sm  text-secondary-foreground">Expires in: {expiresIn}</Text>
      </View>
      <View className="flex flex-row items-center  gap-1">
        <Text className="text-md  text-white">{formatEther(xp)}</Text>
        <Text className="text-sm">🔥</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeCard);
