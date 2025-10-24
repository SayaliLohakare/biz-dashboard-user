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
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Person as PersonIcon, Phone as PhoneIcon, Email as EmailIcon } from '@mui/icons-material';
import axios from 'axios';
import { apiUrl } from '../../../constant/api';
import Layout from '@/components/Layout';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPhone, setUpdatedPhone] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  // Get token from cookie or localStorage (if your API requires it)
  const getToken = () => Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

useEffect(() => {
  const fetchProfile = async () => {
    console.log("API is calling");
    try {
      const token = getToken();

      // ✅ Send id as query param
      const response = await axios.get(`${apiUrl}/v1/get-profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
console.log(response)
      setProfile(response.data.data);
      setUpdatedName(response.data.name);
      setUpdatedPhone(response.data.phone);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch profile');
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
    const token = getToken();

    if (!profile?.id) {
      setUpdateMessage('User ID not found. Cannot update profile.');
      setUpdateLoading(false);
      return;
    }

    const response = await axios.post(
      `${apiUrl}/v1/update-profile`,
      { 
        id: profile.id,   // <-- include the user ID
        name: updatedName, 
        phone: updatedPhone 
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      }
    );

    setProfile(response.data.user || response.data); // update profile state
    setUpdateMessage('Profile updated successfully');
    setUpdateDialogOpen(false);
  } catch (err) {
    setUpdateMessage(err.response?.data?.error || 'Failed to update profile');
  } finally {
    setUpdateLoading(false);
  }
};


  const getInitials = (name) => (name ? name.split(' ').map((n) => n[0]).join('').toUpperCase() : 'U');

  const openUpdateDialog = () => {
    setUpdatedName(profile.name);
    setUpdatedPhone(profile.phone);
    setUpdateMessage('');
    setUpdateDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading Profile...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, minHeight: '50vh' }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ py: 4, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              User Profile
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your personal information and account settings
            </Typography>
          </Box>

          {updateMessage && !updateDialogOpen && (
            <Alert severity={updateMessage.includes('successfully') ? 'success' : 'error'} sx={{ mb: 4 }}>
              {updateMessage}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 3, overflow: 'visible', textAlign: 'center', p: 4 }}>
                <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 3, backgroundColor: 'primary.main', fontSize: '2.5rem' }}>
                  {getInitials(profile.name)}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profile.email}
                </Typography>
                <Button variant="contained" fullWidth startIcon={<EditIcon />} sx={{ mt: 3 }} onClick={openUpdateDialog}>
                  Edit Profile
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ borderRadius: 3, p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon color="primary" /> Personal Information
                  </Typography>
                  <IconButton onClick={openUpdateDialog} sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}>
                    <EditIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" /> Full Name
                      </Typography>
                      <Typography variant="h6" sx={{ pl: 3 }}>{profile.name}</Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" /> Phone Number
                      </Typography>
                      <Typography variant="h6" sx={{ pl: 3 }}>{profile.phone || 'Not provided'}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" /> Email Address
                      </Typography>
                      <Typography variant="h6" sx={{ pl: 3 }}>{profile.email}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Update Dialog */}
        <Dialog open={updateDialogOpen} onClose={() => !updateLoading && setUpdateDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            {updateMessage && <Alert severity={updateMessage.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>{updateMessage}</Alert>}
            <TextField label="Full Name" fullWidth margin="normal" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
            <TextField label="Phone Number" fullWidth margin="normal" value={updatedPhone} onChange={(e) => setUpdatedPhone(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setUpdateDialogOpen(false)} disabled={updateLoading}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdateProfile} disabled={updateLoading} startIcon={updateLoading ? <CircularProgress size={20} /> : null}>
              {updateLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
