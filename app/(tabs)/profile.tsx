import ChallengeCard from '@/components/ChallengeCard';
import { LabeledInput } from '@/components/LabeledInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { client, zharChallengesContract } from '@/constants/thirdweb';
import useGraphService from '@/hooks/services/useGraphService';
import { WALLETS } from '@/lib/constants';
import { parseDescription } from '@/lib/parser';
import { checkIfRegistered } from '@/lib/utils';
import { Challenge, ProfileChallengeStatus } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { Address, bloSvg } from 'blo';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, ListRenderItem, SafeAreaView, View } from 'react-native';
import { SvgFromXml } from 'react-native-svg';
import { prepareContractCall, sendAndConfirmTransaction } from 'thirdweb';
import { baseSepolia } from 'thirdweb/chains';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { formatEther } from 'viem';

export default function ProfileScreen() {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [value, setValue] = useState<ProfileChallengeStatus>('ignited');

  const account = useActiveAccount();
  const graphService = useGraphService();
  const { data } = useQuery({
    queryKey: ['profile', account?.address],
    queryFn: async () => (account?.address ? await graphService.getEmber(account.address) : null),
    retry: false,
  });
  const { data: europData } = useQuery({
    queryKey: ['balance', account?.address],
    queryFn: async () => (account?.address ? await graphService.getEuropBalance(account.address) : null),
    retry: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!account) return;

    setLoading(true);
    checkIfRegistered(account.address)
      .then((res) => {
        setIsRegistered(res);
        if (!res) {
          setNewName('');
          setDialogOpen(true);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error checking if registered:', e);
        setErrorMessage('Failed to check registration status. Please try again.');
        setLoading(false);
      });
  }, [account]);

  const registerCreator = async () => {
    if (!account) return;
    if (!newName || newName.length < 5) {
      setErrorMessage('Nickname must be at least 5 characters long.');
      return;
    }
    setLoading(true);
    if (await checkIfRegistered(account.address)) {
      setErrorMessage('Your profile is already registered.');
      setLoading(false);
      return;
    }
    const transaction = prepareContractCall({
      contract: zharChallengesContract,
      method: 'registerCreator',
      params: [newName, account.address],
    });
    try {
      await sendAndConfirmTransaction({
        transaction,
        account,
      });
      setDialogOpen(false);
    } catch (e) {
      console.error('Error registering profile:', e);
      setErrorMessage('Failed to register profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = useMemo(() => {
    if (!data) return '';
    const date = new Date(data.createdAt);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }, [data]);

  const { data: challenges, error } = useQuery({
    queryKey: ['challenges', account],
    queryFn: async () => await graphService.getChallenges('createdAt', 'DESC', account?.address),
    retry: false,
  });

  const stokedChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter((challenge) =>
      challenge.deposits.some((dep) => dep.stoker.id === account?.address?.toLowerCase()),
    );
  }, [challenges, account]);

  const ignitedChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter(
      (challenge) => challenge.igniter.id === account?.address?.toLowerCase(),
    );
  }, [challenges, account]);

  const activeChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter(
      (challenge) =>
        challenge.status === 'Active' && challenge.zharrior.id === account?.address?.toLowerCase(),
    );
  }, [challenges, account]);

  const completedChallenges = useMemo(() => {
    if (!challenges) return [];
    return challenges.filter(
      (challenge) =>
        challenge.status === 'Completed' &&
        challenge.zharrior.id === account?.address?.toLowerCase(),
    );
  }, [challenges, account]);

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
      <View className="flex-1 gap-10">
        <Text className="text-xl font-bold text-foreground text-center">Profile</Text>

        <View className="flex-1 flex-col items-center">
          <View className="flex-1 w-full items-center flex-col gap-5">
            {/* Profile pic */}
            <View className="flex items-center overflow-hidden justify-center rounded-full bg-foreground/10 p-1">
              {account ? (
                <SvgFromXml xml={bloSvg(account.address as Address)} />
              ) : (
                <Image source={require('@/assets/images/zhar-clear.png')} className="w-40 h-40" />
              )}
            </View>

            {/* Nickname, Joined Date, Fire XP */}
            {account && (
              <View className="items-center justify-center">
                <Text className="text-foreground text-lg font-semibold">
                  {data?.name ?? 'Ember'}
                </Text>
                <Text className="text-foreground/50 text-sm">Joined {joinedDate}</Text>
                <Text className="text-foreground/50 text-sm">{data?.totalXp ?? 0} 🔥 XP</Text>
                  <Text className="text-foreground text-xl font-bold">
                      {europData && europData.length > 0 ? formatEther(BigInt(europData[0].amount)) : '0'} EUROP
                  </Text>
              </View>
            )}

            {/* Wallet connection */}
            <View className="w-full items-center">
              {!account && (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-foreground text-lg font-semibold">
                    Connect your wallet to see your profile
                  </Text>
                </View>
              )}
              <View className="w-full flex flex-col gap-4 p-4">
                <ConnectButton
                  client={client}
                  theme={'light'}
                  wallets={WALLETS}
                  chain={baseSepolia}
                />
                {account && !isRegistered && !loading && (
                  <Button
                    variant="outline"
                    onPress={() => setDialogOpen(true)}
                    className="w-full min-h-[50px]">
                    <Text>Register Profile</Text>
                  </Button>
                )}
              </View>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register profile</DialogTitle>
                    <DialogDescription>
                      Register your profile to start igniting challenges and earning XP. This will
                      create a unique profile for you on the Zhar network. Name should be at least 5
                      characters long.
                    </DialogDescription>
                  </DialogHeader>
                  <LabeledInput
                    label="Nickname"
                    placeholder="Zharrior"
                    value={newName}
                    onChangeText={setNewName}
                  />
                  <DialogFooter>
                    {errorMessage && (
                      <Text className="text-red-500 text-sm mt-2">{errorMessage}</Text>
                    )}
                    <Button disabled={loading || newName.length < 5} onPress={registerCreator}>
                      <Text>Register</Text>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </View>

            {/* Challenges */}
            {account && (
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
