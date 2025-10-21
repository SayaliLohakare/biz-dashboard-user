"use client";
import React, { useState, useEffect } from "react";
import {apiUrl}  from '../../../constant/api';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Inventory2 as Inventory2,
  ExpandMore,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const drawerWidth = 240;

export default function ProtectedLayout({ children }) {
  const [open, setOpen] = useState(true);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check cookie on mount
  useEffect(() => {
    const token = Cookies.get("userinfo");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  // Logout function
  const handleLogout = async() => {
     try {
    const res = await fetch(`${apiUrl}/logout-user`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    console.log(data.message);
    Cookies.remove('userinfo');
    router.push('/login');
  } catch (err) {
    console.error('Logout failed:', err);
  }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress color="primary" size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 70,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 70,
            boxSizing: "border-box",
            transition: "width 0.3s",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: open ? "space-between" : "center" }}
        >
          {open && <Typography variant="h6">Dashboard</Typography>}
          <IconButton onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>

        <List>
          {/* Home */}
          <ListItemButton component={Link} href="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItemButton>

          <ListItemButton component={Link} href="/my-orders">
            <ListItemIcon>
              <Inventory2 />
            </ListItemIcon>
            {open && <ListItemText primary="My Orders" />}
          </ListItemButton>

          {/* <ListItemButton component={Link} href="/search-people">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Search People" />}
          </ListItemButton>

          <ListItemButton component={Link} href="/purchased-list">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            {open && <ListItemText primary="My purchased List" />}
          </ListItemButton> */}

          {/* Profile */}
          {/* <ListItemButton onClick={() => setOpenSubMenu(!openSubMenu)}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Profile" />}
            {open && (openSubMenu ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: open ? 8 : 2 }} component={Link} href="/profile">
                {open && <ListItemText primary="View Profile" />}
              </ListItemButton>
              <ListItemButton sx={{ pl: open ? 8 : 2 }} component={Link} href="/edit-profile">
                {open && <ListItemText primary="Edit Profile" />}
              </ListItemButton>
            </List>
          </Collapse> */}

          {/* Settings */}
          {/* <ListItemButton component={Link} href="/protected/dashboard/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Settings" />}
          </ListItemButton> */}

          {/* Logout in Sidebar */}
          {/* <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItemButton> */}
        </List>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Header / Topbar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${open ? drawerWidth : 70}px)`,
            ml: `${open ? drawerWidth : 70}px`,
            transition: "all 0.3s",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* <Typography variant="h6" noWrap component="div">
              Protected Area
            </Typography> */}
            {/* Logout button on Topbar */}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacer for AppBar */}

        {/* Render children */}
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}
