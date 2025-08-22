'use client';

import React, { useState } from 'react';
import { CognitoDirectAuth } from '@/lib/auth/cognito-direct-auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tokens: any, userInfo: any) => void;
}

type AuthMode = 'signin' | 'signup' | 'confirm' | 'forgot';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent SSR issues
  if (typeof window === 'undefined') return null;
  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await CognitoDirectAuth.signIn(email, password);
      
      if (result.success && result.tokens && result.userInfo) {
        onSuccess(result.tokens, result.userInfo);
        onClose();
        resetForm();
      } else {
        setError(result.error || 'Sign in failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await CognitoDirectAuth.signUp(email, password);
      
      if (result.success) {
        setMode('confirm');
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await CognitoDirectAuth.confirmSignUp(email, confirmationCode);
      
      if (result.success) {
        // After confirmation, automatically sign in
        const signInResult = await CognitoDirectAuth.signIn(email, password);
        if (signInResult.success && signInResult.tokens && signInResult.userInfo) {
          onSuccess(signInResult.tokens, signInResult.userInfo);
          onClose();
          resetForm();
        } else {
          setMode('signin');
          setError('Account confirmed! Please sign in.');
        }
      } else {
        setError(result.error || 'Confirmation failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await CognitoDirectAuth.forgotPassword(email);
      
      if (result.success) {
        setError('Password reset code sent to your email.');
      } else {
        setError(result.error || 'Failed to send reset code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setConfirmationCode('');
    setError('');
    setMode('signin');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#106F48] via-[#022C33] to-[#88018B] p-6 rounded-lg max-w-sm w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          {/* Morpheus Logo */}
          <div className="w-4/5 mx-auto mb-6 flex items-center justify-center" style={{height: '80px'}}>
            <img 
              src="/images/mor_mark_white.png" 
              alt="Morpheus AI" 
              className="w-full h-full object-contain"
            />
          </div>
          {/* Title */}
          <h2 className="text-white text-lg font-normal mb-6">
            {mode === 'signin' && 'Sign in with your email and password'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'confirm' && 'Confirm your email'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>

          {/* Close button */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-white text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-gray-100 border-0 rounded text-gray-700 font-semibold placeholder-gray-700 focus:outline-none focus:ring-0 focus:bg-white focus:text-black"
                placeholder="name@host.com"
              />
            </div>
            
            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-gray-100 border-0 rounded text-gray-700 font-semibold placeholder-gray-700 focus:outline-none focus:ring-0 focus:bg-white focus:text-black"
                placeholder="Password"
              />
            </div>

            <div className="text-left pt-2">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#106F48] hover:bg-[#0e5a3c] text-white p-3 rounded font-medium transition-colors disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-center text-white text-sm pt-4">
              Need an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Sign up
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-white text-sm mb-1">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-100 border-0 rounded text-gray-700 font-semibold placeholder-gray-700 focus:outline-none focus:ring-0 focus:bg-white focus:text-black"
                  placeholder="name@host.com"
              />
            </div>
              
            <div>
              <label className="block text-white text-sm mb-1">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full p-3 bg-gray-100 border-0 rounded text-gray-700 font-semibold placeholder-gray-700 focus:outline-none focus:ring-0 focus:bg-white focus:text-black"
                  placeholder="Password (min 8 characters)"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Confirm Password</label>
              <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-100 border-0 rounded text-gray-700 font-semibold placeholder-gray-700 focus:outline-none focus:ring-0 focus:bg-white focus:text-black"
                  placeholder="Confirm Password"
              />
            </div>

            <button
              type="submit"
                disabled={isLoading}
                className="w-full bg-[#106F48] hover:bg-[#0e5a3c] text-white p-3 rounded font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            <div className="text-center text-white text-sm">
                Already have an account?{' '}
              <button
                type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Sign in
              </button>
            </div>
          </form>
        )}

        {/* Confirmation Form */}
        {mode === 'confirm' && (
          <form onSubmit={handleConfirmSignUp} className="space-y-4">
            <div className="text-white text-sm mb-4">
                We've sent a confirmation code to <strong>{email}</strong>. Please enter it below.
            </div>
              
            <div>
              <label className="block text-white text-sm mb-1">Confirmation Code</label>
              <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-200 border-0 rounded text-gray-800 font-medium text-center text-lg tracking-widest placeholder-gray-500 focus:outline-none focus:ring-0"
                  placeholder="123456"
                  maxLength={6}
              />
            </div>

            <button
              type="submit"
                disabled={isLoading}
                className="w-full bg-[#106F48] hover:bg-[#0e5a3c] text-white p-3 rounded font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Confirming...' : 'Confirm Account'}
            </button>

            <div className="text-center text-white text-sm">
              <button
                type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Back to sign in
              </button>
            </div>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-white text-sm mb-4">
                Enter your email address and we'll send you a password reset code.
            </div>
              
            <div>
              <label className="block text-white text-sm mb-1">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 bg-gray-100 border-0 rounded text-gray-700 font-semibold placeholder-gray-700 focus:outline-none focus:ring-0 focus:bg-white focus:text-black"
                  placeholder="name@host.com"
              />
            </div>

            <button
              type="submit"
                disabled={isLoading}
                className="w-full bg-[#106F48] hover:bg-[#0e5a3c] text-white p-3 rounded font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="text-center text-white text-sm">
              <button
                type="button"
                  onClick={() => setMode('signin')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Back to sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
