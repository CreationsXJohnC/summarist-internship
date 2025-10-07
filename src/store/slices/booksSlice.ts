import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

interface BooksState {
  selectedBook: Book | null;
  recommendedBooks: Book[];
  suggestedBooks: Book[];
  searchResults: Book[];
  library: Book[];
  finishedBooks: Book[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: BooksState = {
  selectedBook: null,
  recommendedBooks: [],
  suggestedBooks: [],
  searchResults: [],
  library: [],
  finishedBooks: [],
  isLoading: false,
  error: null,
  searchQuery: '',
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedBook: (state, action: PayloadAction<Book | null>) => {
      state.selectedBook = action.payload;
    },
    setRecommendedBooks: (state, action: PayloadAction<Book[]>) => {
      state.recommendedBooks = action.payload;
    },
    setSuggestedBooks: (state, action: PayloadAction<Book[]>) => {
      state.suggestedBooks = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Book[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addToLibrary: (state, action: PayloadAction<Book>) => {
      const exists = state.library.find(book => book.id === action.payload.id);
      if (!exists) {
        state.library.push(action.payload);
      }
    },
    removeFromLibrary: (state, action: PayloadAction<string>) => {
      state.library = state.library.filter(book => book.id !== action.payload);
    },
    addToFinished: (state, action: PayloadAction<Book>) => {
      const exists = state.finishedBooks.find(book => book.id === action.payload.id);
      if (!exists) {
        state.finishedBooks.push(action.payload);
      }
    },
    // Added for hydration/persistence and unmarking as read
    setLibrary: (state, action: PayloadAction<Book[]>) => {
      state.library = Array.isArray(action.payload) ? action.payload : [];
    },
    setFinishedBooks: (state, action: PayloadAction<Book[]>) => {
      state.finishedBooks = Array.isArray(action.payload) ? action.payload : [];
    },
    removeFromFinished: (state, action: PayloadAction<string>) => {
      state.finishedBooks = state.finishedBooks.filter(book => book.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setSelectedBook,
  setRecommendedBooks,
  setSuggestedBooks,
  setSearchResults,
  setSearchQuery,
  addToLibrary,
  removeFromLibrary,
  addToFinished,
  setLibrary,
  setFinishedBooks,
  removeFromFinished,
  setError,
  clearError,
} = booksSlice.actions;

export default booksSlice.reducer;