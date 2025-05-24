import ChallengeCard from '@/components/ChallengeCard';
import SortDropdown from '@/components/SortDropdown';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/Colors';
import { client } from '@/constants/thirdweb';
import useGraphService from '@/hooks/services/useGraphService';
import { WALLETS } from '@/lib/constants';
import { parseDescription } from '@/lib/parser';
import { checkIfRegistered } from '@/lib/utils';
import { Challenge, SortChallengesField, SortDirection } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { FlameIcon, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, Text, View } from 'react-native';
import { baseSepolia } from 'thirdweb/chains';
import { useActiveAccount, useAutoConnect } from 'thirdweb/react';

const FIELDS = [
  { key: 'createdAt', label: '🗓️ Date ignited' },
  {
    key: 'volume',
    label: '🔥 Ignites',
  },
];

export default function HomeScreen() {
  const graphService = useGraphService();
  const account = useActiveAccount();
  const { isLoading: accountLoading } = useAutoConnect({
    client,
    chain: baseSepolia,
    wallets: WALLETS,
  });

  const [sortField, setSortField] = useState<SortChallengesField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');

  const { data, error, refetch } = useQuery({
    queryKey: ['challenges', sortField, sortDirection, account],
    queryFn: async () => await graphService.getChallenges(sortField, sortDirection),
    retry: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    if (!account) return;
    setLoading(true);
    checkIfRegistered(account.address)
      .then((res) => {
        console.log('Is registered:', res, account);
        setIsRegistered(res);
      })
      .catch((e) => {
        console.error('Error checking if registered:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [account]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const hasActiveChallenges = useMemo(() => {
    return data?.some((challenge) => challenge.status === 'Active') ?? false;
  }, [data]);

  const renderChallenge: ListRenderItem<Challenge> = useCallback(
    ({ item }) => {
      const { title } = parseDescription(item.description);
      const address = account?.address?.toLowerCase() || '';
      const type =
        item.zharrior.id === address
          ? 'zharrior'
          : item.igniter.id === address
            ? 'igniter'
            : 'ember';
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
    },
    [account],
  );

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="w-full justify-between  flex-row flex items-center">
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
        />
      </View>
      {account && isRegistered && !loading && !accountLoading && (
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
      )}
    </SafeAreaView>
  );
}
