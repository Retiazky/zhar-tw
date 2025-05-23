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
      <View className="flex-row items-center justify-between w-full px-4 py-2">
        {props.leftIcon && <Button onPress={props.onLeftIconPress}>{props.leftIcon}</Button>}
        <Text className="text-lg text-black">{props.title}</Text>
        <View />
      </View>
      <View></View>
      <View className="bottom-0">
        <Button className="w-full " variant="default" onPress={props.onLeftIconPress}>
          <Text className="text-md  text-black">Done</Text>
        </Button>
      </View>
    </View>
  );
};
