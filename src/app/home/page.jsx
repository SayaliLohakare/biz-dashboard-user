import Layout from '@/components/Layout';
import { Typography, Paper, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Layout>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your business dashboard! This is a fully responsive layout 
          that works on all screen sizes.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Features:
          </Typography>
          <ul>
            <li>Responsive header with logout button</li>
            <li>Collapsible sidebar with icons</li>
            <li>Mobile-friendly navigation</li>
            <li>Professional color scheme</li>
            <li>Smooth animations and transitions</li>
          </ul>
        </Box>
      </Paper>
    </Layout>
  );
}