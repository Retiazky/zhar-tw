import { router } from 'expo-router';
import { memo, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
  id: string;
  title: string;
  xp: number;
  staked: number;
  expiresAt: Date;
};

const f = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 0,
});

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
        <Text className="text-sm  text-secondary-foreground">Staked: {f.format(staked)} EURØP</Text>
        <Text className="text-sm  text-secondary-foreground">Expires in: {expiresIn}</Text>
      </View>
      <View className="flex flex-row items-center  gap-1">
        <Text className="text-md  text-white">{xp}</Text>
        <Text className="text-sm">🔥</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ChallengeCard);
