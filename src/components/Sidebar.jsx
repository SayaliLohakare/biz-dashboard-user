'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Box,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as OrdersIcon,
  SupportAgent as SupportIcon,
  AccountCircle as ProfileIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

export default function Sidebar({ open, onClose }) {
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { text: 'Home', href: '/home', icon: <HomeIcon />, iconColor: '#1976d2', textColor: '#0d47a1' },
    { text: 'Orders', href: '/orders', icon: <OrdersIcon />, iconColor: '#388e3c', textColor: '#1b5e20' },
    { text: 'Support', href: 'https://support.bizprospex.com/portal/en/home?_gl=1*tqukal*_gcl_au*MjE0NDYzNTMwNy4xNzU2NzIzMDIw*_ga*MTcwMzc5NTIyOC4xNzU2NzIzMDIw*_ga_2ECS4224VJ*czE3NjExMzA3MTUkbzM3JGcxJHQxNzYxMTMwNzI5JGo0NiRsMCRoODE2MzA5NzMy', icon: <SupportIcon />, iconColor: '#f57c00', textColor: '#e65100', external: true },
    { text: 'Profile', href: '/profile', icon: <ProfileIcon />, iconColor: '#9c27b0', textColor: '#4a148c' },
  ];

  // Auto-close on mobile when route changes
  useEffect(() => {
    if (isMobile && open) {
      onClose();
    }
  }, [pathname]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const drawerContent = (
    <Box sx={{ 
      width: collapsed ? collapsedDrawerWidth : drawerWidth, 
      bgcolor: 'white',
      color:"black",
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
          borderRight: '1px solid #69b2f7ff', // <-- Add this line

    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '4px',
        mt:8
      }}>
        <Collapse in={!collapsed} orientation="horizontal">
          <Typography variant="h6" fontWeight="bold" noWrap>
            Dashboard
          </Typography>
        </Collapse>
        
        {/* Collapse Toggle Button (Desktop only) */}
        {!isMobile && (
          <IconButton
            onClick={handleCollapse}
            sx={{ 
              color: 'black',
              '&:hover': { backgroundColor: 'primary.main' }
            }}
          >
            <ChevronLeftIcon 
              sx={{ 
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      
      {/* Menu Items */}
      <List sx={{ flexGrow: 1, p: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip 
                title={collapsed || isMobile ? item.text : ''} 
                placement="right"
              >
                <ListItemButton
                  component={item.external ? 'a' : Link}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    backgroundColor: isActive ? '#74aafbff' : 'transparent',
                    color: item.textColor,
                    '&:hover': {
                      backgroundColor: 'primary.light',
                    },
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    minHeight: 48,
                    px: 2.5,
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: item.iconColor,
                      minWidth: 0,
                      mr: collapsed ? 0 : 3,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  
                  <Collapse in={!collapsed} orientation="horizontal">
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    />
                  </Collapse>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: isMobile ? undefined : (collapsed ? collapsedDrawerWidth : drawerWidth),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : (collapsed ? collapsedDrawerWidth : drawerWidth),
            boxSizing: 'border-box',
            border: 'none',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
