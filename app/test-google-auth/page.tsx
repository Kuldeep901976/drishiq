'use client';

import { useSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TestGoogleAuth() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState('');

  useEffect(() => {
    testGoogleAuth();
  }, []);

  const testGoogleAuth = async () => {
    try {
      setStatus('Testing Google OAuth configuration...');
      
      // Test if Supabase client is available
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // Test OAuth sign-in (this will redirect to Google)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setStatus('Google OAuth is configured correctly! Redirecting to Google...');
      
    } catch (err: any) {
      setError(err.message);
      setStatus('Test failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Google OAuth Test
          </h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 mb-4">{status}</p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-800 text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            )}
            
            <button
              onClick={testGoogleAuth}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Test Again
            </button>
            
            <button
              onClick={() => router.push('/signin')}
              className="w-full mt-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 