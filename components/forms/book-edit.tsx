import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { Book } from '~/lib/type';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface BookEditFormProps {
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  updateBook: (book: Book) => void;
}

const BookEditForm: React.FC<BookEditFormProps> = ({ selectedBook, setSelectedBook, bottomSheetRef, updateBook }) => {
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedBook) {
      setName(selectedBook.name || '');
      setImage(selectedBook.meta?.cover || null);
    }
  }, [selectedBook]);

  const handleSave = () => {
    if (selectedBook) {
      updateBook({
        ...selectedBook,
        name,
        meta: {
          ...selectedBook.meta,
          cover: image,
        },
      });
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
        setImage(result.assets[0].uri);
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
      backgroundStyle={{
        backgroundColor: '#14161b',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 3,
        borderColor: 'rgba(172, 113, 245, 0.5)',
      }}
      handleIndicatorStyle={{ backgroundColor: '#8C31FF' }}
    >
      <BottomSheetView className='bg-[#14161b] p-4 text-white'>
        <View className='px-10 py-5'>
          <Text className='mb-4 text-lg font-semibold text-white'>Edit Book Details</Text>

          {/* Book Title */}
          <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-700'>Book Title</Text>
            <Input
              className='mt-2 rounded-lg p-2 text-white'
              placeholder='Enter book title'
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          {/* Book Cover */}
          <View className='mb-4'>
            <Text className='text-md font-medium text-gray-700'>Book Cover</Text>
            <TouchableOpacity onPress={pickImage} className='mt-2'>
              <View className='h-32 w-32 overflow-hidden rounded-xl bg-white/10'>
                {image ? (
                  <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
                ) : (
                  <View className='flex-1 items-center justify-center'>
                    <Text className='text-white'>Upload Cover</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Save Changes Button */}
          <Button size='lg' className='mb-5 mt-8 w-full rounded-2xl bg-[#8C31FF]' onPress={handleSave}>
            <View className='w-full flex-row items-center justify-center gap-5'>
              <Text className='text-xl font-bold text-white'>Save Changes</Text>
            </View>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookEditForm;
