import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Colors } from '@/constants/Colors';
import { ChevronDown, SortAsc, SortDesc } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import { Text, View } from 'react-native';

type SortDirection = 'asc' | 'desc';

type SortFieldOption = {
  key: string;
  label: string;
};

type Props = {
  fields: SortFieldOption[];
  onChange?: (field: string, direction: SortDirection) => void;
};

const SortDropdown: React.FC<Props> = ({ fields, onChange }) => {
  const [sortField, setSortField] = useState<string>(fields[0]?.key ?? '');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const toggleDirection = (field: string) => {
    let newDirection: SortDirection;
    let newField = field;

    if (field === sortField) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      newDirection = 'desc';
    }

    setSortField(newField);
    setSortDirection(newDirection);
    onChange?.(newField, newDirection);
  };

  const selectedLabel = fields.find((f) => f.key === sortField)?.label ?? '';

  return (
    <View className="flex-row gap-2 items-center">
      <Button variant="ghost" size="icon" onPress={() => toggleDirection(sortField)}>
        {sortDirection === 'asc' ? (
          <SortDesc size={20} color={Colors.dark.icon} />
        ) : (
          <SortAsc size={20} color={Colors.dark.icon} />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="flex-row items-center gap-2 w-[170px] justify-between">
            <Text className="text-sm text-white truncate">{selectedLabel}</Text>
            <ChevronDown size={20} color={Colors.dark.icon} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-[170px] bg-background border-none">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {fields.map((field) => (
            <DropdownMenuItem key={field.key} onPress={() => toggleDirection(field.key)}>
              <Text
                className={`text-sm ${
                  sortField === field.key ? 'font-semibold text-primary' : 'text-white'
                }`}>
                {field.label}
              </Text>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  );
};

export default memo(SortDropdown);
