/* eslint-disable @typescript-eslint/no-use-before-define */
import { Bookmark, useReader } from '@epubjs-react-native/core';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BookmarkIcon, TrashIcon } from 'lucide-react-native';
import React, { forwardRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton } from '~/components/icon-button';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/colors';

interface Props {
  onClose: () => void;
}
export type Ref = BottomSheetModalMethods;

export const BookmarksList = forwardRef<Ref, Props>(({ onClose }, ref) => {
  const snapPoints = React.useMemo(() => ['25%', '50%', '75%'], []);
  const { bookmarks, removeBookmark, goToLocation, theme } = useReader();

  const handleRemoveBookmark = React.useCallback(
    (bookmark: Bookmark) => {
      removeBookmark(bookmark);
    },
    [removeBookmark]
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: COLORS.ui.modal,
        }}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Bookmarks</Text>
            <Button
              variant="ghost"
              onPress={onClose}
            >
              <Text style={styles.closeButton}>Close</Text>
            </Button>
          </View>

          {bookmarks.map((bookmark) => (
            <View key={bookmark.id} style={styles.bookmarkContainer}>
              <TouchableOpacity
                style={styles.bookmarkInfo}
                onPress={() => {
                  goToLocation(bookmark.location.start.location.toString());
                  onClose();
                }}
              >
                <View style={styles.bookmarkIcon}>
                  <IconButton
                    icon={BookmarkIcon}
                    size={20}
                    onPress={() => {}}
                  />
                </View>
                <View style={styles.bookmarkInfoText}>
                  <Text style={styles.bookmarkText}>
                    Location: {bookmark.location.start.location}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleRemoveBookmark(bookmark)}
              >
                <TrashIcon size={20} color={COLORS.status.error} />
              </TouchableOpacity>
            </View>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.ui.modal,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  closeButton: {
    color: COLORS.text.secondary,
  },
  bookmarkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.secondary,
  },
  bookmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookmarkIcon: {
    marginRight: 12,
  },
  bookmarkInfoText: {
    flex: 1,
  },
  bookmarkText: {
    color: COLORS.text.primary,
    fontSize: 16,
  },
});
