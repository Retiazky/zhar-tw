import { SearchBar } from '@/components/SearchBar';
import SortDropdown from '@/components/SortDropdown';
import { Text } from '@/components/ui/text';
import useGraphService from '@/hooks/services/useGraphService';
import { SortDirection, SortEmbersField, SortFieldOption } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

const FIELDS: SortFieldOption<SortEmbersField>[] = [
  { key: 'date', label: '🗓️ Date joined' },
  { key: 'xp', label: '🔥 XP' },
];

export default function EmbersScreen() {
  const [sortField, setSortField] = useState<SortEmbersField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');
  const graphService = useGraphService();
  const { data } = useQuery({
    queryKey: ['embers', sortField, sortDirection],
    queryFn: async () => await graphService.getEmbers(sortField, sortDirection),
    retry: false,
  });

  return (
    <SafeAreaView className="bg-background flex-1">
      <Text className="text-xl font-bold text-foreground text-center py-2">Embers</Text>

      <View className="w-full p-4">
        <SearchBar />
      </View>

      <View className="px-4">
        <SortDropdown
          fields={FIELDS}
          onChange={(field, direction) => {
            setSortField(field as SortEmbersField);
            setSortDirection(direction);
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        <View className="flex-1 gap-10">{/* TODO: Profiles */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
