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
  Modal,
  Paper,
  Toolbar,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { ArrowDropDown, Folder, Book, Close, Add } from "@mui/icons-material";

const CourseFiles = ({ files }) => {
  const [filemodalopen, setfilemodalOpen] = React.useState(false);
  const handlefilemodalOpen = () => setfilemodalOpen(true);
  const handlefilemodalClose = () => setfilemodalOpen(false);

  return (
    <>
      {/* COURSE MODAL */}
      <Modal
        open={filemodalopen}
        onClose={handlefilemodalClose}
        aria-labelledby="file-modal"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vh",
            height: "95vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
          }}
        >
          <Toolbar
            sx={{
              backgroundColor: "#1B365B",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" color={"white"}>
              Create New
            </Typography>
            <IconButton onClick={handlefilemodalClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Toolbar>
          <Box p={2}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
                <FormControlLabel
                  value="disabled"
                  disabled
                  control={<Radio />}
                  label="other"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Paper>
      </Modal>
      {/* END OF COURSE MODAL */}

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
          <Divider />
          <ListItemButton>
            <ListItemAvatar>
              <Avatar>
                <Add />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Create New" onClick={handlefilemodalOpen} />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
};

const CourseFolders = ({ folders }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <List>
      {folders.map((folder, index) => (
        <React.Fragment key={index}>
          <ListItemButton onClick={() => handleToggle(index)}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <Folder />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={folder.title} />
              <IconButton>
                <ArrowDropDown />
              </IconButton>
            </ListItem>
          </ListItemButton>
          <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
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
