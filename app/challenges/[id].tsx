import CountdownTimer from '@/components/CountdownTimer';
import { ModalHeader } from '@/components/ModalHeader';
import StokeDialog from '@/components/StokeDialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import { zharChallengesContract } from '@/constants/thirdweb';
import useGraphService from '@/hooks/services/useGraphService';
import { parseDescription } from '@/lib/parser';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { prepareContractCall, sendAndConfirmTransaction } from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';
import { formatEther } from 'viem';

type Params = {
  id: string;
};

export default function ChallengeScreen() {
  const account = useActiveAccount();
  const graphService = useGraphService();
  const params = useLocalSearchParams<Params>();

  const [stokeDialogOpen, setStokeDialogOpen] = useState(false);

  const { data, error } = useQuery({
    queryKey: ['challenge', params.id],
    queryFn: async () => await graphService.getChallenge(params.id),
    retry: false,
  });

  const { title, description } = useMemo(() => {
    if (data) {
      return parseDescription(data.description);
    }
    return {
      title: 'Loading the title...',
      description: 'Loading the description...',
    };
  }, [data]);

  const role = useMemo(() => {
    if (data?.zharrior.id.toLowerCase() === account?.address.toLowerCase()) {
      return 'zharrior';
    } else {
      return 'ember';
    }
  }, [data, account]);

  const [loading, setLoading] = useState<boolean>(false);
  const distributeRewards = async () => {
    if (!account) {
      console.error('No account connected');
      return;
    }
    setLoading(true);

    const transaction = prepareContractCall({
      contract: zharChallengesContract,
      method: 'claimReward',
      params: [BigInt(params.id)],
    });
    console.log('Sending transaction to claim rewards...');
    const recipe = await sendAndConfirmTransaction({
      transaction,
      account,
    });
    console.log('Challenge rewards claimed successfully:', recipe);
    router.back();
    setLoading(false);
  };

  const isValid = useMemo(() => {
    if (!data) return false;
    const updated = new Date(data.updatedAt);
    const expiration = new Date(data.expiration);
    if (expiration > updated) {
      return true;
    }
    return false;
  }, [data]);
  return (
    <SafeAreaView className="flex-1 rounded-t-3xl bg-background">
      <View className="p-4">
        <ModalHeader
          title="Challenge Details"
          leftIcon={<X size={24} color={Colors.dark.icon} />}
          onLeftIconPress={() => router.back()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-8">
          {error ? (
            <Text className="text-foreground text-lg font-semibold">
              There was en error loading the challenge detail. {error.message}
            </Text>
          ) : (
            <View className="p-2 gap-4">
              {/* Title */}
              <Text className="text-start text-foreground text-lg font-bold">{title}</Text>
              {/* Description  */}
              <Text className="text-start text-foreground text-md">{description}</Text>
              {/* Igniter */}
              <Text className="text-start text-foreground text-md font-bold">🔥 Igniter</Text>
              <TouchableOpacity onPress={() => router.push(`/embers/${data?.igniter.id}`)}>
                <Text className="text-start text-primary underline">{data?.igniter.id}</Text>
              </TouchableOpacity>
              {/* Zharrior */}
              <Text className="text-start text-foreground text-md font-bold">🧑🏻‍🚀 Zharrior</Text>
              <TouchableOpacity onPress={() => router.push(`/embers/${data?.zharrior.id}`)}>
                <Text className="text-start text-primary underline">{data?.zharrior.id}</Text>
              </TouchableOpacity>

              {/* Number of Stokers */}
              <Text className="text-start text-foreground text-md font-bold">
                👥 Number of Stokers
              </Text>
              <Text className="text-start text-foreground text-md">
                {data?.depositCount ?? 'No stokers yet'}
              </Text>
              {/* EURØP Staked */}
              <Text className="text-start text-foreground text-md font-bold">🪵 Staked</Text>
              <Text className="text-start text-foreground text-md">
                {data?.volume ? `${formatEther(data.volume)} EURØP` : 'No EURØP staked yet'}
              </Text>
              {/* Time Left */}
              <Text className="text-start text-foreground text-md font-bold">⏳ Time Left</Text>
              <Text className="text-start text-foreground text-md">
                {data?.expiration ? (
                  <CountdownTimer expiration={data.expiration} />
                ) : (
                  'No expiration date set'
                )}
              </Text>
            </View>
          )}
        </View>
        <View className="p-4 bottom-0">
          {!account ? (
            <Text className="text-foreground text-sm text-center mt-2">
              Connect your wallet to stoke the challenge or submit proof if you&apos;re the
              Zharrior.
            </Text>
          ) : new Date(data?.expiration || '') < new Date() ? (
            <Text className="text-foreground text-center font-medium">
              This challenge is expired ⌛
            </Text>
          ) : (
            <>
              <Button
                className="w-full"
                variant="default"
                onPress={() => {
                  if (role === 'zharrior') {
                    // handle proof submission
                  } else {
                    setStokeDialogOpen(true);
                  }
                }}>
                <Text className="text-md text-black">
                  {role === 'zharrior' ? '🧾 Submit Proof' : '🪵 Stoke'}
                </Text>
              </Button>
              {role === 'zharrior' && data?.status === 'ProofSubmitted' && isValid && (
                <Button
                  disabled={loading}
                  className="w-full"
                  variant="default"
                  onPress={() => distributeRewards()}>
                  <Text className="text-md text-black">Claim</Text>
                </Button>
              )}
            </>
          )}
        </View>
      </ScrollView>
      <StokeDialog
        challengeId={params.id}
        open={stokeDialogOpen}
        onClose={() => setStokeDialogOpen(false)}
      />
    </SafeAreaView>
  );
}
