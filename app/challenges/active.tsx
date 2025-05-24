import ChallengeCard from '@/components/ChallengeCard';
import { ModalHeader } from '@/components/ModalHeader';
import SortDropdown from '@/components/SortDropdown';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { X } from '@/lib/icons/X';
import { parseDescription } from '@/lib/parser';
import { Challenge, SortChallengesField, SortDirection } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text, View } from 'react-native';
import { useActiveAccount } from 'thirdweb/react';

const FIELDS = [
  { key: 'createdAt', label: '🗓️ Date ignited' },
  {
    key: 'volume',
    label: '🔥 Ignites',
  },
];

export default function ActiveChallengesScreen() {
  const graphService = useGraphService();
  const account = useActiveAccount();

  const [sortField, setSortField] = useState<SortChallengesField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

  const { data, error } = useQuery({
    queryKey: ['active-challenges', sortField, sortDirection, account],
    queryFn: async () =>
      await graphService.getChallenges(sortField, sortDirection, account?.address),
    retry: false,
  });

  const renderChallenge: ListRenderItem<Challenge> = useCallback(({ item }) => {
    const { title } = parseDescription(item.description);
    const address = account?.address?.toLowerCase() || '';
    const type =
      item.zharrior.id === address ? 'zharrior' : item.igniter.id === address ? 'igniter' : 'ember';
    return (
      <ChallengeCard
        id={item.id}
        title={title}
        expiresAt={new Date(item.expiration)}
        xp={item.volume}
        staked={item.volume}
        type={type}
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

      <View className="p-4 gap-2">
        <SortDropdown
          fields={FIELDS}
          onChange={(field, direction) => {
            setSortField(field as SortChallengesField);
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
