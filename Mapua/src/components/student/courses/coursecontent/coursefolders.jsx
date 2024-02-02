import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import { ArrowDropDown, Folder, Book, Quiz } from "@mui/icons-material";

const CourseFiles = ({ files }) => {
  const handleClick = () => {
    // Handle click event for CourseFiles
    console.log("CourseFiles clicked!");
  };

  

  return (
    <Box sx={{ p: 2 }}>
      <List>
        {files.map((file, index) => (
          <ListItemButton key={index}>
            <ListItemAvatar>
              <Avatar>
                <Book />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={file} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

const CourseFolders = ({ folders }) => {
  const [expand, setExpand] = useState({});

  const handleToggle = (index) => {
    setExpand((prevExpand) => ({
      ...prevExpand,
      [index]: !prevExpand[index],
    }));
  };

  return (
    <List>
      {folders.map((folder, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Folder />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={folder.title} />
            <IconButton onClick={() => handleToggle(index)}>
              <ArrowDropDown />
            </IconButton>
          </ListItem>
          <Collapse in={expand[index]} timeout="auto" unmountOnExit>
            <Box sx={{ paddingLeft: 2, backgroundColor: "#f0f0f0" }}>
              <CourseFiles files={folder.files} />
            </Box>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default CourseFolders;
