import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import { Animated, FlatList, Image, Pressable, Text, View } from 'react-native';
import { Book } from '~/lib/type';

interface BookListProps {
  books: Book[];
  onLongPress: (book: Book) => void;
  formatFileSize: (size: number) => string;
}

const BookList: React.FC<BookListProps> = ({ books, onLongPress, formatFileSize }) => {
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      numColumns={2}
      ListFooterComponent={<View className='h-16' />}
      style={{ paddingHorizontal: 20 }}
      columnWrapperClassName='mb-6 justify-between space-x-5'
      renderItem={({ item }) => <RenderItem book={item} onLongPress={onLongPress} formatFileSize={formatFileSize} />}
    />
  );
};

interface RenderItemProps {
  book: Book;
  onLongPress: (book: Book) => void;
  formatFileSize: (size: number) => string;
}

const RenderItem: React.FC<RenderItemProps> = ({ book, onLongPress, formatFileSize }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, { toValue: 1.05, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress(book);
  };

  return (
    <Pressable className='max-w-[47%] flex-1' onPressIn={handlePressIn} onPressOut={handlePressOut} onLongPress={handleLongPress}>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <View className='overflow-hidden rounded-xl border border-border bg-card'>
          <Image
            source={book.meta?.cover ? { uri: book.meta.cover } : require('~/assets/images/book-cover-default.webp')}
            style={{
              width: '100%',
              height: 150,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
            resizeMode='cover'
          />
          <View className='flex flex-col justify-between p-3'>
            <Text className='text-xs text-muted-foreground'>
              {formatFileSize(book.size)} • {new Date(book.addedAt).toLocaleDateString()}
            </Text>
            <View style={{ height: 55, justifyContent: 'flex-start', overflow: 'hidden' }}>
              <Text className='mt-2 text-sm font-semibold text-foreground' numberOfLines={3}>
                {book.name}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default BookList;
