import ProfileCard from '@/components/ProfileCard';
import { SearchBar } from '@/components/SearchBar';
import SortDropdown from '@/components/SortDropdown';
import { Text } from '@/components/ui/text';
import useGraphService from '@/hooks/services/useGraphService';
import { Ember, SortDirection, SortEmbersField, SortFieldOption } from '@/types/challenge';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { FlatList, ListRenderItem, SafeAreaView, View } from 'react-native';

const FIELDS: SortFieldOption<SortEmbersField>[] = [
  { key: 'createdAt', label: '🗓️ Date joined' },
  { key: 'totalXp', label: '🔥 XP' },
];

export default function EmbersScreen() {
  const [sortField, setSortField] = useState<SortEmbersField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC');
  const graphService = useGraphService();
  const { data, error } = useQuery({
    queryKey: ['embers', sortField, sortDirection],
    queryFn: async () => await graphService.getEmbers(sortField, sortDirection),
    retry: false,
  });

  const renderEmber: ListRenderItem<Ember> = useCallback(({ item }) => {
    return <ProfileCard id={item.id} name={item.name} xp={item.volume} />;
  }, []);

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

      <FlatList
        contentContainerStyle={{ gap: 10, paddingHorizontal: 4 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderEmber}
        ListHeaderComponent={() => {
          return (
            error && (
              <Text className="text-foreground text-lg font-semibold">
                Error loading embers: {error.message}
              </Text>
            )
          );
        }}
      />
    </SafeAreaView>
  );
}
