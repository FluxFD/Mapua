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
    //   backgroundColor="#D9D9D9"
      height="100vh"
    >
      <Toolbar /> 
      <Toolbar ></Toolbar> 
        {userCards}
        <Card
          variant="outlined"
          align="center"
          style={{ backgroundColor: "#D9D9D9", border: "2px dotted grey" }}
        >
          <CardContent>
            <Button
              id="add-profile-btn"
              sx={{ color: "black" }}
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addProfileClick}
              theme={CustomTheme}
            >
              Add Profile       
            </Button>
          </CardContent>
        </Card>
      </Box>
  );
};

export default Dashcontent;
