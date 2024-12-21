import { PlusSquare } from 'lucide-react-native';
import { useEffect } from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '~/components/icons';
import ReaderToGetMetaData from '~/components/reader-to-get-metadata';
import { Button } from '~/components/ui/button';
import { useBookManagement } from '~/hooks/useBooksManagement';

export default function BooksView() {
  const { books, isLoading, booksUploading, loadBooks, handleDeleteBook, pickDocument, saveMetaData, formatFileSize, latestPickedBook } =
    useBookManagement();

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

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
        {latestPickedBook && <ReaderToGetMetaData src={latestPickedBook?.uri ?? null} setMetaData={saveMetaData} />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-[#14161B] font-inter'>
      <Text className='my-5 text-center text-2xl text-[#83899F]'>Last opened books</Text>
      {booksUploading && (
        <View className='absolute left-0 top-0 h-full w-full flex-row items-center justify-center bg-black bg-opacity-50'>
          <Icons.Loader size={32} />
        </View>
      )}

      <FlatList
        className='px-4'
        data={books}
        keyExtractor={(item) => item.id}
        numColumns={2}
        refreshing={isLoading}
        onRefresh={loadBooks}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
        renderItem={({ item }) => (
          <View className='overflow-hidden rounded-xl border border-border bg-card' style={{ flex: 1, margin: 8 }}>
            <Image
              source={item.meta?.cover ? { uri: item.meta.cover } : require('~/assets/images/book-cover-default.webp')}
              style={{
                width: '100%',
                height: 150,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              resizeMode='cover'
            />
            <View className='p-4'>
              <Text className='text-lg font-semibold text-foreground' numberOfLines={1}>
                {item.name}
              </Text>
              <Text className='text-sm text-muted-foreground'>
                {formatFileSize(item.size)} • {new Date(item.addedAt).toLocaleDateString()}
              </Text>
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
