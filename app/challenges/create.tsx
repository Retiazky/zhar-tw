import { LabeledInput } from '@/components/LabeledInput';
import { LabeledTextarea } from '@/components/LabeledTextArea';
import { ModalHeader } from '@/components/ModalHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { SafeAreaView, ScrollView, View } from 'react-native';

export default function CreateChallengeScreen() {
  return (
    <SafeAreaView className="flex-1 rounded-t-3xl bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-8">
          <ModalHeader
            title="New Challenge"
            leftIcon={<X size={24} color={Colors.dark.icon} />}
            onLeftIconPress={() => router.back()}
          />
          <Text className="text-center text-foreground text-lg">
            Ignite a new challenge — choose your{' '}
            <Text className="text-primary font-bold">Zharrior</Text>, set the{' '}
            <Text className="text-primary font-bold">Ignation</Text>, and decide when the flame
            burns out.
          </Text>
          <LabeledTextarea
            label="📝 Description"
            placeholder="Run 10km in under 50 minutes."
            bottomNote="What is the challenge about? Describe the mission or goal clearly."
            value=""
            onChangeText={() => {}}
          />
          <LabeledInput
            label="🧑‍🚀 Zharrior"
            placeholder="0x123..abc"
            bottomNote="Enter the Zharrior’s wallet address or identifier. This is the person who will take on
              the challenge."
            value=""
            onChangeText={() => {}}
          />
          <LabeledInput
            label="🔥 Ignation"
            placeholder="10 EURØP"
            bottomNote="This is the initial reward offered to fuel the challenge. Minimum is 10 EURØP."
            value=""
            onChangeText={() => {}}
          />
          <LabeledInput
            label="⏳ Expire Date"
            placeholder="30/05/2025"
            bottomNote="This is the deadline for the Zharrior to submit their proof."
            value=""
            onChangeText={() => {}}
          />
        </View>
        <View className="p-4 bottom-0">
          <Button className="w-full" variant="default" onPress={() => {}}>
            <Text className="text-md  text-black">Ignite</Text>
          </Button>
          <Text className="text-center text-muted-foreground text-sm mt-4">
            Note: Once you ignite the challenge, Spark A.I. will review it to ensure it follows
            community guidelines. It will also estimate the effort required and may adjust the
            expiration date accordingly before publishing.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
