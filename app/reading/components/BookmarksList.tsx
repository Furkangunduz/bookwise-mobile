/* eslint-disable @typescript-eslint/no-use-before-define */
import { Bookmark, useReader } from '@epubjs-react-native/core';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { BookmarkIcon, TrashIcon } from 'lucide-react-native';
import React, { forwardRef, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton } from '~/components/icon-button';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { contrast } from '../utils';

interface Props {
  onClose: () => void;
}
export type Ref = BottomSheetModalMethods;

export const BookmarksList = forwardRef<Ref, Props>(({ onClose }, ref) => {
  const {
    bookmarks,
    removeBookmark,
    removeBookmarks,
    isBookmarked,
    updateBookmark,
    goToLocation,
    currentLocation,
    theme,
  } = useReader();

  const snapPoints = React.useMemo(() => ['50%', '75%'], []);
  const [note, setNote] = useState('');
  const [currentBookmark, setCurrentBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    if (isBookmarked) {
      const bookmark = bookmarks.find(
        (item) =>
          item.location?.start.cfi === currentLocation?.start.cfi &&
          item.location?.end.cfi === currentLocation?.end.cfi
      );

      if (!bookmark) return;

      setCurrentBookmark(bookmark);
      setNote(bookmark.data?.note || '');
    }
  }, [
    bookmarks,
    currentLocation?.end.cfi,
    currentLocation?.start.cfi,
    isBookmarked,
  ]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        index={1}
        enablePanDownToClose
        snapPoints={snapPoints}
        handleStyle={{ backgroundColor: theme.body.background }}
      >
        <BottomSheetView className="flex-1 items-center px-5 bg-background">
          <View className="w-full flex-row justify-between items-center">
            <Text  className="text-foreground">
              Bookmarks
            </Text>

            {bookmarks.length > 0 && (
              <Button
                variant="ghost"
                onPress={() => {
                  removeBookmarks();
                  onClose();
                }}
              >
                <Text>

                Clear All
                </Text>
              </Button>
            )}
          </View>

          {bookmarks.length === 0 && (
            <View className="mt-4">
              <Text
               
                className="font-italic text-foreground"
              >
                No bookmarks...
              </Text>
            </View>
          )}

          {isBookmarked && (
            <View className="w-full">
              <BottomSheetTextInput
                defaultValue={note}
                className="w-full h-16 mt-2 border border-solid border-gray-200 rounded-lg p-2 bg-gray-100"
                multiline
                placeholder="Type an annotation here..."
                placeholderTextColor={contrast[theme.body.background]}
                onChangeText={(text) => setNote(text)}
              />

              <Button
                variant="ghost"
                className="self-end"
                onPress={() => updateBookmark(currentBookmark!.id, { note })}
              >
                <Text>

                Update Annotation
                </Text>
              </Button>
            </View>
          )}

          {bookmarks.map((bookmark) => (
            <View key={bookmark.id} className="flex-row justify-between items-center my-1">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => {
                  goToLocation(bookmark.location.start.cfi);
                  onClose();
                }}
              >
                <View className="w-7 h-7 rounded-full mr-2.5 border border-solid">
                  <IconButton
                    icon={BookmarkIcon}
                    size={20}
                    onPress={() => {
                      goToLocation(bookmark.location.start.cfi);
                      onClose();
                    }}
                  />
                </View>

                <View className="w-32">
                  <Text
                    className="font-semibold text-foreground"
                  >
                    Chapter: {bookmark.section?.label}
                  </Text>

                  <Text
                    className="italic text-foreground"
                    numberOfLines={2}
                  >
                    &quot;{bookmark.text}&quot;
                  </Text>
                </View>
              </TouchableOpacity>

              <IconButton
                icon={TrashIcon}
                size={20}
                onPress={() => {
                  removeBookmark(bookmark);
                  onClose();
                }}
              />
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
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bookmarkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  bookmarkInfo: {
    flexDirection: 'row',
  },
  bookmarkInfoText: {
    width: '80%',
  },
  title: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkLocationNumber: {
    marginTop: -12,
  },
  input: {
    width: '100%',
    height: 64,
    marginTop: 8,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});
