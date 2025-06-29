'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CreatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        router.push('/signup');
      }
    }

    checkUser();
  }, [router]);

  const handleSubmit = async () => {
    if (password.length < 6 || password !== confirm || !phone) {
      setMessage('Please check password match and valid phone.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Update password
    const { error: pwError } = await supabase.auth.updateUser({
      password,
    });

    if (pwError) {
      setMessage(`❌ ${pwError.message}`);
      setLoading(false);
      return;
    }

    // Update phone number
    const { error: phoneError } = await supabase.auth.updateUser({
      phone,
    });

    if (phoneError) {
      setMessage(`❌ Phone update failed: ${phoneError.message}`);
      setLoading(false);
      return;
    }

    // Send OTP to phone for verification
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (otpError) {
      setMessage(`❌ OTP send failed: ${otpError.message}`);
      setLoading(false);
      return;
    }

    setMessage('✅ OTP sent to your phone. Please verify.');
    router.push('/verify-phone'); // next page
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto' }}>
      <h2>Create Password & Verify Phone</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <input
        type="tel"
        placeholder="Phone (e.g. +919876543210)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px 0',
          backgroundColor: '#0B4422',
          color: '#fff',
          border: 'none',
        }}
      >
        {loading ? 'Submitting...' : 'Continue'}
      </button>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}
