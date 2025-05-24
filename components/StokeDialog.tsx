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

  const [portion, setPortion] = useState<number>(10);

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
  const decrementPortion = () => setPortion((p) => (p > 10 ? p - 1 : 10));

  const onChangePortion = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      setPortion(num);
    }
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
        <Text className="text-xl font-bold text-center">Stoke This Challenge</Text>

        {/* Description */}
        <Text className="text-center">
          Minimum stoke amount is 10 EURØP. You can increase this amount by pressing the plus
          button. You can also type a number directly into the input field.
        </Text>

        {/* Row with log emoji + portion, and controls */}
        <View className="flex-row items-center gap-2">
          <Button onPress={decrementPortion} size="icon" disabled={portion === 10}>
            <Text className="text-lg font-bold">−</Text>
          </Button>

          <Text className="text-center text-lg">🪵 </Text>
          <TextInput
            keyboardType="numeric"
            value={portion.toString()}
            onChangeText={onChangePortion}
            className="w-40 h-10 text-center text-lg text-foreground bg-secondary rounded-md"
          />

          <Button onPress={incrementPortion} size="icon">
            <Text className="text-black text-lg font-bold">+</Text>
          </Button>
        </View>

        {/* Stoke Button */}
        <Button
          onPress={handleDismiss}
          variant="default"
          className="w-[70%]"
          disabled={portion < 10}>
          <Text>Stoke</Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
