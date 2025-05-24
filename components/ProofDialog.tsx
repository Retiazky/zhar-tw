import { Colors } from '@/constants/Colors';
import { zharChallengesContract } from '@/constants/thirdweb';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { prepareContractCall, sendAndConfirmTransaction } from 'thirdweb';
import { useActiveAccount } from 'thirdweb/react';
import { ModalHeader } from './ModalHeader';
import { Button } from './ui/button';
import { Text } from './ui/text';

type Props = {
  onClose: () => void;
  open: boolean;
  challengeId: string;
};

export default function ProofDialog({ onClose, open, challengeId }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const account = useActiveAccount();

  const [proofLink, setProofLink] = useState<string>('');

  useEffect(() => {
    if (open) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [open]);

  const onChangeProofLink = (text: string) => {
    setProofLink(text);
  };

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const [loading, setLoading] = useState<boolean>(false);

  const submit = async (proof: string) => {
    if (!account) {
      console.error('No account connected');
      return;
    }
    setLoading(true);
    const transaction = prepareContractCall({
      contract: zharChallengesContract,
      method: 'submitProof',
      params: [BigInt(challengeId), proof],
    });
    console.log('Sending transaction to submit proof...');
    const recipe = await sendAndConfirmTransaction({
      transaction,
      account,
    });
    console.log('Proof submitted successfully:', recipe);
    onClose();
    router.back();
    setLoading(false);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onDismiss={handleDismiss}
      backgroundStyle={{ backgroundColor: Colors.dark.background }}
      handleIndicatorStyle={{ backgroundColor: Colors.dark.icon }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}>
      <BottomSheetView className="p-4 gap-4 bg-background items-center">
        {/* Title */}
        <ModalHeader title="Submit Proof" />

        {/* Description */}
        <Text className="text-center">
          Please upload a <Text className="text-primary font-bold">public link</Text> to a photo or
          video that proves you completed the challenge. This could be a link from Instagram,
          TikTok, YouTube, Google Drive,..
        </Text>

        <TextInput
          keyboardType="numeric"
          value={proofLink}
          onChangeText={onChangeProofLink}
          className="w-[70%] h-10 text-center text-lg text-foreground bg-secondary rounded-md"
        />

        {/* Submit Button */}
        <Button
          onPress={() => submit(proofLink)}
          variant="default"
          className="w-[70%]"
          disabled={loading || !proofLink.length}>
          <Text>Submit</Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
