import { View } from 'react-native';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Text } from './ui/text';

type Props = {
  label: string;
  placeholder: string;
  bottomNote?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const LabeledInput = (props: Props) => {
  return (
    <View className="gap-2">
      <Label className="text-foreground text-lg font-bold text-primary">{props.label}</Label>
      <Input
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
      />
      {props.bottomNote && (
        <Text className="text-sm text-muted-foreground">{props.bottomNote}</Text>
      )}
    </View>
  );
};
