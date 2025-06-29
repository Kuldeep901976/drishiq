'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userIdAvailable, setUserIdAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserId = async () => {
      if (!userId.trim()) {
        setUserIdAvailable(null);
        return;
      }

      const { data } = await supabase
        .from('User')
        .select('user_id')
        .eq('user_id', userId.trim())
        .single();

      setUserIdAvailable(!data); // true if available
    };

    checkUserId();
  }, [userId]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!isValidEmail(email) || !userIdAvailable || !agreed) return;

    setLoading(true);
    setMessage('');

    // Insert user into User table
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('user_id', userId.trim())
      .maybeSingle();

    if (existingUser) {
      setMessage('❌ User ID already exists.');
      setLoading(false);
      return;
    }

    // Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/create-password`, // You can adjust this route
      },
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
      return;
    }

    // Add user_id to User table
    await supabase.from('User').insert([
      {
        user_id: userId.trim(),
        email: email.trim(),
      },
    ]);

    setMessage('✅ Magic link sent. Please check your email.');
    setLoading(false);
  };

  const isFormValid = isValidEmail(email) && agreed && userIdAvailable;

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <input
        type="text"
        placeholder="Choose a unique User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      {userId && (
        <div style={{ fontSize: '0.9rem', color: userIdAvailable ? 'green' : 'red' }}>
          {userIdAvailable === null
            ? ''
            : userIdAvailable
            ? '✅ User ID is available.'
            : '❌ User ID already taken.'}
        </div>
      )}

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
          style={{ marginRight: 8 }}
        />
        I agree to the <a href="/terms">Terms</a> & <a href="/privacy">Privacy Policy</a>
      </label>

      <button
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        style={{
          marginTop: '16px',
          padding: '10px 20px',
          backgroundColor: isFormValid ? '#0B4422' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: isFormValid ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>

      {message && (
        <div style={{ marginTop: 12, fontSize: '0.95rem', color: '#333' }}>{message}</div>
      )}
    </div>
  );
}
