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
import { ChevronDown, ChevronUp, SortDesc } from 'lucide-react-native';
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

  const renderChevron = (field: SortField) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} className="ml-1" color={Colors.dark.tabIconSelected} />
    ) : (
      <ChevronDown size={16} className="ml-1" color={Colors.dark.tabIconSelected} />
    );
  };

  return (
    <SafeAreaView className="bg-background flex-1">
      <Text className="text-xl font-bold text-foreground text-center p-2">Embers</Text>

      <ScrollView showsVerticalScrollIndicator={false} className="p-4">
        <View className="flex-1 gap-10">
          <View className="w-full flex-row justify-between items-center">
            {/* Search-bar input */}
            <View className="w-[70%]">
              <SearchBar />
            </View>

            {/* Add some horizontal space between */}
            <View className="w-[5%]" />

            {/* Dropdown menu for sorting */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-2 rounded-full">
                  <SortDesc size={20} color={Colors.dark.icon} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[50%]">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onPress={() => toggleDirection('date')}>
                  <View className="flex-row items-center w-full">
                    <Text>🗓️ Date joined</Text>
                    <View className="ml-auto">{renderChevron('date')}</View>
                  </View>
                </DropdownMenuItem>
                <DropdownMenuItem onPress={() => toggleDirection('xp')}>
                  <View className="flex-row items-center w-full">
                    <Text>🔥 XP</Text>
                    <View className="ml-auto">{renderChevron('xp')}</View>
                  </View>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
