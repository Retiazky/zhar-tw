import { View } from 'react-native';
import { Label } from './ui/label';
import { Text } from './ui/text';
import { Textarea } from './ui/textarea';

type Props = {
  label: string;
  placeholder: string;
  bottomNote?: string;
  value: string;
  onChangeText: (text: string) => void;
};

export const LabeledTextarea = (props: Props) => {
  return (
    <View className="gap-2">
      <Label className="text-foreground text-lg font-bold text-primary">{props.label}</Label>
      <Textarea aria-labelledby="textareaLabel" placeholder={props.placeholder} />
      {props.bottomNote && (
        <Text className="text-sm text-muted-foreground">{props.bottomNote}</Text>
      )}
    </View>
  );
};
