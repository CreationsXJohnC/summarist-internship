import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isAuthModalOpen: boolean;
  authModalType: 'login' | 'register' | 'forgot-password';
  isSidebarOpen: boolean;
  isLoading: boolean;
  loadingText: string;
}

const initialState: UiState = {
  isAuthModalOpen: false,
  authModalType: 'login',
  isSidebarOpen: false,
  isLoading: false,
  loadingText: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<'login' | 'register' | 'forgot-password'>) => {
      state.isAuthModalOpen = true;
      state.authModalType = action.payload;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalType: (state, action: PayloadAction<'login' | 'register' | 'forgot-password'>) => {
      state.authModalType = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; text?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingText = action.payload.text || '';
    },
  },
});

export const {
  openAuthModal,
  closeAuthModal,
  setAuthModalType,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;