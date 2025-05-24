// components/StokeDialog.tsx
import { Colors } from '@/constants/Colors';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';

type Props = {
  onClose: () => void;
  open: boolean;
};

export default function StokeDialog({ onClose, open }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [portion, setPortion] = useState<number>(1);

  useEffect(() => {
    if (open) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [open]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const incrementPortion = () => setPortion((p) => p + 1);
  const decrementPortion = () => setPortion((p) => (p > 1 ? p - 1 : 1));
  const onChangePortion = (text: string) => {
    // only allow numbers, default to 1 if invalid
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 1) setPortion(num);
    else setPortion(1);
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['40%']}
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
      <BottomSheetView className="p-4 gap-4 bg-background">
        {/* Title */}
        <Text className="text-xl font-bold text-center mb-2">Stoke this Challenge</Text>

        {/* Row with log emoji + portion, and controls */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg">🔥 Portion: {portion}</Text>

          <View className="flex-row items-center gap-2">
            <Button onPress={decrementPortion}>
              <Text className="text-black text-lg font-bold">−</Text>
            </Button>

            <TextInput
              keyboardType="numeric"
              value={portion.toString()}
              onChangeText={onChangePortion}
              className="border border-gray-400 rounded px-2 py-1 w-12 text-center text-lg"
              maxLength={3}
            />

            <Button onPress={incrementPortion}>
              <Text className="text-black text-lg font-bold">+</Text>
            </Button>
          </View>
        </View>

        {/* Description */}
        <Text className="text-center mb-6">
          You've added your logs and contributed to the prize pool. Let the games begin!
        </Text>

        {/* Stoke Button */}
        <Button onPress={handleDismiss} className="bg-blue-600 rounded py-3">
          <Text className="text-white font-semibold text-center">Stoke</Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
