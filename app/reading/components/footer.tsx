import { useReader } from '@epubjs-react-native/core';
import { ArrowLeft, Sun } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/colors';

export function Footer() {
  const { currentLocation, totalLocations } = useReader();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton}>
        <ArrowLeft size={22} color={COLORS.text.primary} strokeWidth={2} />
      </TouchableOpacity>

      <Text style={styles.locationText}>
        {currentLocation ? currentLocation.start.location : 0} from {totalLocations}
      </Text>

      <TouchableOpacity style={styles.iconButton}>
        <Sun size={22} color={COLORS.text.primary} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.ui.footer,
    borderTopWidth: 1,
    borderTopColor: COLORS.background.secondary,
    zIndex: 1,
    elevation: 1,
    position: 'relative',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background.secondary,
  },
  locationText: {
    color: COLORS.text.secondary,
    fontSize: 14,
  },
});
