'use client';

import React from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Button,
  Link,
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  Download,
  Person,
  Email,
  ArrowForward,
} from '@mui/icons-material';

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Here’s a quick overview of your account activity
      </Typography>

      {/* Top Stats */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[
          { title: 'Total Purchases', value: 18, icon: <ShoppingCart color="primary" /> },
          { title: 'Data Exports', value: 6, icon: <Download color="success" /> },
          { title: 'Active Subscriptions', value: 3, icon: <Email color="secondary" /> },
          { title: 'Total Spent ($)', value: '1,240', icon: <TrendingUp color="warning" /> },
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 3,
              }}
              elevation={3}
            >
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="h5" fontWeight="bold">
                  {item.value}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#f5f5f5' }}>{item.icon}</Avatar>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Data Insights */}
      <Grid container spacing={3}>
        {/* Most Selling Email Lists */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              🔥 Most Selling Email Lists
            </Typography>
            <List>
              {[
                { name: 'USA Business Email List', sales: 324, url: 'https://bizprospex.com/product/usa-business-email-lists' },
                { name: 'Healthcare Email Lists', sales: 210, url: 'https://bizprospex.com/product/healthcare-email-lists' },
                { name: 'CEO Email Lists', sales: 180, url: 'https://bizprospex.com/product/ceo-email-lists' },
              ].map((list, i) => (
                <ListItem key={i}>
                  <ListItemAvatar>
                    <Avatar>
                      <TrendingUp color="primary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        href={list.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      >
                        {list.name}
                      </Link>
                    }
                    secondary={`Sold: ${list.sales}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box textAlign="right">
              <Link href="https://bizprospex.com/productslist" target="_blank" rel="noopener noreferrer">
              <Button endIcon={<ArrowForward />} size="small">
                View All
              </Button></Link>
            </Box>
          </Paper>
        </Grid>

        {/* Your Purchases */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              🛒 Your Recent Purchases
            </Typography>
            <List>
              {[
                { name: 'India Real Estate Leads', date: 'Oct 15, 2025', url: 'https://example.com/india-real-estate' },
                { name: 'Canada Startups Contacts', date: 'Sep 30, 2025', url: 'https://example.com/canada-startups' },
                { name: 'Australia Marketing Data', date: 'Aug 20, 2025', url: 'https://example.com/australia-marketing' },
              ].map((purchase, i) => (
                <ListItem key={i}>
                  <ListItemAvatar>
                    <Avatar>
                      <ShoppingCart color="secondary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Link
                        href={purchase.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      >
                        {purchase.name}
                      </Link>
                    }
                    secondary={`Purchased on ${purchase.date}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box textAlign="right">
              <Button endIcon={<ArrowForward />} size="small">
                View All
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Recent Activity */}
      <Paper sx={{ p: 2, borderRadius: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          📅 Recent Activity
        </Typography>
        <List>
          {[
            { user: '', activity: 'Exported data for UK Healthcare Leads', time: '2 hours ago' },
            { user: '', activity: 'Downloaded India Real Estate list', time: '1 day ago' },
            { user: '', activity: 'Purchased USA Business Contacts', time: '3 days ago' },
          ].map((log, i) => (
            <ListItem key={i}>
              <ListItemAvatar>
                <Avatar>
                  <Person color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={log.activity}
                secondary={`${log.user}  ${log.time}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
