import ChallengeCard from '@/components/ChallengeCard';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { MOCKED_CHALLENGES } from '@/constants/mocks';
import { Challenge } from '@/types/challenge';
import { router } from 'expo-router';
import { FlameIcon, Plus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useActiveAccount } from 'thirdweb/react';

export default function HomeScreen() {
  const account = useActiveAccount();

  const [challenges, setChallenges] = useState(MOCKED_CHALLENGES);

  const hasActiveChallenges = useMemo(
    () => challenges.some((challenge) => !challenge.fulfilled),
    [challenges],
  );

  const renderChallenge: ListRenderItem<Challenge> = useCallback(({ item }) => {
    return (
      <ChallengeCard
        id={item.id}
        title={item.title}
        expiresAt={item.expiresAt}
        xp={item.xp}
        staked={item.staked}
      />
    );
  }, []);

  return (
    <SafeAreaView className="w-full bg-background flex-1">
      <View className="w-full justify-between px-4 flex-row flex items-center">
        <View className="w-[40px]" />
        <Text className="text-2xl text-foreground font-bold">Challenges</Text>
        <TouchableOpacity
          onPress={() => router.push('/challenges/active')}
          className="flex items-center justify-center p-[8px]">
          <FlameIcon
            size={24}
            color={hasActiveChallenges ? Colors.dark.tabIconSelected : Colors.dark.tabIconDefault}
            fill={hasActiveChallenges ? Colors.dark.tabIconSelected : undefined}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ gap: 10 }}
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
      />

      <Button
        className="absolute bottom-8 right-4 w-16 h-16 rounded-full items-center justify-center"
        style={{
          shadowColor: 'rgba(255, 69, 0, 0.9)',
          shadowOpacity: 0.9,
          shadowRadius: 14,
          elevation: 16,
        }}
        variant="default"
        size="icon"
        onPress={() => {
          router.push('/challenges/create');
        }}>
        <Plus size={32} fill={Colors.dark.icon} />
      </Button>
    </SafeAreaView>
  );
}
