/* eslint-disable @typescript-eslint/no-use-before-define */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useReader } from '@epubjs-react-native/core';
import {
  ArrowLeft,
  Bookmark,
  BookmarkPlus,
  Highlighter,
  List,
  Search,
  Settings,
  SettingsIcon,
  Type,
  ZoomIn,
  ZoomOut
} from 'lucide-react-native';
import { COLORS } from '~/lib/colors';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '../utils';

interface Props {
  currentFontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  switchTheme: () => void;
  switchFontFamily: () => void;
  onPressSearch: () => void;
  onOpenBookmarksList: () => void;
  onOpenTableOfContents: () => void;
  onOpenAnnotationsList: () => void;
}

export function Header({
  currentFontSize,
  increaseFontSize,
  decreaseFontSize,
  switchTheme,
  switchFontFamily,
  onPressSearch,
  onOpenBookmarksList,
  onOpenTableOfContents,
  onOpenAnnotationsList,
}: Props) {
  const navigation = useNavigation();
  const {
    theme,
    bookmarks,
    addBookmark,
    removeBookmark,
    getCurrentLocation,
    isBookmarked,
  } = useReader();

  const [showSettings, setShowSettings] = useState(false);

  const handleChangeBookmark = () => {
    const location = getCurrentLocation();

    if (!location) return;

    if (isBookmarked) {
      const bookmark = bookmarks.find(
        (item) =>
          item.location.start.cfi === location?.start.cfi &&
          item.location.end.cfi === location?.end.cfi
      );

      if (!bookmark) return;
      removeBookmark(bookmark);
    } else addBookmark(location);
  };

  const IconButton = ({ icon: Icon, onPress, onLongPress, size = 20, disabled }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      className="p-2 rounded-full"
      style={styles.iconButton}
    >
      <Icon size={size} color={COLORS.text.primary} strokeWidth={2} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <IconButton
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
        />
      </View>

      <View style={styles.rightSection}>
        {showSettings ? (
          <>
            <IconButton
              icon={ZoomOut}
              onPress={decreaseFontSize}
              disabled={currentFontSize <= MIN_FONT_SIZE}
            />
            <IconButton
              icon={ZoomIn}
              onPress={increaseFontSize}
              disabled={currentFontSize >= MAX_FONT_SIZE}
            />
            <IconButton
              icon={Type}
              onPress={switchFontFamily}
            />
          </>
        ) : (
          <>
            <IconButton
              icon={Search}
              onPress={onPressSearch}
            />
            <IconButton
              icon={isBookmarked ? BookmarkPlus : Bookmark}
              onPress={handleChangeBookmark}
            />
            <IconButton
              icon={Highlighter}
              onPress={onOpenAnnotationsList}
            />
            <IconButton
              icon={List}
              onPress={onOpenTableOfContents}
            />
          </>
        )}
        <IconButton
          icon={showSettings ? Settings : SettingsIcon}
          onPress={() => setShowSettings((oldState) => !oldState)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.ui.header,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.secondary,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    backgroundColor: COLORS.background.secondary,
  },
});
