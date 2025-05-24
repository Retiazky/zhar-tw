import { Text } from '@/components/ui/text';
import { Address, bloSvg } from 'blo';
import { router } from 'expo-router';
import { memo } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { SvgFromXml } from 'react-native-svg';

type Props = {
  id: string;
  name: string;
  xp: string;
};

const ProfileCard = ({ id, name, xp }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/embers/${id}`)}
      className="w-full flex-row items-center p-4 gap-4">
      {/* Avatar */}
      <View className="w-16 h-16 rounded-full bg-foreground/10 items-center justify-center overflow-hidden">
        {id ? (
          <SvgFromXml xml={bloSvg(id as Address)} width={48} height={48} />
        ) : (
          <Image
            source={require('@/assets/images/zhar-clear.png')}
            className="w-16 h-16 rounded-full"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text className="text-lg text-white font-semibold">{name}</Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          className="text-sm text-secondary-foreground ">
          {id}
        </Text>
        <Text className="text-sm text-secondary-foreground">{xp} 🔥 XP</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProfileCard);
