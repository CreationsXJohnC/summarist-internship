'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, setHydrated } from '@/store/slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

function PersistGate({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Hydrate auth state from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('authUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          dispatch(setUser(parsed));
        }
      }
    } catch (e) {
      console.error('Failed to hydrate auth user', e);
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

  return children as React.ReactElement;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate>{children}</PersistGate>
    </Provider>
  );
}