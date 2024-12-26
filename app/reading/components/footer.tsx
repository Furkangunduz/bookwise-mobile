import { useReader } from '@epubjs-react-native/core';
import { ArrowLeft, Sun } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '~/components/ui/text';

export function Footer() {
  const { currentLocation, totalLocations } = useReader();

  return (
    <View className="flex-row justify-between items-center px-5 py-3 bg-[#14161B]">
      <TouchableOpacity>
        <ArrowLeft size={22} color="#ffffff" strokeWidth={2} />
      </TouchableOpacity>

      <Text className="text-white/60 text-sm">
        {currentLocation ? currentLocation.start.location : 0} from {totalLocations}
      </Text>

      <TouchableOpacity>
        <Sun size={22} color="#ffffff" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}
