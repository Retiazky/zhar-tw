import { ModalHeader } from '@/components/ModalHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import useGraphService from '@/hooks/services/useGraphService';
import { ProfileChallengeStatus } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { Address, bloSvg } from 'blo';
import { router, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { SvgFromXml } from 'react-native-svg';

type Params = {
  id: string;
};

export default function EmberScreen() {
  const graphService = useGraphService();
  const params = useLocalSearchParams<Params>();

  const [value, setValue] = useState<ProfileChallengeStatus>('ignited');

  const { data } = useQuery({
    queryKey: ['profile', params.id],
    queryFn: async () => (params.id ? await graphService.getEmber(params.id) : null),
    retry: false,
  });

  const joinedDate = useMemo(() => {
    if (!data) return '';
    const date = new Date(data.createdAt);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }, [data]);

  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="p-4">
        <ModalHeader
          title={data?.name ?? 'Ember'}
          leftIcon={<X size={24} color={Colors.dark.icon} />}
          onLeftIconPress={() => router.back()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                  <Text className="text-foreground/50 text-sm">100 🔥 XP</Text>
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
                      <Text className="text-foreground/50 text-sm">
                        {data?.name ?? 'Ember'} has no ignited challenges yet.
                      </Text>
                    </TabsContent>
                    <TabsContent value="stoked">
                      <Text className="text-foreground/50 text-sm">
                        {data?.name ?? 'Ember'} has no stoked challenges yet.
                      </Text>
                    </TabsContent>
                    <TabsContent value="active">
                      <Text className="text-foreground/50 text-sm">
                        {data?.name ?? 'Ember'} has no active challenges. If you want to ignite a
                        new challenge on {data?.name ?? 'Ember'}, you can do so in the Challenges
                        tab.
                      </Text>
                    </TabsContent>
                    <TabsContent value="completed">
                      <Text className="text-foreground/50 text-sm">
                        {data?.name ?? 'Ember'} has not completed any challenges yet.
                      </Text>
                    </TabsContent>
                  </Tabs>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
