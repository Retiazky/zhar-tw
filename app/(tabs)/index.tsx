import { Image, StyleSheet, View, useColorScheme } from 'react-native';

import { ParallaxScrollView } from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Colors } from '@/constants/Colors';
import { client } from '@/constants/thirdweb';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { baseSepolia } from 'thirdweb/chains';
import { ConnectButton, useActiveAccount } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { inAppWallet } from 'thirdweb/wallets/in-app';

const wallets = [
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

type Item = {
  label: string;
  value: string;
};

const items: Item[] = [
  {
    label: 'Test',
    value: 'test',
  },
  {
    label: 'Alpha',
    value: 'alpha',
  },
];
export default function HomeScreen() {
  const account = useActiveAccount();
  console.log('account', account?.address);
  const theme = useColorScheme();

  const [item, setItem] = useState<Item>();

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 32,
    right: 32,
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: 'white' }}
      headerImage={
        <Image source={require('@/assets/images/title.png')} style={styles.reactLogo} />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{account ? 'Welcome to Zhar' : 'Logging In'}</ThemedText>
      </ThemedView>
      <View style={{ gap: 2 }}>
        <ThemedText type="subtext">
          {account
            ? 'Your best on-chain challenge platform.'
            : 'Connect your account to the app using one of the wallets below.'}
        </ThemedText>
      </View>
      <ConnectButton
        client={client}
        theme={theme || 'dark'}
        wallets={wallets}
        chain={baseSepolia}
      />

      <Select defaultValue={item} onValueChange={setItem}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue className="text-sm native:text-lg" placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-full">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} label={item.label} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <View
        className="absolute bottom-4 right-4 w-16 h-16 rounded-full items-center justify-center"
        style={{
          shadowColor: 'rgba(255, 69, 0, 0.9)',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.9,
          shadowRadius: 14,
          elevation: 16,
        }}>
        <Button
          className="w-16 h-16 rounded-full items-center justify-center"
          variant="default"
          size="icon"
          onPress={() => {
            // your action here
          }}>
          <Plus size={32} fill={Colors.dark.icon} />
        </Button>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'space-evenly',
  },
  tableContainer: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  leftColumn: {
    flex: 1,
    textAlign: 'left',
  },
  rightColumn: {
    flex: 1,
    textAlign: 'right',
  },
});
