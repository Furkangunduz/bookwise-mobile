import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Book, Metadata } from '~/lib/type';

export const useBookManagement = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUploadedBook, setlastUploadedBook] = useState<Book | null>(null);
  const [booksUploading, setBooksUploading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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

  const uploadBook = async () => {
    try {
      setBooksUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/epub+zip', 'application/pdf'],
        copyToCacheDirectory: false,
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

      const bookDir = `${FileSystem.cacheDirectory}books/${Date.now()}`;
      await FileSystem.makeDirectoryAsync(bookDir, { intermediates: true });
      
      const newUri = `${bookDir}/${file.name}`;
      await FileSystem.copyAsync({
        from: file.uri,
        to: newUri
      });

      const newBook: Book = {
        id: Date.now().toString(),
        name: file.name,
        uri: newUri,
        type: file.mimeType || 'application/octet-stream',
        size: file.size,
        addedAt: Date.now(),
        lastReadAt: Date.now(),
      };

      setlastUploadedBook(newBook);

      const updatedBooks = [...books, newBook];
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks.sort((a, b) => b.addedAt - a.addedAt));
      Alert.alert('Success', 'Book added successfully!');
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload book');
    } finally {
      setBooksUploading(false);
    }
  };

  const saveMetaData = async (meta: Metadata) => {
    try {
      const booksJson = await AsyncStorage.getItem('books');
      const parsedBooks = booksJson ? JSON.parse(booksJson) : [];
      const updatedBooks = parsedBooks.map((book: Book) => {
        if (book.id === lastUploadedBook?.id) {
          return {
            ...book,
            meta,
          };
        }
        return book;
      });
      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const updateBook = async (updatedBook: Book) => {
    try {
      const updatedBooks = books.map((book) => {
        if (book.id === updatedBook.id) {
          return updatedBook;
        }
        return book;
      });

      await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
      setBooks(updatedBooks);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const findBookById = async (id: string) => {
    try {
      const booksJson = await AsyncStorage.getItem('books');
      const books: Book[] = booksJson ? JSON.parse(booksJson) : [];

      return books?.find((book) => book.id === id);
    } catch (error) {}
  };

  const deleteAllBooks = async () => {
    try {
      await AsyncStorage.removeItem('books');
      setBooks([]);
    } catch (error) {
      console.error('Error deleting all books:', error);
    }
  };

  return {
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
    findBookById,
    deleteAllBooks,
  };
};
