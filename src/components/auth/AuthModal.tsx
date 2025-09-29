'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeAuthModal, setAuthModalType } from '@/store/slices/uiSlice';
import { setUser, setLoading, setError } from '@/store/slices/authSlice';
import { AiOutlineClose, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state: any) => state.ui.isAuthModalOpen);
  const modalType = useAppSelector((state: any) => state.ui.authModalType);
  const isLoading = useAppSelector((state: any) => state.auth.isLoading);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClose = () => {
    dispatch(closeAuthModal());
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleGuestLogin = () => {
    dispatch(setLoading(true));
    // Simulate guest login
    setTimeout(() => {
      dispatch(setUser({
        uid: 'guest',
        email: 'guest@example.com',
        displayName: 'Guest User',
        isGuest: true,
      }));
      dispatch(setLoading(false));
      handleClose();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'register' && password !== confirmPassword) {
      dispatch(setError('Passwords do not match'));
      return;
    }

    dispatch(setLoading(true));
    
    // Simulate authentication
    setTimeout(() => {
      dispatch(setUser({
        uid: '123',
        email: email,
        displayName: email.split('@')[0],
        isGuest: false,
      }));
      dispatch(setLoading(false));
      handleClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <AiOutlineClose className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {modalType === 'login' ? 'Log in to Summarist' : 
             modalType === 'register' ? 'Sign up to Summarist' : 
             'Reset your password'}
          </h2>
          <p className="text-gray-600">
            {modalType === 'login' ? 'Welcome back! Please enter your details.' :
             modalType === 'register' ? 'Create your account to get started.' :
             'Enter your email to reset your password.'}
          </p>
        </div>

        {/* Guest Login Button */}
        {modalType === 'login' && (
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-4 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Login as Guest'}
          </button>
        )}

        {/* Google Login Button */}
        <button
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
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
              Email
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {modalType === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2bd97c] focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2bd97c] text-[#032b41] py-3 rounded-lg font-medium hover:bg-[#20ba68] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : 
             modalType === 'login' ? 'Sign In' :
             modalType === 'register' ? 'Create Account' :
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
                className="text-[#2bd97c] hover:underline font-medium"
              >
                Sign up
              </button>
              <div className="mt-2">
                <button
                  onClick={() => dispatch(setAuthModalType('forgot-password'))}
                  className="text-[#2bd97c] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : modalType === 'register' ? (
            <>
              <span className="text-gray-600">Already have an account? </span>
              <button
                onClick={() => dispatch(setAuthModalType('login'))}
                className="text-[#2bd97c] hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-600">Remember your password? </span>
              <button
                onClick={() => dispatch(setAuthModalType('login'))}
                className="text-[#2bd97c] hover:underline font-medium"
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