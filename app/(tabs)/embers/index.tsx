import { Text } from '@/components/ui/text';
import { SafeAreaView, ScrollView, View } from 'react-native';

export default function EmbersScreen() {
  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 gap-10">
          <Text className="text-xl font-bold text-foreground text-center">Embers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
