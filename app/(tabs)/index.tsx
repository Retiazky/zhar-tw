import { Image, StyleSheet, View, useColorScheme } from "react-native";

import { ParallaxScrollView } from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { client } from "@/constants/thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { inAppWallet } from "thirdweb/wallets/in-app";

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "facebook",
        "discord",
        "telegram",
        "email",
        "phone",
        "passkey",
      ],
      passkeyDomain: "thirdweb.com",
    },
    smartAccount: {
      chain: baseSepolia,
      sponsorGas: true,
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    appMetadata: {
      name: "Thirdweb RN Demo",
    },
    mobileConfig: {
      callbackURL: "com.thirdweb.demo://",
    },
    walletConfig: {
      options: "smartWalletOnly",
    },
  }),
  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
  createWallet("io.zerion.wallet"),
];

// fake login state, this should be returned from the backend
let isLoggedIn = false;

export default function HomeScreen() {
  const account = useActiveAccount();
  console.log("account", account?.address);
  const theme = useColorScheme();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "white" }}
      headerImage={
        <Image
          source={require("@/assets/images/title.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          {account ? "Welcome to Zhar" : "Logging In"}
        </ThemedText>
      </ThemedView>
      <View style={{ gap: 2 }}>
        <ThemedText type="subtext">
          {account
            ? "Your best on-chain challenge platform."
            : "Connect your account to the app using one of the wallets below."}
        </ThemedText>
      </View>
      <ConnectButton
        client={client}
        theme={theme || "dark"}
        wallets={wallets}
        chain={baseSepolia}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  rowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    justifyContent: "space-evenly",
  },
  tableContainer: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  leftColumn: {
    flex: 1,
    textAlign: "left",
  },
  rightColumn: {
    flex: 1,
    textAlign: "right",
  },
});
