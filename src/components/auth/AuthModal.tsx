'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeAuthModal, setAuthModalType } from '@/store/slices/uiSlice';
import { setUser, setLoading, setError } from '@/store/slices/authSlice';
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { auth, db, analytics } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state: any) => state.ui.isAuthModalOpen);
  const modalType = useAppSelector((state: any) => state.ui.authModalType);
  const isLoading = useAppSelector((state: any) => state.auth.isLoading);
  const error = useAppSelector((state: any) => state.auth.error);
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    dispatch(closeAuthModal());
    setEmail('');
    setPassword('');
  };

  const handleGuestLogin = () => {
    dispatch(setLoading(true));
    // Simulate guest login
    setTimeout(() => {
      dispatch(setUser({
        uid: 'guest',
        email: 'guest@gmail.com',
        displayName: 'Guest User',
        isGuest: true,
      }));
      dispatch(setLoading(false));
      router.push('/for-you');
      handleClose();
    }, 800);
  };

  const handleGoogleLogin = async () => {
    try {
      dispatch(setLoading(true));
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL || null,
          provider: 'google',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (analytics) {
        logEvent(analytics, 'login', { method: 'google' });
      }

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isGuest: false,
      }));
      router.push('/for-you');
      handleClose();
    } catch (err: any) {
      const code = err?.code;
      const message = (err?.message || '').toLowerCase();
      if (code === 'auth/invalid-api-key' || message.includes('api-key-not-valid')) {
        dispatch(setError('Google sign-in is unavailable: Firebase API key is invalid or missing.'));
      } else if (code === 'auth/configuration-not-found') {
        dispatch(setError('Google sign-in is not configured for this project. Please enable the Google provider and authorize this domain.'));
      } else if (code === 'auth/unauthorized-domain') {
        dispatch(setError('This domain is not authorized for sign-in. Please add it in Firebase Authentication > Settings > Authorized domains.'));
      } else if (code === 'auth/popup-blocked') {
        dispatch(setError('Sign-in popup was blocked by the browser. Please allow popups and try again.'));
      } else if (code === 'auth/popup-closed-by-user') {
        dispatch(setError('Sign-in popup closed before completing authentication. Please try again.'));
      } else if (code === 'auth/network-request-failed') {
        dispatch(setError('Network error during sign-in. Check your connection and try again.'));
      } else {
        dispatch(setError(err?.message || 'Google sign-in failed. Please try again.'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(setError('Invalid email'));
      return;
    }

    if (modalType === 'register') {
      if (password.length < 6) {
        dispatch(setError('Short password'));
        return;
      }
    }

    try {
      dispatch(setLoading(true));

      if (modalType === 'login') {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || (user.email ? user.email.split('@')[0] : null),
            provider: 'password',
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );

        if (analytics) {
          logEvent(analytics, 'login', { method: 'password' });
        }
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : null),
          isGuest: false,
        }));
        router.push('/for-you');
        handleClose();
      } else if (modalType === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (!cred.user.displayName && cred.user.email) {
          await updateProfile(cred.user, { displayName: cred.user.email.split('@')[0] });
        }
        const user = cred.user;
        await setDoc(
          doc(db, 'users', user.uid),
          {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || (user.email ? user.email.split('@')[0] : null),
            photoURL: user.photoURL || null,
            provider: 'password',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );

        if (analytics) {
          logEvent(analytics, 'sign_up', { method: 'password' });
        }
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : null),
          isGuest: false,
        }));
        router.push('/for-you');
        handleClose();
      } else if (modalType === 'forgot-password') {
        await sendPasswordResetEmail(auth, email);
      }
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        dispatch(setError('User not found'));
      } else if (code === 'auth/invalid-email') {
        dispatch(setError('Invalid email'));
      } else if (code === 'auth/wrong-password') {
        dispatch(setError('Incorrect password'));
      } else if (code === 'auth/weak-password') {
        dispatch(setError('Short password'));
      } else {
        dispatch(setError(err?.message || 'Authentication failed'));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {modalType === 'login' ? 'Log in to Summarist' : 
             modalType === 'register' ? 'Sign Up to Summarist' : 
             'Reset your password'}
          </h2>
          <p className="text-gray-600">
            {modalType === 'login' ? 'Welcome back! Please enter your details.' :
             modalType === 'register' ? 'Create your account to get started.' :
             'Enter your email to reset your password.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Guest Login Button */}
        {modalType === 'login' && (
          <>
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Login as Guest'}
            </button>
            {/* Divider between Guest and Google */}
            <div className="flex items-center mt-2 mb-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </>
        )}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50 cursor-pointer"
        >
          <FcGoogle className="w-5 h-5" />
          <span className="text-black">{modalType === 'register' ? 'Sign Up with Google' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c] focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {modalType !== 'forgot-password' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2bd97c] text-[#032b41] py-3 rounded-lg font-medium hover:bg-[#20ba68] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Please wait...' : 
             modalType === 'login' ? 'Sign In' :
             modalType === 'register' ? 'Sign Up' :
             'Reset Password'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm">
          {modalType === 'login' ? (
            <>
              <span className="text-gray-600">Don't have an account? </span>
              <button
                onClick={() => dispatch(setAuthModalType('register'))}
                className="text-[#2bd97c] hover:underline font-medium cursor-pointer"
              >
                Sign up
              </button>
              <div className="mt-2">
                <button
                  onClick={() => dispatch(setAuthModalType('forgot-password'))}
                  className="text-[#2bd97c] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : modalType === 'register' ? (
            <>
              <button
                onClick={() => dispatch(setAuthModalType('login'))}
                className="text-[#2bd97c] hover:underline font-medium cursor-pointer"
              >
                Already have an account?
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-600">Remember your password? </span>
              <button
                onClick={() => dispatch(setAuthModalType('login'))}
                className="text-[#2bd97c] hover:underline font-medium cursor-pointer"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}