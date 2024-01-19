import React, { useState } from "react";
import { Button, Menu, MenuItem, Toolbar } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SortIcon from "@mui/icons-material/Sort";
import UserCard from "./userCard";

export const handleAddProfileClick = (setUserCards) => {
  setUserCards((prevUserCards) => [
    ...prevUserCards,
    <UserCard key={prevUserCards.length} />,
  ]);
};

const Dashtoolbar = () => {
  const [userCards, setUserCards] = useState([]);

  const addProfileClick = () => {
    handleAddProfileClick(setUserCards);
  };

  // SORT MENU
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <Button
          id="sort-btn"
          variant="outlined"
          startIcon={<SortIcon />}
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{color: "white", borderColor: "white"}}
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
      {/* <div>
        <Button
          id="add-profile-btn"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addProfileClick}
          sx={{color: "white", borderColor: "white"}}
        >
          ADD PROFILE
        </Button>
      </div> */}
    </Toolbar>
  );
};

export default Dashtoolbar;