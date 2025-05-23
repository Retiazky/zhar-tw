import { View } from 'react-native';
import { Button } from './ui/button';
import { Text } from './ui/text';

type Props = {
  title: string;
  leftIcon?: React.ReactNode;
  onLeftIconPress?: () => void;
};

export const ModalHeader = (props: Props) => {
  return (
    <View className="flex items-center">
      <View className="flex-row items-center justify-between w-full p-4">
        {props.leftIcon ? (
          <Button onPress={props.onLeftIconPress} variant="ghost" className="w-12">
            {props.leftIcon}
          </Button>
        ) : (
          <View className="w-12" />
        )}
        <Text className="text-xl font-bold text-foreground text-center flex-1">{props.title}</Text>
        <View className="w-12" />
      </View>
      <View></View>
    </View>
  );
};
