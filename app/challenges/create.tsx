import { LabeledDatePicker } from '@/components/LabeledDatePicker';
import { LabeledInput } from '@/components/LabeledInput';
import { LabeledTextarea } from '@/components/LabeledTextArea';
import { ModalHeader } from '@/components/ModalHeader';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/Colors';
import { europContract, zharChallengesContract } from '@/constants/thirdweb';
import { stringifyDescription } from '@/lib/parser';
import { checkIfRegistered } from '@/lib/utils';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { prepareContractCall, PreparedTransaction, sendBatchTransaction } from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';
import { isAddress, parseEther } from 'viem';

export default function CreateChallengeScreen() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [zharrior, setZharrior] = useState<string>('');
  const [ignation, setIgnation] = useState<string>('');
  const [expireDate, setExpireDate] = useState<Date>(new Date());

  const account = useActiveAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const igniteChallenge = async () => {
    if (!account) {
      setErrorMessage('Please connect your wallet first.');
      return;
    }
    // Validate inputs
    if (!title.trim() || !description.trim() || !zharrior.trim() || !ignation.trim()) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    // Date must be at least 36h in the future
    const minExpireDate = new Date(Date.now() + 36 * 60 * 60 * 1000);
    if (expireDate < minExpireDate) {
      setErrorMessage('Expire date must be at least 36 hours in the future.');
      return;
    }
    // Title must be at least 5 characters
    if (title.length < 5) {
      setErrorMessage('Title must be at least 5 characters long.');
      return;
    }
    // Description must be at least 10 characters
    if (description.length < 10) {
      setErrorMessage('Description must be at least 10 characters long.');
      return;
    }
    // Zharrior must be a valid address
    if (!isAddress(zharrior)) {
      setErrorMessage('Zharrior must be a valid Ethereum address.');
      return;
    }
    // Ignation must be a valid number and at least 10 EURØP
    const ignationValue = parseFloat(ignation);
    if (isNaN(ignationValue) || ignationValue < 10) {
      setErrorMessage('Ignation must be a valid number and at least 10 EURØP.');
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    if (!(await checkIfRegistered(account.address))) {
      setErrorMessage('Your profile is not registered. Please register first.');
      setLoading(false);
      return;
    }
    try {
      const rawDescription = stringifyDescription(title, description);
      console.log('Preparing transaction to create challenge...');
      let ign = parseEther(ignation);
      const approveTx = prepareContractCall({
        contract: europContract,
        method: 'approve',
        params: [zharChallengesContract.address, ign],
      });

      const createChallengeTx = prepareContractCall({
        contract: zharChallengesContract,
        method: 'createChallenge',
        params: [
          zharrior,
          rawDescription,
          BigInt(Math.round(expireDate.getTime() / 1000)),
          BigInt(7000),
          BigInt(86400 * 2),
          ign,
        ],
      });
      console.log('Sending transaction to create challenge...');
      const recipe = await sendBatchTransaction({
        transactions: [approveTx, createChallengeTx] as PreparedTransaction[],
        account,
      });
      console.log('Challenge created successfully:', recipe);
      router.back();
    } catch (e) {
      console.error('Error creating challenge:', e);
      setErrorMessage('Failed to create challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 rounded-t-3xl bg-background">
      <View className="p-4">
        <ModalHeader
          title="New Challenge"
          leftIcon={<X size={24} color={Colors.dark.icon} />}
          onLeftIconPress={() => router.back()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-8">
          <Text className="text-center text-foreground text-lg">
            Ignite a new challenge — choose your{' '}
            <Text className="text-primary font-bold">Zharrior</Text>, set the{' '}
            <Text className="text-primary font-bold">Ignation</Text>, and decide when the flame
            burns out.
          </Text>
          <LabeledInput
            label="📝 Title"
            placeholder="Short description of the challenge"
            value={title}
            onChangeText={setTitle}
          />
          <LabeledTextarea
            label="📝 Description"
            placeholder="Run 10km in under 50 minutes."
            bottomNote="What is the challenge about? Describe the mission or goal clearly."
            value={description}
            onChangeText={setDescription}
          />
          <LabeledInput
            label="🧑‍🚀 Zharrior"
            placeholder="0x123..abc"
            bottomNote="Enter the Zharrior’s wallet address or identifier. This is the person who will take on
              the challenge."
            value={zharrior}
            onChangeText={setZharrior}
          />
          <LabeledInput
            label="🔥 Ignation"
            placeholder="10 EURØP"
            bottomNote="This is the initial reward offered to fuel the challenge. Minimum is 10 EURØP."
            value={ignation}
            onChangeText={setIgnation}
          />
          <LabeledDatePicker
            label="⏳ Expire Date"
            bottomNote="This is the deadline for the Zharrior to submit their proof."
            value={expireDate}
            onChange={setExpireDate}
          />
        </View>
        <View className="p-4 bottom-0">
          <Button
            disabled={loading}
            className="w-full"
            variant="default"
            onPress={() => igniteChallenge()}>
            <Text className="text-md  text-black">Ignite</Text>
          </Button>
          {errorMessage ? (
            <Text className="text-red-500 text-center mt-2">{errorMessage}</Text>
          ) : (
            <Text className="text-center text-muted-foreground text-sm mt-4">
              Note: Once you ignite the challenge, Spark A.I. will review it to ensure it follows
              community guidelines. It will also estimate the effort required and may adjust the
              expiration date accordingly before publishing.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
