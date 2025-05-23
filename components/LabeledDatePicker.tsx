import DateTimePicker from '@react-native-community/datetimepicker';
import { View } from 'react-native';
import { Label } from './ui/label';
import { Text } from './ui/text';

type Props = {
  label: string;
  bottomNote?: string;
  value: Date;
  onChange: (text: Date) => void;
};

export const LabeledDatePicker = ({ label, bottomNote, value, onChange }: Props) => {
  const pickDate = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || value;
    onChange(currentDate);
  };
  return (
    <View className="gap-2 relative">
      <Label className="text-foreground text-lg font-bold">{label}</Label>
      <DateTimePicker style={{ flex: 1 }} value={value} is24Hour={true} onChange={pickDate} />
      {bottomNote && <Text className="text-sm text-muted-foreground">{bottomNote}</Text>}
    </View>
  );
};
