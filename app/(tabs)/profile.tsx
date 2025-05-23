import { client } from '@/constants/thirdweb';
import { Image, SafeAreaView, Text, useColorScheme, View } from 'react-native';
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
  const theme = useColorScheme();
  return (
    <SafeAreaView className="bg-background flex-1 flex-col gap-20 p-2">
      <Text className="text-xl font-bold text-foreground text-center">Profile</Text>

      <View className="flex-1 flex-col items-center">
        <View className="flex-1 w-full items-center flex-col gap-10">
          {/* Profile pic */}
          <View className="flex items-center  justify-center rounded-full bg-foreground/10 p-1">
            <Image source={require('@/assets/images/zhar-clear.png')} className="w-40 h-40" />
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
            <View className="w-11/12">
              <ConnectButton
                client={client}
                theme={'light'}
                wallets={WALLETS}
                chain={baseSepolia}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
