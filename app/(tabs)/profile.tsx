import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { client } from '@/constants/thirdweb';
import { ProfileChallengeStatus } from '@/types/challenge';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, View } from 'react-native';
import { baseSepolia } from 'thirdweb/chains';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { inAppWallet } from 'thirdweb/wallets/in-app';

const WALLETS = [
  inAppWallet({
    auth: {
      options: ['google', 'facebook', 'discord', 'telegram', 'email', 'phone', 'passkey'],
      passkeyDomain: 'thirdweb.com',
    },
    smartAccount: {
      chain: baseSepolia,
      sponsorGas: true,
    },
  }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet', {
    appMetadata: {
      name: 'Thirdweb RN Demo',
    },
    mobileConfig: {
      callbackURL: 'com.thirdweb.demo://',
    },
    walletConfig: {
      options: 'smartWalletOnly',
    },
  }),
  createWallet('me.rainbow'),
  createWallet('com.trustwallet.app'),
  createWallet('io.zerion.wallet'),
];

export default function ProfileScreen() {
  const account = useActiveAccount();

  const [value, setValue] = useState<ProfileChallengeStatus>('ignited');

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-10">
          <Text className="text-xl font-bold text-foreground text-center">Profile</Text>

          <View className="flex-1 flex-col items-center">
            <View className="flex-1 w-full items-center flex-col gap-5">
              {/* Profile pic */}
              <View className="flex items-center  justify-center rounded-full bg-foreground/10 p-1">
                <Image source={require('@/assets/images/zhar-clear.png')} className="w-40 h-40" />
              </View>

              {/* Nickname, Joined Date, Fire XP */}
              <View className="items-center justify-center">
                <Text className="text-foreground text-lg font-semibold">Meowie</Text>
                <Text className="text-foreground/50 text-sm">Joined 2 days ago</Text>
                <Text className="text-foreground/50 text-sm">100 🔥 XP</Text>
              </View>

              {/* Wallet connection */}
              <View className="w-full items-center">
                {!account && (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-foreground text-lg font-semibold">
                      Connect your wallet to see your profile
                    </Text>
                  </View>
                )}
                <View className="w-full p-4">
                  <ConnectButton
                    client={client}
                    theme={'light'}
                    wallets={WALLETS}
                    chain={baseSepolia}
                  />
                </View>
              </View>

              {/* Challenges */}
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
                      You have no ignited challenges yet. You can ignite a new one in the Challenges
                      Tab.
                    </Text>
                  </TabsContent>
                  <TabsContent value="stoked">
                    <Text className="text-foreground/50 text-sm">
                      You have no stoked challenges yet. You can stoke on an existing one in the
                      Challenges Tab.
                    </Text>
                  </TabsContent>
                  <TabsContent value="active">
                    <Text className="text-foreground/50 text-sm">
                      You have currently no active challenges. Someone has to ignite a challenge on
                      you.
                    </Text>
                  </TabsContent>
                  <TabsContent value="completed">
                    <Text className="text-foreground/50 text-sm">
                      You have not completed any challenges yet.
                    </Text>
                  </TabsContent>
                </Tabs>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
