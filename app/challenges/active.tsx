import ChallengeCard from '@/components/ChallengeCard';
import { ModalHeader } from '@/components/ModalHeader';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { X } from '@/lib/icons/X';
import { parseDescription } from '@/lib/parser';
import { Challenge } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text, View } from 'react-native';

export default function ActiveChallengesScreen() {
  const graphService = useGraphService();

  const { data, error } = useQuery({
    queryKey: ['active-challenges'],
    queryFn: async () => await graphService.getChallenges(true),
    retry: false,
  });

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
      <View className="p-4">
        <ModalHeader
          title="Active Challenges"
          leftIcon={<X size={24} color={Colors.dark.icon} />}
          onLeftIconPress={() => router.back()}
        />
      </View>
      <View className="p-4 gap-8">
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
              You have no active challenges.
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
