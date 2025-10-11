'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { CircularProgress, Box } from '@mui/material';

export default function LoginLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('authToken2');

    if (token) {
      // Cookie exists → redirect to dashboard
      router.push('/dashboard');
    } else {
      // No cookie → stop loader and show login page
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress color="primary" size={60} thickness={5} />
      </Box>
    );
  }

  // Render the login page content if not logged in
  return <>{children}</>;
}
