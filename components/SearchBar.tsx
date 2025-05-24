import { Colors } from '@/constants/Colors';
import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

export const SearchBar = () => {
  return (
    <View className="flex-row items-center rounded-md gap-2 px-3 py-3 bg-secondary">
      <Search size={20} color={Colors.dark.icon} />
      <TextInput
        placeholder="Search for a nick or wallet"
        placeholderTextColor={Colors.dark.icon}
        autoCapitalize="none"
        autoCorrect={false}
        className="flex-1 text-base text-foreground"
      />
    </View>
  );
};
