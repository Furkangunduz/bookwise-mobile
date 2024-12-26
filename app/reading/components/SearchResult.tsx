/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
    SearchResult as SearchResultType
} from '@epubjs-react-native/core';
import { Bookmark } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/colors';

interface Props {
  searchTerm: string;
  searchResult: SearchResultType;
  onPress: (searchResult: SearchResultType) => void;
}

function SearchResult({ searchTerm, searchResult, onPress }: Props) {
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = searchResult.excerpt.split(regex);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(searchResult)}
    >
      <View style={styles.iconContainer}>
        <Button
          variant="ghost"
          size="icon"
          style={styles.iconButton}
        >
          <Bookmark size={20} color={COLORS.text.secondary} />
        </Button>
      </View>

      <View style={styles.contentContainer}>
        <Text
          numberOfLines={1}
          style={styles.chapterText}
        >
          Chapter: {searchResult.section?.label}
        </Text>

        <Text style={styles.excerptText}>
          &quot;
          {parts.filter(String).map((part, index) => {
            return regex.test(part) ? (
              <Text style={styles.highlightText} key={`${index}-part-highlight`}>
                {part}
              </Text>
            ) : (
              <Text
                key={`${index}-part`}
                style={styles.normalText}
              >
                {part}
              </Text>
            );
          })}
          &quot;
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: COLORS.background.secondary,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chapterText: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  excerptText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  highlightText: {
    backgroundColor: COLORS.highlight.yellow,
    color: COLORS.text.primary,
  },
  normalText: {
    color: COLORS.text.secondary,
  },
});

export default SearchResult;
