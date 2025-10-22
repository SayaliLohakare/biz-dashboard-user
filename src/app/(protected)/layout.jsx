"use client";
import React, { useState, useEffect } from "react";
import { apiUrl } from "../../../constant/api";
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
  useTheme, // Added for responsiveness
  useMediaQuery, // Added for responsiveness
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Inventory2 as Inventory2,
  ExpandMore,
  ExpandLess, // Added for submenu
  Menu as MenuIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const desktopDrawerWidth = 240;
const collapsedDrawerWidth = 70;

export default function ProtectedLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // State for desktop drawer (240px vs 70px)
  const [open, setOpen] = useState(true);
  // State for mobile drawer (open vs closed)
  const [mobileOpen, setMobileOpen] = useState(false);

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
  const handleLogout = async () => {
    try {
      const res = await fetch(`${apiUrl}/logout-user`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.message);
      Cookies.remove("userinfo");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Toggle for mobile drawer
  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Helper variable for current desktop drawer width
  const currentDrawerWidth = open ? desktopDrawerWidth : collapsedDrawerWidth;

  // Helper variable to decide if text should be shown in the drawer
  // Show text if:
  // 1. We are on mobile (and the drawer is open)
  // 2. We are on desktop AND the drawer is expanded (open = true)
  const showText = isMobile || open;

  // We define the drawer's content once to avoid repetition
  const drawerContent = (
    <div>
      {/* --- Desktop-only Toolbar (with toggle) --- */}
      <Toolbar
        sx={{
          display: { xs: "none", sm: "flex" }, // Only show on desktop
          justifyContent: open ? "space-between" : "center",
        }}
      >
        {open && <Typography variant="h6">Dashboard</Typography>}
        <IconButton onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* --- Mobile-only Toolbar (for spacing) --- */}
      <Toolbar sx={{ display: { xs: "flex", sm: "none" } }} />

      <List>
        {/* Home */}
        <ListItemButton
          component={Link}
          href="/dashboard"
          onClick={isMobile ? handleMobileDrawerToggle : undefined} // Close mobile drawer on nav
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="Home" />}
        </ListItemButton>

        <ListItemButton
          component={Link}
          href="/my-orders"
          onClick={isMobile ? handleMobileDrawerToggle : undefined} // Close mobile drawer on nav
        >
          <ListItemIcon>
            <Inventory2 />
          </ListItemIcon>
          {showText && <ListItemText primary="My Orders" />}
        </ListItemButton>

        {/* --- Your Commented-Out Items (now responsive) --- */}
        {/* <ListItemButton component={Link} href="/search-people" onClick={isMobile ? handleMobileDrawerToggle : undefined}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="Search People" />}
        </ListItemButton>

        <ListItemButton component={Link} href="/purchased-list" onClick={isMobile ? handleMobileDrawerToggle : undefined}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="My purchased List" />}
        </ListItemButton> */}

        {/* Profile */}
        <ListItemButton component={Link} href="/profile" onClick={isMobile ? handleMobileDrawerToggle : undefined}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="Profile" />}
        </ListItemButton>

        {/* Support */}
        <ListItemButton
          component="a"
          href="https://support.bizprospex.com/portal/en/home?_gl=1*tqukal*_gcl_au*MjE0NDYzNTMwNy4xNzU2NzIzMDIw*_ga*MTcwMzc5NTIyOC4xNzU2NzIzMDIw*_ga_2ECS4224VJ*czE3NjExMzA3MTUkbzM3JGcxJHQxNzYxMTMwNzI5JGo0NiRsMCRoODE2MzA5NzMy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={isMobile ? handleMobileDrawerToggle : undefined}
        >
          <ListItemIcon>  
            <SettingsIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="Support" />}
        </ListItemButton>

        {/* Settings */}
        {/* <ListItemButton component={Link} href="/protected/dashboard/settings" onClick={isMobile ? handleMobileDrawerToggle : undefined}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="Settings" />}
        </ListItemButton> */}

        {/* Logout in Sidebar */}
        {/* <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          {showText && <ListItemText primary="Logout" />}
        </ListItemButton> */}
      </List>
    </div>
  );

  if (loading) {
    return (
      <Box
        sx={{
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
    <Box sx={{ display: "flex", minHeight: "auto" }}>
      {/* --- Header / Topbar --- */}
      <AppBar
        position="fixed"
        sx={{
          // Responsive width and margin
          width: isMobile
            ? "100%"
            : `calc(100% - ${currentDrawerWidth}px)`,
          ml: isMobile ? 0 : `${currentDrawerWidth}px`,
          // Smooth transition for desktop
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* --- Mobile-only Menu Icon --- */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" }, // Only show on mobile
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Spacer to push logout button to the right */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Logout button on Topbar */}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* --- Sidebar --- */}
      <Box
        component="nav"
        sx={{
          width: { sm: currentDrawerWidth }, // Responsive width
          flexShrink: { sm: 0 },
        }}
      >
        {/* --- Mobile Drawer (Temporary) --- */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleMobileDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" }, // Show only on mobile
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: desktopDrawerWidth, // Mobile drawer is always full width
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* --- Desktop Drawer (Permanent) --- */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" }, // Show only on desktop
            width: currentDrawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: currentDrawerWidth,
              boxSizing: "border-box",
              // Use theme transition for smooth open/close
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* --- Main content --- */}
      <Box component="main" sx={{ flexGrow: 1,  overflow: 'auto' }}>
        <Toolbar /> {/* Spacer for AppBar */}
        {/* Render children */}
        <Box sx={{ mt: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}