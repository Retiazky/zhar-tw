import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import { ChevronDown, SortAsc, SortDesc } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

type SortField = 'date' | 'xp';
type SortDirection = 'asc' | 'desc';

export default function EmbersScreen() {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const toggleDirection = (field: SortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <Text className="text-xl font-bold text-foreground text-center py-2">Embers</Text>

      <View className="w-full p-4">
        <SearchBar />
      </View>

      <View className="flex-row gap-2 px-4 items-center">
        <Button variant="ghost" size="icon" onPress={() => toggleDirection(sortField)}>
          {sortDirection === 'asc' ? (
            <SortDesc size={20} color={Colors.dark.icon} />
          ) : (
            <SortAsc size={20} color={Colors.dark.icon} />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="default"
              className="flex-row items-center gap-2 w-[170px] justify-between">
              <Text className="text-sm text-white truncate">
                {sortField === 'date' ? '🗓️ Date joined' : '🔥 XP'}
              </Text>
              <ChevronDown size={20} color={Colors.dark.icon} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-[170px] bg-transparent border-none">
            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onPress={() => toggleDirection('date')}>
              <Text
                className={`text-sm ${
                  sortField === 'date' ? 'font-semibold text-primary' : 'text-white'
                }`}>
                🗓️ Date joined
              </Text>
            </DropdownMenuItem>
            <DropdownMenuItem onPress={() => toggleDirection('xp')}>
              <Text
                className={`text-sm ${
                  sortField === 'xp' ? 'font-semibold text-primary' : 'text-white'
                }`}>
                🔥 XP
              </Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        <View className="flex-1 gap-10">{/* TODO: Profiles */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
