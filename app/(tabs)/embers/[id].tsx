import ChallengeCard from '@/components/ChallengeCard';
import { ModalHeader } from '@/components/ModalHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { parseDescription } from '@/lib/parser';
import { Challenge, ProfileChallengeStatus } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { Address, bloSvg } from 'blo';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, ListRenderItem, SafeAreaView, View } from 'react-native';
import { SvgFromXml } from 'react-native-svg';
import { useActiveAccount } from 'thirdweb/react';
import { parseEther } from 'viem';

type Params = {
  id: string;
};

export default function EmberScreen() {
  const graphService = useGraphService();
  const params = useLocalSearchParams<Params>();
  const account = useActiveAccount();

  const [value, setValue] = useState<ProfileChallengeStatus>('ignited');

  const { data, refetch: refetchUser } = useQuery({
    queryKey: ['profile', params.id],
    queryFn: async () => (params.id ? await graphService.getEmber(params.id) : null),
    retry: false,
  });

  const joinedDate = useMemo(() => {
    if (!data) return '';
    const date = new Date(data.createdAt);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }, [data]);

  const {
    data: challenges,
    error,
    refetch: refetchChallenges,
  } = useQuery({
    queryKey: ['challenges', params.id],
    queryFn: async () => await graphService.getChallenges('createdAt', 'DESC', params.id),
    retry: false,
  });

  useFocusEffect(
    useCallback(() => {
      refetchUser();
      refetchChallenges();
    }, [refetchUser, refetchChallenges]),
  );

  const stokedChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter((challenge) =>
      challenge.deposits.some((dep) => dep.stoker.id === params.id.toLowerCase()),
    );
  }, [challenges, params.id]);

  const ignitedChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter((challenge) => challenge.igniter.id === params.id.toLowerCase());
  }, [challenges, params.id]);

  const activeChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter(
      (challenge) =>
        challenge.status === 'Active' && challenge.zharrior.id === params.id.toLowerCase(),
    );
  }, [challenges, params.id]);

  const completedChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter(
      (challenge) =>
        challenge.status === 'Completed' && challenge.zharrior.id === params.id.toLowerCase(),
    );
  }, [challenges, params.id]);

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
          status={item.status}
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
      <View className="p-4">
        <ModalHeader
          title={data?.name ?? 'Ember'}
          leftIcon={<X size={24} color={Colors.dark.icon} />}
          onLeftIconPress={() => router.dismiss()}
        />
      </View>
      <View className="flex-1 gap-10">
        <View className="flex-1 flex-col items-center">
          <View className="flex-1 w-full items-center flex-col gap-5">
            {/* Profile pic */}
            <View className="flex items-center overflow-hidden justify-center rounded-full bg-foreground/10 p-1">
              {params.id ? (
                <SvgFromXml xml={bloSvg(params.id as Address)} />
              ) : (
                <Image source={require('@/assets/images/zhar-clear.png')} className="w-40 h-40" />
              )}
            </View>

            {/*Joined Date, Fire XP */}
            {params.id && (
              <View className="items-center justify-center">
                <Text className="text-foreground/50 text-sm">Joined {joinedDate}</Text>
                <Text className="text-foreground/50 text-sm">
                  {data?.totalXp ? parseEther(data.totalXp.toString()) : 0} 🔥 XP
                </Text>
              </View>
            )}

            {/* Challenges */}
            {params.id && (
              <View className="w-full p-4 gap-2">
                <Text className="text-foreground text-lg font-semibold">Challenges</Text>
                <Tabs
                  value={value}
                  onValueChange={(val) => setValue(val as ProfileChallengeStatus)}
                  className="w-full mx-auto flex-col gap-1.5">
                  <TabsList className="flex-row w-full gap-4">
                    <TabsTrigger value="ignited">Ignited</TabsTrigger>
                    <TabsTrigger value="stoked">Stoked</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="ignited">
                    <FlatList
                      contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
                      data={ignitedChallenges}
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
                        <Text className="text-foreground/50 text-sm">
                          You have no ignited challenges yet. You can ignite a new one in the
                          Challenges Tab.
                        </Text>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="stoked">
                    <FlatList
                      contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
                      data={stokedChallenges}
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
                        <Text className="text-foreground/50 text-sm">
                          You have no stoked challenges yet. You can stoke on an existing one in the
                          Challenges Tab.
                        </Text>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="active">
                    <FlatList
                      contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
                      data={activeChallenges}
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
                        <Text className="text-foreground/50 text-sm">
                          You have currently no active challenges. Someone has to ignite a challenge
                          on you.
                        </Text>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="completed">
                    <FlatList
                      contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
                      data={completedChallenges}
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
                        <Text className="text-foreground/50 text-sm">
                          You have not completed any challenges yet.
                        </Text>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
