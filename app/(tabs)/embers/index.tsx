import { SearchBar } from '@/components/SearchBar';
import SortDropdown from '@/components/SortDropdown';
import { Text } from '@/components/ui/text';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

export default function EmbersScreen() {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  return (
    <SafeAreaView className="bg-background flex-1">
      <Text className="text-xl font-bold text-foreground text-center py-2">Embers</Text>

      <View className="w-full p-4">
        <SearchBar />
      </View>

      <SortDropdown
        fields={[
          { key: 'date', label: '🗓️ Date joined' },
          { key: 'xp', label: '🔥 XP' },
        ]}
        onChange={(field, direction) => {
          setSortField(field);
          setSortDirection(direction);
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        <View className="flex-1 gap-10">{/* TODO: Profiles */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
