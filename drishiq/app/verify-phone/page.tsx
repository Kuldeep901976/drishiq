'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function VerifyPhonePage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPhone = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.phone) {
        setPhone(data.user.phone);
      } else {
        router.push('/signup');
      }
    };

    fetchPhone();
  }, [router]);

  const handleVerify = async () => {
    if (!otp || otp.length < 6 || !phone) {
      setMessage('❌ Please enter valid OTP.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
      return;
    }

    // ✅ Check if user profile is complete
    const { data: userRow } = await supabase
      .from('User')
      .select('profile_complete')
      .eq('user_id', data.user?.id)
      .single();

    if (userRow?.profile_complete) {
  router.push('/home');
} else {
  // ✅ Save preferred language if stored in localStorage
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'English';

  await supabase
    .from('User')
    .update({ preferred_language: preferredLanguage, profile_complete: true })
    .eq('user_id', data.user?.id);

  router.push('/profile');
}
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: 'auto' }}>
      <h2>Verify Your Phone</h2>
      <p>We’ve sent an OTP to your phone number {phone}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ width: '100%', marginBottom: 12, padding: 8 }}
      />

      <button
        onClick={handleVerify}
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px 0',
          backgroundColor: '#0B4422',
          color: '#fff',
          border: 'none',
        }}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}
