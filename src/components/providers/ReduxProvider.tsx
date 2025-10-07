'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, setHydrated } from '@/store/slices/authSlice';
import { setLibrary, setFinishedBooks } from '@/store/slices/booksSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

function PersistGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Hydrate auth + books state from localStorage on initial mount
  useEffect(() => {
    try {
      // Auth
      const savedAuth = localStorage.getItem('authUser');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && typeof parsed === 'object') {
          dispatch(setUser(parsed));
        }
      }

      // Books: library and finished
      const savedLibrary = localStorage.getItem('booksLibrary');
      const savedFinished = localStorage.getItem('booksFinished');
      if (savedLibrary) {
        const lib = JSON.parse(savedLibrary);
        if (Array.isArray(lib)) dispatch(setLibrary(lib));
      }
      if (savedFinished) {
        const fin = JSON.parse(savedFinished);
        if (Array.isArray(fin)) dispatch(setFinishedBooks(fin));
      }
    } catch (e) {
      console.error('Failed to hydrate persisted state', e);
    } finally {
      dispatch(setHydrated(true));
    }
  }, [dispatch]);

  // Persist auth state whenever user changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('authUser');
      }
    } catch (e) {
      console.error('Failed to persist auth user', e);
    }
  }, [user]);

  // Persist books state whenever library or finishedBooks changes
  const library = useAppSelector((state) => state.books.library);
  const finishedBooks = useAppSelector((state) => state.books.finishedBooks);
  useEffect(() => {
    try {
      localStorage.setItem('booksLibrary', JSON.stringify(library));
      localStorage.setItem('booksFinished', JSON.stringify(finishedBooks));
    } catch (e) {
      console.error('Failed to persist books state', e);
    }
  }, [library, finishedBooks]);

  return children as React.ReactElement;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate>{children}</PersistGate>
    </Provider>
  );
}