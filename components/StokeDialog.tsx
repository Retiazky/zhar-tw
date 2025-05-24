// components/StokeDialog.tsx
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Text } from './ui/text';

type Props = {
  onClose: () => void;
  open: boolean;
};

export default function StokeDialog({ onClose, open }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (open) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
    console.log('StokeDialog open state:', open);
  }, [open]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['40%']}
      onChange={() => {
        console.log('Bottom sheet changed');
      }}
      onDismiss={handleDismiss}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}>
      <BottomSheetView className="p-4 gap-4">
        <Text className="text-lg font-semibold text-center">🔥 Challenge Stoked!</Text>
        <Text className="text-center">
          You ve added your logs and contributed to the prize pool. Let the games begin!
        </Text>
        <Button onPress={handleDismiss}>
          <Text className="text-black font-medium text-md">Close</Text>
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
