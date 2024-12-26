import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '~/lib/colors';
import { Book } from '~/lib/type';

interface BookListProps {
  books: Book[];
  onLongPress: (book: Book) => void;
  formatFileSize: (size: number) => string;
}

const BookList: React.FC<BookListProps> = ({ books, onLongPress, formatFileSize }) => {
  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => {
      const lastReadDiff = b.lastReadAt - a.lastReadAt;
      if (lastReadDiff !== 0) return lastReadDiff;
      return b.addedAt - a.addedAt;
    });
  }, [books]);

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (books.length > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [books.length]);

  return (
    <FlatList
      ref={listRef}
      data={sortedBooks}
      keyExtractor={(item) => item.id}
      numColumns={2}
      ListFooterComponent={<View style={{ height: 64 }} />}
      style={styles.list}
      columnWrapperStyle={styles.columnWrapper}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews={true}
      initialNumToRender={6}
      renderItem={({ item, index }) => (
        <RenderItem 
          book={item} 
          onLongPress={onLongPress} 
          formatFileSize={formatFileSize}
          index={index}
          isNew={item.id === sortedBooks[0]?.id && index === 0}
        />
      )}
    />
  );
};

interface RenderItemProps {
  book: Book;
  onLongPress: (book: Book) => void;
  formatFileSize: (size: number) => string;
  index: number;
  isNew: boolean;
}

const RenderItem: React.FC<RenderItemProps> = ({ book, onLongPress, formatFileSize, index, isNew }) => {
  const scaleValue = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const router = useRouter();

  useEffect(() => {
    if (isNew) {
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [isNew]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, { 
      toValue: 1.05, 
      useNativeDriver: true 
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, { 
      toValue: 1, 
      useNativeDriver: true 
    }).start();
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress(book);
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/reading/${book.id}`);
  };

  return (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          opacity: scaleValue,
          transform: [
            { scale: scaleValue },
            {
              translateY: scaleValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleLongPress}
        onPress={handlePress}
        style={styles.pressable}
      >
        <View style={styles.card}>
          <Image
            source={book.meta?.cover ? { uri: book.meta.cover } : require('~/assets/images/book-cover-default.webp')}
            style={styles.coverImage}
            resizeMode='cover'
            defaultSource={require('~/assets/images/book-cover-default.webp')}
            onError={(error) => {
              console.warn('Error loading cover image:', error.nativeEvent.error);
            }}
          />
          <View style={styles.bookInfo}>
            <Text style={styles.metadata}>
              {formatFileSize(book.size)} • {new Date(book.addedAt).toLocaleDateString()}
            </Text>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={3}>
                {book.name}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  columnWrapper: {
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '47%',
  },
  pressable: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.background.secondary,
    backgroundColor: COLORS.background.secondary,
  },
  coverImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  bookInfo: {
    padding: 12,
  },
  metadata: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  titleContainer: {
    height: 55,
    justifyContent: 'flex-start',
    overflow: 'hidden',
    marginTop: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});

export default BookList;
