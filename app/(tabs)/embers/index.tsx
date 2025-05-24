import { SearchBar } from '@/components/SearchBar';
import SortDropdown from '@/components/SortDropdown';
import { Text } from '@/components/ui/text';
import useGraphService from '@/hooks/services/useGraphService';
import { SortDirection, SortEmbersField, SortFieldOption } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

const FIELDS: SortFieldOption<SortEmbersField>[] = [
  { key: 'createdAt', label: '🗓️ Date joined' },
  { key: 'totalXp', label: '🔥 XP' },
];

export default function EmbersScreen() {
  const [sortField, setSortField] = useState<SortEmbersField>('createdAt');
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
        <View className="flex-1 gap-10">
          {data?.map((ember) => (
            <View key={ember.id} className="p-4 bg-card rounded-lg shadow">
              <Text className="text-lg font-semibold text-foreground">{ember.name}</Text>
              <Text className="text-sm text-muted-foreground">XP: {ember.totalXp}</Text>
              <Text className="text-sm text-muted-foreground">
                Joined: {new Date(ember.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
