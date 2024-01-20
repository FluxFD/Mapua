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
      <Paper elevation={3} sx={{ width: "100%", marginBottom: 1 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "sticky",
          }}
        >
          <div>
            <Button
              id="sort-btn"
              variant="outlined"
              startIcon={<SortIcon />}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              SORT
            </Button>
            <Menu
              id="sort-btn-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>Ascending</MenuItem>
              <MenuItem onClick={handleClose}>Descending</MenuItem>
              <MenuItem onClick={handleClose}>Date Added</MenuItem>
            </Menu>
          </div>
          <div>
            <Button
              id="add-profile-btn"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addProfileClick}
            >
              ADD PROFILE
            </Button>
          </div>
        </Toolbar>
      </Paper>
      {userCards}
      <Card
        variant="outlined"
        align="center"
        style={{ backgroundColor: "#D9D9D9", border: "2px dotted grey", height: "70px" }}
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

      <Pagination
        count={10}
        sx={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-15%)",
        }}
      />
    </Box>
  );
};

export default Dashcontent;
