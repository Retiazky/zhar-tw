import ChallengeCard from '@/components/ChallengeCard';
import SortDropdown from '@/components/SortDropdown';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { parseDescription } from '@/lib/parser';
import { Challenge } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { FlameIcon, Plus } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text, View } from 'react-native';

export default function HomeScreen() {
  const graphService = useGraphService();

  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data, error } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => await graphService.getChallenges(),
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
      <View className="w-full justify-between px-4 flex-row flex items-center">
        <View className="w-[40px]" />
        <Text className="text-xl font-bold text-foreground text-center">Challenges</Text>
        <Button variant="ghost" onPress={() => router.push('/challenges/active')}>
          <FlameIcon
            size={24}
            color={hasActiveChallenges ? Colors.dark.tabIconSelected : Colors.dark.tabIconDefault}
            fill={hasActiveChallenges ? Colors.dark.tabIconSelected : undefined}
          />
        </Button>
      </View>

      <SortDropdown
        fields={[
          { key: 'date', label: '🗓️ Date ignited' },
          { key: 'xp', label: '🔥 XP' },
          { key: 'staked', label: '💰 Staked' },
        ]}
        onChange={(field, direction) => {
          setSortField(field);
          setSortDirection(direction);
        }}
      />

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
