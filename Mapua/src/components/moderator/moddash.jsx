import React, { useState } from "react";
import {
  Toolbar,
  Container,
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
  Card,
  CardContent,
  Pagination,
  AppBar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import UserCard from "./userCard";
import CustomTheme from "../customTheme";
import UserTable from "./userTable";

const ModDash = () => {
  const drawerWidth = 240;

  const [userCards, setUserCards] = useState([]);

  const addProfileClick = () => {
    setUserCards((prevUserCards) => [
      ...prevUserCards,
      <UserCard key={prevUserCards.length} />,
    ]);
  };
  //SORT MENU

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        theme={CustomTheme}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Student/Teacher Profiles
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Paper>
        <UserTable />
      </Paper>
    </>
  );
};

export default ModDash;
