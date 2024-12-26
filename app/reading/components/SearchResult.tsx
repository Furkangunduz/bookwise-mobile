/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  SearchResult as SearchResultType,
  useReader,
} from '@epubjs-react-native/core';
import { Bookmark } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';

interface Props {
  searchTerm: string;
  searchResult: SearchResultType;
  onPress: (searchResult: SearchResultType) => void;
}

function SearchResult({ searchTerm, searchResult, onPress }: Props) {
  const { theme } = useReader();

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = searchResult.excerpt.split(regex);
  return (
    <TouchableOpacity
      className="w-full flex-row justify-between items-center my-2.5"
      onPress={() => onPress(searchResult)}
    >
      <View className="justify-center items-center">
        <Button
          variant="ghost"
          size="icon"
          className={"text-muted-foreground"}
        >
          <Bookmark className="h-5 w-5" />
        </Button>
      </View>

      <View className="w-[85%]">
        <Text
          numberOfLines={1}
          className="mb-0.5 text-foreground"
        >
          Chapter: {searchResult.section?.label}
        </Text>

        <Text className="italic text-foreground">
          &quot;
          {parts.filter(String).map((part, index) => {
            return regex.test(part) ? (
              <Text className="bg-yellow-200 text-foreground" key={`${index}-part-highlight`}>
                {part}
              </Text>
            ) : (
              <Text
                key={`${index}-part`}
                className="text-foreground"
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
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: '85%',
  },
  chapter: { marginBottom: 2 },
  excerpt: { fontStyle: 'italic' },
  highlight: { backgroundColor: 'yellow' },
});

export default SearchResult;
