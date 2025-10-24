'use client';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton,
  Box
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Menu as MenuIcon 
} from '@mui/icons-material';
import Image from 'next/image'; // If using Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function Header({ onMenuToggle, sidebarOpen }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        {/* Menu Icon for mobile */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ 
            mr: 2, 
            display: { xs: 'block', md: 'none' } 
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo Image */}
        <Box sx={{ flexGrow: 1 }}>
  <Link href="/home">
    <Image
      src="/bizprospex.webp"
      alt="Biz Dashboard Logo"
      width={150}
      height={40}
      style={{ objectFit: 'contain', cursor: 'pointer' }}
    />
  </Link>
</Box>

        {/* Logout Button */}
        <Button 
          color="inherit" 
          onClick={handleLogout}
           startIcon={<LogoutIcon sx={{ color: '#f00' }} />} // red icon

          sx={{
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.3s ease',
            fontWeight: '600',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline',color:"#000" } }}>
            Logout
          </Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none',color:"#000" } }}>
            Out
          </Box>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
