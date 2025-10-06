import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isGuest?: boolean;
  subscription?: {
    status: 'active' | 'inactive' | 'trial';
    plan: 'basic' | 'premium';
    expiresAt?: Date;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  success: string | null;
  hasHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  success: null,
  hasHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.success = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setHydrated: (state, action: PayloadAction<boolean>) => {
      state.hasHydrated = action.payload;
    },
  },
});

export const { setLoading, setUser, setError, setSuccess, clearError, logout, setHydrated } = authSlice.actions;
export default authSlice.reducer;