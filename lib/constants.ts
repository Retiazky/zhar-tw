import { baseSepolia } from 'thirdweb/chains';
import { createWallet, inAppWallet } from 'thirdweb/wallets';

export const NAV_THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // background
    border: 'hsl(240 5.9% 90%)', // border
    card: 'hsl(0 0% 100%)', // card
    notification: 'hsl(0 84.2% 60.2%)', // destructive
    primary: 'hsl(240 5.9% 10%)', // primary
    text: 'hsl(240 10% 3.9%)', // foreground
  },
  dark: {
    background: 'hsl(240 10% 3.9%)', // background
    border: 'hsl(240 3.7% 15.9%)', // border
    card: 'hsl(240 10% 3.9%)', // card
    notification: 'hsl(0 72% 51%)', // destructive
    primary: 'hsl(0 0% 98%)', // primary
    text: 'hsl(0 0% 98%)', // foreground
  },
};

export const WALLETS = [
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
