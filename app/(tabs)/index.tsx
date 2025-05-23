import ChallengeCard from '@/components/ChallengeCard';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { Challenge } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlameIcon, Plus } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const graphService = useGraphService();

  const { data, error } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => await graphService.getChallenges(),
    retry: false,
  });

  const hasActiveChallenges = useMemo(() => {
    console.log('data', data);
    return data?.challenges.some((challenge) => challenge.status === 'Active');
  }, [data]);

  const renderChallenge: ListRenderItem<Challenge> = useCallback(({ item }) => {
    return (
      <ChallengeCard
        id={item.id}
        title={item.id}
        expiresAt={new Date(item.expiration)}
        xp={item.volume}
        staked={item.volume}
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
        data={data?.challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderChallenge}
        ListHeaderComponent={() => {
          return error ? (
            <Text className="text-foreground text-lg font-semibold">
              Error loading challenges: {error.message}
            </Text>
          ) : (
            <Text className="text-foreground text-lg font-semibold">Active Challenges</Text>
          );
        }}
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
