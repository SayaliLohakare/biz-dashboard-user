'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Button,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { apiUrl } from '../../../../constant/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfo = Cookies.get('userinfo');
        if (!userInfo) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userInfo);
        const { id } = user;

        if (!id) {
          setError('User ID not found');
          setLoading(false);
          return;
        }

        const response = await axios.post(`${apiUrl}/get-profile`, { id }, { withCredentials: true });
        setProfile(response.data);
        setUpdatedName(response.data.name);
        setUpdatedPhone(response.data.phone);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setUpdateMessage('');
    try {
      setUpdateLoading(true);
      const userInfo = Cookies.get('userinfo');
      const user = JSON.parse(userInfo);
      const { id } = user;

      const response = await axios.post(`${apiUrl}/update-profile`, {
        id,
        name: updatedName,
        phone: updatedPhone,
      }, { withCredentials: true });

      setProfile(response.data.user);
      setUpdateMessage('Profile updated successfully');
      setUpdateDialogOpen(false);
    } catch (err) {
      setUpdateMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const openUpdateDialog = () => {
    setUpdatedName(profile.name);
    setUpdatedPhone(profile.phone);
    setUpdateMessage('');
    setUpdateDialogOpen(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Loading Profile...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{  backgroundColor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
            User Profile
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your personal information
          </Typography>
        </Box>

        {updateMessage && !updateDialogOpen && (
          <Alert
            severity={updateMessage.includes('successfully') ? 'success' : 'error'}
            sx={{ mb: 4 }}
          >
            {updateMessage}
          </Alert>
        )}

        <Grid container spacing={30} justifyContent="center">
          {/* Left Side: Avatar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                 
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  backgroundColor: 'grey.300',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                {getInitials(profile.name)}
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {profile.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {profile.email}
              </Typography>
            </Box>
          </Grid>

          {/* Right Side: Profile Details */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 2, position: 'relative' }}>
              {/* Edit Profile Button Top Right */}
              <Button
                variant="contained"
                onClick={openUpdateDialog}
                startIcon={<EditIcon />}
                sx={{ position: 'absolute', top: 16, right: 16 }}
              >
                Edit Profile
              </Button>

              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <PersonIcon />
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Full Name
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {profile.name}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {profile.email}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Phone Number
                  </Typography>
                  <Typography variant="h6" fontWeight="medium">
                    {profile.phone || 'Not provided'}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Role
                  </Typography>
                  <Typography variant="h6" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                    {profile.role}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Update Profile Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => !updateLoading && setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Edit Profile
        </DialogTitle>

        <DialogContent>
          {updateMessage && (
            <Alert severity={updateMessage.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {updateMessage}
            </Alert>
          )}

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={updatedPhone}
            onChange={(e) => setUpdatedPhone(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUpdateDialogOpen(false)} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateProfile}
            disabled={updateLoading}
            startIcon={updateLoading ? <CircularProgress size={20} /> : null}
          >
            {updateLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
