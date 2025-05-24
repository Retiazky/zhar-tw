import CountdownTimer from '@/components/CountdownTimer';
import { ModalHeader } from '@/components/ModalHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { parseDescription } from '@/lib/parser';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { SafeAreaView, ScrollView, View } from 'react-native';

type Params = {
  id: string;
};

export default function ChallengeScreen() {
  const graphService = useGraphService();
  const params = useLocalSearchParams<Params>();

  const { data, error } = useQuery({
    queryKey: ['challenge', params.id],
    queryFn: async () => await graphService.getChallenge(params.id),
    retry: false,
  });

  const { title, description } = data
    ? parseDescription(data.description)
    : { title: 'Loading...', description: 'Loading...' };

  return (
    <SafeAreaView className="flex-1 rounded-t-3xl bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-8">
          <ModalHeader
            title="Challenge Details"
            leftIcon={<X size={24} color={Colors.dark.icon} />}
            onLeftIconPress={() => router.back()}
          />
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
              <Text className="text-start text-foreground text-md">{data?.igniter.id}</Text>
              {/* Zharrior */}
              <Text className="text-start text-foreground text-md font-bold">🧑🏻‍🚀 Zharrior</Text>
              <Text className="text-start text-foreground text-md">{data?.zharrior.id}</Text>
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
                {data?.volume ? `${data.volume} EURØP` : 'No EURØP staked yet'}
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
          <Button className="w-full" variant="default" onPress={() => {}}>
            <Text className="text-md  text-black">Stoke</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
