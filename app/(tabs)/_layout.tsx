import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React, { useMemo } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const theme = useMemo(() => Colors[colorScheme ?? 'light'], [colorScheme]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarInactiveBackgroundColor: theme.background,
        tabBarActiveBackgroundColor: theme.background,
        tabBarStyle: {
          borderTopWidth: 1,
        },
      }}>
      <Tabs.Screen
        name="create"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'flame' : 'flame-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hidden/read"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="hidden/write"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
