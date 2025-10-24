'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { apiUrl } from '../../../constant/api';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async () => {
    setMessage('');
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/request-otp`, { email });
      if (res.status === 200) {
        setMessage('OTP sent successfully!');
        setStep('otp');
      } else {
        setError(res.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setMessage('');
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/verify-otp`, { email, otp }, { withCredentials: true });
      if (res.status === 200) {
        const token = res.data.user.token;
        if (token) {
          localStorage.setItem("token", token);
        } else {
          setError('No token received from server');
          return;
        }
        setMessage('Login successful!');
        router.push('/home');
      } else {
        setError(res.data.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        backgroundColor: '#ffffff',
      }}
    >
      <Paper
        elevation={5}
        sx={{ display: 'flex', maxWidth: 900, width: '100%', borderRadius: 3, overflow: 'hidden' }}
      >
        {/* Left Side - Form */}
        <Box sx={{ flex: 1, p: 6 }}>
          <Typography variant="h5" gutterBottom>Welcome</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Register / Sign in to continue
          </Typography>

          {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          {/* Email Input */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={step === 'otp' || loading}
          />

          {step === 'email' ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleEmailSubmit}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          ) : (
            <>
              <TextField
                label="Enter OTP"
                fullWidth
                margin="normal"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleOtpSubmit}
                disabled={loading}
              >
                {loading ? 'Verifying OTP...' : 'Login'}
              </Button>
            </>
          )}
        </Box>

        {/* Right Side - Image + Info */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(to bottom, #2ea3f2, rgba(23, 106, 161, 1))',
            color: '#fff',
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/bizprospex.webp"
            alt="BizProspex"
            width={200}
            height={60}
            style={{ marginBottom: '2rem' }}
          />
          <Typography variant="h4" gutterBottom textAlign="center">
            Explore Our Best Selling Data Solutions!
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, fontSize: "1.1rem", textAlign: 'center' }}>
            Whether you require address appending, meeting regulatory compliance needs, email searches, funding data, jobs feed data or much more, BizProspex offers the ideal solution.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
