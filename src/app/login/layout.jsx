'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { CircularProgress, Box } from '@mui/material';

export default function LoginLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('userinfo');

    if (token) {
      // Cookie exists → redirect to home
      router.push('/home');
    } else {
      // No cookie → stop loader and show login page
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <CircularProgress color="primary" size={60} thickness={5} />
      </Box>
    );
  }

  return <>{children}</>;
}
