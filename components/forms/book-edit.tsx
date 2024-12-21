import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Book } from '~/lib/type';

interface BookEditFormProps {
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
}

const BookEditForm: React.FC<BookEditFormProps> = ({ selectedBook, setSelectedBook, bottomSheetRef }) => {
  const handleSave = () => {
    if (selectedBook) {
      // saveMetaData(selectedBook);
    }
    bottomSheetRef.current?.close();
    setSelectedBook(null);
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your media library to upload an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        const selectedImageUri = result.assets[0].uri;
        if (selectedBook) {
          setSelectedBook({
            ...selectedBook,
            meta: { ...selectedBook.meta, cover: selectedImageUri },
          });
        }
      }
    } catch (error) {
      console.error('Image Picker Error:', error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      enablePanDownToClose
      onChange={(index) => {
        if (index === -1) {
          bottomSheetRef.current?.close();
          setSelectedBook(null);
        }
      }}
      keyboardBehavior='interactive'
      animateOnMount={true}
    >
      <BottomSheetView className='rounded-t-3xl bg-white p-4'>
        <Text className='mb-4 text-lg font-semibold text-black'>Edit Book Details</Text>

        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-700'>Book Cover</Text>
          <TouchableOpacity onPress={pickImage} className='mt-2'>
            <View className='h-48 w-32 overflow-hidden rounded-lg bg-gray-300'>
              {selectedBook?.meta?.cover ? (
                <Image source={{ uri: selectedBook.meta.cover }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
              ) : (
                <View className='flex-1 items-center justify-center'>
                  <Text className='text-gray-500'>Upload Cover</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-700'>Book Title</Text>
          <TextInput
            className='mt-2 rounded-lg border border-gray-300 p-2 text-black'
            placeholder='Enter book title'
            value={selectedBook?.name || ''}
            onChangeText={(text) => {
              if (selectedBook) {
                setSelectedBook({ ...selectedBook, name: text });
              }
            }}
          />
        </View>

        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-700'>Author</Text>
          <TextInput
            className='mt-2 rounded-lg border border-gray-300 p-2 text-black'
            placeholder='Enter author name'
            value={selectedBook?.meta?.author || ''}
            onChangeText={(text) => {
              if (selectedBook?.meta) {
                setSelectedBook({
                  ...selectedBook,
                  meta: { ...selectedBook.meta, author: text },
                });
              }
            }}
          />
        </View>

        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-700'>Description</Text>
          <TextInput
            className='mt-2 rounded-lg border border-gray-300 p-2 text-black'
            placeholder='Enter book description'
            multiline
            numberOfLines={4}
            value={selectedBook?.meta?.description || ''}
            onChangeText={(text) => {
              if (selectedBook?.meta) {
                setSelectedBook({
                  ...selectedBook,
                  meta: { ...selectedBook.meta, description: text },
                });
              }
            }}
          />
        </View>

        <View>
          <Button title='Save Changes' onPress={handleSave} color='#8C31FF' />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookEditForm;
