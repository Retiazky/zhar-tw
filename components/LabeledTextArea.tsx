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

export const LabeledTextarea = ({ label, placeholder, bottomNote, value, onChangeText }: Props) => {
  return (
    <View className="gap-2">
      <Label className="text-foreground text-lg font-bold">{label}</Label>
      <Textarea
        aria-labelledby="textareaLabel"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        autoCorrect={false}
        onChangeText={onChangeText}
      />
      {bottomNote && <Text className="text-sm text-muted-foreground">{bottomNote}</Text>}
    </View>
  );
};
