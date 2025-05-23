import ChallengeCard from '@/components/ChallengeCard';
import useGraphService from '@/hooks/services/useGraphService';
import { parseDescription } from '@/lib/parser';
import { Challenge } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text } from 'react-native';

export default function ActiveChallengesScreen() {
  const graphService = useGraphService();

  const { data, error } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => await graphService.getChallenges(true),
    retry: false,
  });

  const hasActiveChallenges = useMemo(() => {
    return data?.some((challenge) => challenge.status === 'Active') ?? false;
  }, [data]);

  const renderChallenge: ListRenderItem<Challenge> = useCallback(({ item }) => {
    const { title } = parseDescription(item.description);
    return (
      <ChallengeCard
        id={item.id}
        title={title}
        expiresAt={new Date(item.expiration)}
        xp={item.volume}
        staked={item.volume}
      />
    );
  }, []);

  return (
    <SafeAreaView className="bg-background flex-1">
      <Text className="text-xl font-bold text-foreground text-center p-4">Active Challenges</Text>

      <FlatList
        contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
        ListHeaderComponent={() => {
          return (
            error && (
              <Text className="text-foreground text-lg font-semibold">
                Error loading challenges: {error.message}
              </Text>
            )
          );
        }}
        ListEmptyComponent={() => (
          <Text className="text-foreground text-lg text-center font-semibold">
            No active challenges available.
          </Text>
        )}
      />
    </SafeAreaView>
  );
}
