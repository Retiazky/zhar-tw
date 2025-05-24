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

export const LabeledInput = ({ label, placeholder, bottomNote, value, onChangeText }: Props) => {
  return (
    <View className="gap-2">
      <Label className="text-foreground text-lg font-bold">{label}</Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoComplete="off"
        autoCorrect={false}
        numberOfLines={1}
        multiline={false}
        className="text-ellipsis"
        scrollEnabled={true}
        style={{ overflow: 'hidden' }}
      />
      {bottomNote && <Text className="text-sm text-muted-foreground">{bottomNote}</Text>}
    </View>
  );
};
