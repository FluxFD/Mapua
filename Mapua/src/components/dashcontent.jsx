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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import UserCard from "./userCard";
import CustomTheme from "./customTheme";

const Dashcontent = () => {
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
    <Box
      component="main"
      sx={{ flexGrow: 300, p: 1 }}
      backgroundColor="#D9D9D9"
      height="100vh"
    >
      <Toolbar/>
      
    </Box>
  );
};

export default Dashcontent;
