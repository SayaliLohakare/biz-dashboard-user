// pages/protected/dashboard/page.js
'use client';
import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';

export default function DashboardPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome to your Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Stats</Typography>
            <Typography>Total Users: 120</Typography>
            <Typography>Active Subscriptions: 45</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Activity</Typography>
            <Typography>- User John registered</Typography>
            <Typography>- Payment received from Jane</Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
