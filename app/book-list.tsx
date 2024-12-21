import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { PlusSquare } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { completeOnboarding } from '~/lib/onboarding';
import { Book } from '~/lib/type';

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const booksJson = await AsyncStorage.getItem('books');
      const loadedBooks: Book[] = booksJson ? JSON.parse(booksJson) : [];
      setBooks(loadedBooks.sort((a, b) => b.lastReadAt - a.lastReadAt));
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
    completeOnboarding();
  }, [loadBooks]);

  const handleDeleteBook = async (id: string) => {
    try {
      const updatedBooks = books.filter((book) => book.id !== id);
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
      Alert.alert('Error', 'Failed to delete book');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/epub+zip', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (!file.mimeType?.includes('epub') && !file.mimeType?.includes('pdf')) {
        Alert.alert('Error', 'Please select an EPUB or PDF file');
        return;
      }

      if (!file.size) {
        Alert.alert('Error', 'Invalid file size');
        return;
      }

      const newBook: Book = {
        id: Date.now().toString(),
        name: file.name,
        uri: file.uri,
        type: file.mimeType || 'application/octet-stream',
        size: file.size,
        addedAt: Date.now(),
        lastReadAt: Date.now(),
      };

      const updatedBooks = [...books, newBook];
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks.sort((a, b) => b.addedAt - a.addedAt));
      Alert.alert('Success', 'Book added successfully!');
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload book');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (books.length === 0 && !isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center gap-10 bg-[#14161B] px-10 font-inter'>
        <Image source={require('~/assets/images/book-upload.png')} style={{ width: 150, height: 150 }} />
        <Text className='text-center text-3xl font-bold text-white'>Upload your favorite book and start your journey!</Text>
        <Text className='text-center text-2xl font-light text-[#83899F]'>You can upload book in .EPUB or PDF format</Text>
        <Button size={'lg'} className='w-full rounded-2xl bg-[#8C31FF]' onPress={pickDocument}>
          <View className='w-full flex-row items-center justify-center gap-5'>
            <PlusSquare fill={'white'} stroke={'#8C31FF'} />
            <Text className='text-xl font-bold text-white'>Add new book</Text>
          </View>
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-[#14161B] font-inter'>
      <Text className='my-5 text-center text-2xl text-[#83899F]'>Last opened books</Text>

      <FlatList
        className='px-4'
        data={books}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={loadBooks}
        renderItem={({ item }) => (
          <View className='mb-4 overflow-hidden rounded-xl border border-border bg-card'>
            <View className='flex-row items-center justify-between p-4'>
              <View className='flex-1'>
                <Text className='text-lg font-semibold text-foreground'>{item.name}</Text>
                <Text className='text-sm text-muted-foreground'>
                  {formatFileSize(item.size)} • {new Date(item.addedAt).toLocaleDateString()}
                </Text>
              </View>
              <View className='flex-row gap-2'>
                <Button
                  variant='secondary'
                  size='icon'
                  onPress={() => {
                    console.log('Open book:', item.uri);
                  }}
                >
                  <Icons.Book size={18} />
                </Button>
                <Button variant='destructive' size='icon' onPress={() => handleDeleteBook(item.id)}>
                  <Icons.Trash size={18} />
                </Button>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className='flex-1 items-center justify-center py-20'>
            <Text className='text-center text-muted-foreground'>
              {isLoading ? 'Loading books...' : 'No books added yet. Tap the + button to get started.'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
