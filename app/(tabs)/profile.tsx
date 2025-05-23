import { client } from '@/constants/thirdweb';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Image, SafeAreaView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
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

export default function UsersScreen() {
  const account = useActiveAccount();
  const theme = useColorScheme();
  return (
    <SafeAreaView className="bg-background flex-1 flex flex-col items-center gap-2 p-2">
      <View className="w-full justify-between px-4 flex-row flex items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex items-center justify-center p-[8px]">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl text-foreground font-normal">Profile</Text>
        <View className="w-[40px]" />
      </View>

      <View className="flex items-center  justify-center rounded-full bg-foreground/10 p-1">
        <Image source={require('@/assets/images/zhar-clear.png')} className="w-40 h-40" />
      </View>
      {!account && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-foreground text-lg font-semibold">
            Connect your wallet to see your profile
          </Text>
        </View>
      )}
      <View className="w-11/12">
        <ConnectButton
          client={client}
          theme={theme || 'dark'}
          wallets={WALLETS}
          chain={baseSepolia}
        />
      </View>
    </SafeAreaView>
  );
}
