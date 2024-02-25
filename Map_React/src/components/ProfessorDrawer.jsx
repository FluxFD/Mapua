import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import GroupsIcon from "@mui/icons-material/Groups";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import NotesIcon from "@mui/icons-material/Notes";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#36454F",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      backgroundColor: "#36454F",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      backgroundColor: "#36454F",
    },
  }),
}));

export default function ProfessorMiniDrawer({ onItemClick, selectedItem }) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            ...theme.mixins.toolbar,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="end"
            sx={{
              marginRight: 1,
              color: "white",
            }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
        <List>
          {[
            { text: "Dashboard" },
            { text: "Courses" },
            { text: "Calendar" },
            { text: "Message" },
            { text: "Settings" },
            { text: "Logout" },
          ].map((item, index) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block", color: "white" }}
            >
              <ListItemButton
                selected={selectedItem === item.text}
                onClick={() => onItemClick(item.text)}
                to={item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // Adjust the background color as needed
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {index === 0 ? (
                    <DashboardIcon />
                  ) : index === 1 ? (
                    <EventIcon />
                  ) : index === 2 ? (
                    <AirportShuttleIcon />
                  ) : index === 3 ? (
                    <GroupsIcon />
                  ) : index === 4 ? (
                    <ManageAccountsIcon />
                  ) : index === 6 ? (
                    <MarkEmailUnreadIcon />
                  ) : index === 7 ? (
                    <EngineeringIcon />
                  ) : (
                    <LogoutIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
