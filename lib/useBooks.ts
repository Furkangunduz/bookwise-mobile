import { useEffect, useState } from 'react';
import { Book, deleteBook, getBooks, saveBook } from './book-storage';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBooks = async () => {
    setIsLoading(true);
    const loadedBooks = await getBooks();
    setBooks(loadedBooks.sort((a, b) => b.addedAt.localeCompare(a.addedAt)));
    setIsLoading(false);
  };

  const addBook = async (bookData: Omit<Book, 'id'>) => {
    const newBook = await saveBook(bookData);
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const removeBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return { books, isLoading, addBook, removeBook };
}; 