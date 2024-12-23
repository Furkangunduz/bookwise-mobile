import BottomSheet from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { PlusSquare } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookList from '~/components/book-list';
import BookEditForm from '~/components/forms/book-edit';
import { Icons } from '~/components/icons';
import ReaderToGetMetaData from '~/components/reader-to-get-metadata';
import { Button } from '~/components/ui/button';
import { useBookManagement } from '~/hooks/useBooksManagement';
import { completeOnboarding } from '~/lib/onboarding';
import { Book } from '~/lib/type';

export default function BooksView() {
  const {
    books,
    isLoading,
    booksUploading,
    loadBooks,
    handleDeleteBook,
    uploadBook,
    saveMetaData,
    formatFileSize,
    lastUploadedBook,
    selectedBook,
    setSelectedBook,
    updateBook,
  } = useBookManagement();

  useEffect(() => {
    completeOnboarding();
    loadBooks();
  }, [loadBooks]);

  const handleLongPress = (book: Book) => {
    setSelectedBook(book);
    bottomSheetRef.current?.expand();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  if (books.length === 0 && !isLoading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center gap-10 bg-[#14161B] px-10 font-inter'>
        <Image source={require('~/assets/images/book-upload.png')} style={{ width: 150, height: 150 }} />
        <Text className='text-center text-3xl font-bold text-white'>Upload your favorite book and start your journey!</Text>
        <Text className='text-center text-2xl font-light text-[#83899F]'>You can upload book in .EPUB or PDF format</Text>
        <Button size={'lg'} className='w-full rounded-2xl bg-[#8C31FF]' onPress={uploadBook}>
          <View className='w-full flex-row items-center justify-center gap-5'>
            <PlusSquare fill={'white'} stroke={'#8C31FF'} />
            <Text className='text-xl font-bold text-white'>Add new book</Text>
          </View>
        </Button>
        {lastUploadedBook && <ReaderToGetMetaData src={lastUploadedBook?.uri ?? null} setMetaData={saveMetaData} />}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-[#14161B] font-inter'>
      <Text className='my-5 text-center text-2xl text-[#83899F]'>Last opened books</Text>

      {booksUploading && (
        <View className='absolute bottom-0 left-0 right-0 top-0 z-20 h-screen w-full flex-row items-center justify-center bg-black bg-opacity-50'>
          <View className='duration-600 animate-spin transition-all'>
            <Icons.Loader size={45} className='animate-spin transition-all duration-100' />
          </View>
        </View>
      )}

      <BookList books={books} onLongPress={handleLongPress} formatFileSize={formatFileSize} />

      <View className='absolute bottom-8 left-0 right-0 bg-[#14161B] p-4'>
        <Button size='lg' className='w-full rounded-2xl bg-[#8C31FF]' onPress={uploadBook}>
          <View className='w-full flex-row items-center justify-center gap-5'>
            <PlusSquare fill='white' stroke='#8C31FF' />
            <Text className='text-xl font-bold text-white'>Add new book</Text>
          </View>
        </Button>
      </View>

      <BookEditForm selectedBook={selectedBook} setSelectedBook={setSelectedBook} bottomSheetRef={bottomSheetRef} updateBook={updateBook} />
    </SafeAreaView>
  );
}
