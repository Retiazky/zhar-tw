import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import React from "react";
import { useActiveAccount } from "thirdweb/react";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const account = useActiveAccount();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Connect",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "wallet" : "wallet-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="read"
        options={{
          href: account ? "/read" : null,
          title: "Read",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "reader" : "reader-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: "Write",
          href: account ? "/write" : null,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
