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
    >
      <Icon size={size} color="#ffffff" strokeWidth={2} />
    </TouchableOpacity>
  );

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <IconButton
        icon={ArrowLeft}
        size={22}
        onPress={() => navigation.goBack()}
      />

      <View className="flex-row items-center justify-end">
        {showSettings && (
          <TouchableOpacity
            onPress={switchTheme}
            className="w-6 h-6 rounded-full border-2 border-white mr-2.5"
            style={{ backgroundColor: theme.body.background }}
          />
        )}

        {showSettings && (
          <IconButton
            icon={ZoomIn}
            onPress={increaseFontSize}
            disabled={currentFontSize === MAX_FONT_SIZE}
          />
        )}

        {showSettings && (
          <IconButton
            icon={ZoomOut}
            onPress={decreaseFontSize}
            disabled={currentFontSize === MIN_FONT_SIZE}
          />
        )}

        {showSettings && (
          <IconButton
            icon={Type}
            onPress={switchFontFamily}
          />
        )}

        {!showSettings && (
          <IconButton
            icon={Search}
            onPress={onPressSearch}
          />
        )}

        {!showSettings && (
          <IconButton
            icon={isBookmarked ? Bookmark : BookmarkPlus}
            onPress={handleChangeBookmark}
            onLongPress={onOpenBookmarksList}
          />
        )}

        {!showSettings && (
          <IconButton
            icon={Highlighter}
            onPress={onOpenAnnotationsList}
          />
        )}

        {!showSettings && (
          <IconButton
            icon={List}
            onPress={onOpenTableOfContents}
          />
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
    marginHorizontal: 10,
    backgroundColor: 'red',
  },
  themeIcon: {
    width: 24,
    height: 24,
    borderRadius: 32,
    borderWidth: 2,
    marginRight: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});
