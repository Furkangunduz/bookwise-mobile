import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '~/lib/colors';
import { Book } from '~/lib/type';
import { Button } from '../ui/button';

interface BookEditFormProps {
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
  updateBook: (book: Book) => void;
  handleDeleteBook: (id: string) => void;
}

const BookEditForm: React.FC<BookEditFormProps> = ({ 
  selectedBook, 
  setSelectedBook, 
  bottomSheetRef, 
  updateBook,
  handleDeleteBook 
}) => {
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

  const handleDelete = () => {
    if (!selectedBook) return;

    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            handleDeleteBook(selectedBook.id);
            bottomSheetRef.current?.close();
            setSelectedBook(null);
          },
        },
      ],
      { cancelable: true }
    );
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
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0].base64) {
        const coverDir = `${FileSystem.documentDirectory}covers`;
        await FileSystem.makeDirectoryAsync(coverDir, { intermediates: true });

        const coverFileName = `${Date.now()}_cover.jpg`.replace(/ /g, '%20');
        const coverPath = `${coverDir}/${coverFileName}`;

        try {
          await FileSystem.writeAsStringAsync(coverPath, result.assets[0].base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImage(`file://${coverPath}`);
        } catch (error) {
          console.error('Error saving cover:', error);
          Alert.alert('Error', 'Failed to save cover image');
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
      snapPoints={['50%']}
      onChange={(index) => {
        if (index === -1) {
          bottomSheetRef.current?.close();
          setSelectedBook(null);
        }
      }}
      backdropComponent={BottomSheetBackdrop}
      keyboardBehavior='interactive'
      keyboardBlurBehavior='restore'
      animateOnMount={true}
      backgroundStyle={{
        backgroundColor: COLORS.background.primary,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 3,
        borderColor: 'rgba(172, 113, 245, 0.5)',
      }}
      handleIndicatorStyle={{ backgroundColor: COLORS.accent.primary }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Book Details</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={20} color={COLORS.status.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Book Title</Text>
            <BottomSheetTextInput
              style={styles.input}
              placeholder='Enter book title'
              placeholderTextColor={COLORS.text.muted}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={styles.coverContainer}>
            <Text style={styles.label}>Book Cover</Text>
            <TouchableOpacity onPress={pickImage} style={styles.coverButton}>
              <View style={styles.coverPreview}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.coverImage} resizeMode='cover' />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Text style={styles.uploadText}>Upload Cover</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  deleteButton: {
    padding: 8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: COLORS.text.secondary,
  },
  input: {
    backgroundColor: COLORS.ui.input,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text.primary,
    fontSize: 16,
  },
  coverContainer: {
    marginBottom: 24,
  },
  coverButton: {
    marginTop: 8,
  },
  coverPreview: {
    width: 128,
    height: 128,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.background.secondary,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: COLORS.text.secondary,
    fontSize: 14,
  },
});

export default BookEditForm;
