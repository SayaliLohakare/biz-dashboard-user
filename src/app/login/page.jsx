'use client';
import React, { useState } from 'react';
import Cookies from "js-cookie";
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
import {apiUrl}  from '../../../constant/api';
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

  // Send OTP
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
      console.log(res);
      if (res.status === 200) {
        setMessage('OTP sent successfully!');
        setStep('otp'); // Show OTP field
      } else {
        setError(res.data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleOtpSubmit = async () => {
    setMessage('');
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/verify-otp`, { email, otp },{withCredentials: true});
      console.log(res);
      if (res.status === 200) {
      const token = res.data.user.token;  
      console.log("Received token:", token);
      if (token) {
        // store in cookie for 1 hour
       // Cookies.set("authToken2", token, { expires: 5/24 }); // 5 hour
        Cookies.set("userinfo", JSON.stringify(res.data.user), { expires: 5/24 }); // 5 hour
      }
        setMessage('Login successful!');
        router.push('/dashboard');
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
      }}
    >
      <Paper
        elevation={5}
        sx={{ display: 'flex', maxWidth: 900, width: '100%', borderRadius: 3, overflow: 'hidden' }}
      >
        {/* Left Side - Form */}
        <Box sx={{ flex: 1, p: 6 }}>
          <Image
            src="/logo.png"   // Path in the public folder
            alt="Profile picture"
            width={200}
            height={60}
            sx={{ mb: 3 }}
          />
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

          {/* Conditional rendering for buttons and OTP field */}
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

        {/* Right Side - Info */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(to bottom, #2ea3f2, rgba(23, 106, 161, 1))',
            color: '#fff',
            p: 6,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Typography variant="h4" gutterBottom>Explore Our Best Selling Data Solutions!</Typography>
          <Typography variant="body2" sx={{ mb: 2, mt:4, fontSize: "1.1rem" }}>
            Whether you require address appending, meeting regulatory compliance needs, email searches, funding data, jobs feed data or much more, BizProspex offers the ideal solution.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
