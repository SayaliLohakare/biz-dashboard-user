"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Stack,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  MenuItem,
} from "@mui/material";
import { apiUrl } from "../../../../constant/api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    nickName: "",
    gender: "",
    country: "",
    language: "",
    timeZone: "",
    email: "",
  });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Fetch user data
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/v1/get-profile`, { withCredentials: true });
      setUser(res.data.data);
      setEditData({
        name: res.data.data.name || "",
        phone: res.data.data.phone || "",
        nickName: "",
        gender: "",
        country: "",
        language: "",
        timeZone: "",
        email: res.data.data.email || "",
      });
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to fetch profile", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = Cookies.get("userinfo");
    if (!userInfo) {
      setToast({ open: true, message: "User not logged in", severity: "error" });
      setLoading(false);
      return;
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const userInfo = JSON.parse(Cookies.get("userinfo"));
      const res = await axios.post(
        `${apiUrl}/v1/update-profile`,
        { ...editData },
        { withCredentials: true }
      );
      if (res.data.success) {
        setUser({ ...user, name: editData.fullName, email: editData.email, phone: editData.phone });
        setEditMode(false);
        setToast({ open: true, message: "Profile updated successfully", severity: "success" });
      }
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Failed to update profile", severity: "error" });
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );

  if (!user)
    return (
      <Typography align="center" mt={5}>
        No user data found. Please log in.
      </Typography>
    );

  return (
    <>
      <Card sx={{ maxWidth: 900, mx: "auto", mt: 5, p: 3, borderRadius: 3, boxShadow: 3 }}>
        {/* Header */}
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar
            src="/avatar-placeholder.png"
            alt={user.name}
            sx={{ width: 80, height: 80 }}
          />
          <Box flexGrow={1}>
            <Typography variant="h6" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </Stack>
        <Divider sx={{ mb: 3 }} />

        {/* Form */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name"
              name="name"
              value={editData.name}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              name="phone"
              value={editData.phone}
              onChange={handleChange}
              fullWidth
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              name="email"
              value={editData.email}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>

        {editMode && (
          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </Stack>
        )}
      </Card>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserProfile;
