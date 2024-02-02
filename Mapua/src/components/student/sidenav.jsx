import * as React from "react";
import { Link } from "react-router-dom";

import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";

import {
  Dashboard,
  Settings,
  Book,
  CalendarMonth,
  Mail,
  ExitToApp
} from "@mui/icons-material";

const drawerWidth = 240;

const dashicon = <Dashboard style={{ color: "white" }} />;
const settingsicon = <Settings style={{ color: "white" }} />;
const bookicon = <Book style={{ color: "white" }} />;
const calendaricon = <CalendarMonth style={{ color: "white" }} />;
const messageicon = <Mail style={{ color: "white" }} />;
const exiticon = <ExitToApp style={{ color: "white" }} />;

export default function PermanentDrawerLeft() {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#1E1E1E",
          color: "white",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding component={Link} to="/student/dashboard">
          <ListItemButton>
            <ListItemIcon>{dashicon}</ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding component={Link} to="/student/courses">
          <ListItemButton>
            <ListItemIcon>{bookicon}</ListItemIcon>
            <ListItemText primary="Courses" sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding component={Link} to="/student/calendar">
          <ListItemButton>
            <ListItemIcon>{calendaricon}</ListItemIcon>
            <ListItemText primary="Calendar" sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding component={Link} to="/student/messages">
          <ListItemButton>
            <ListItemIcon>{messageicon}</ListItemIcon>
            <ListItemText primary="Messages" sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding component={Link} to="/student/settings">
          <ListItemButton>
            <ListItemIcon>{settingsicon}</ListItemIcon>
            <ListItemText primary="Settings" sx={{ color: "white" }} />
          </ListItemButton>
        </ListItem>
      
      <ListItem disablePadding component={Link} to="/login">
          <ListItemButton>
            <ListItemIcon>{exiticon}</ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "white" }} />
          </ListItemButton>
      </ListItem>

    </List>
    </Drawer>
  );
}
