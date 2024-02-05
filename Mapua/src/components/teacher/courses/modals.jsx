// ModalComponents.js

import React from "react";
import {
  Modal,
  Paper,
  Toolbar,
  Typography,
  IconButton,
  Box,
  FormControl,
  TextField,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";

export const CreateModal = ({ open, handleClose, handleCreate, newQuizName, setNewQuizName }) => (
  <Modal open={open} onClose={handleClose} aria-labelledby="create-modal">
    <Paper>
      <Toolbar>
        <Typography variant="h6">Create</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Toolbar>
      <Box p={2}>
        <FormControl sx={{ width: "100%" }}>
          <TextField
            label="Quiz Name"
            variant="outlined"
            value={newQuizName}
            onChange={(e) => setNewQuizName(e.target.value)}
            sx={{ m: 1 }}
          />
          <FormControlLabel control={<Switch defaultChecked />} label="Label" />
          <Button variant="contained" color="primary" sx={{ m: 1, width: "25%" }} onClick={handleCreate}>
            Create
          </Button>
        </FormControl>
      </Box>
    </Paper>
  </Modal>
);

export const EditModal = ({ open, handleClose, handleEdit, newQuizName, setNewQuizName }) => (
  <Modal open={open} onClose={handleClose} aria-labelledby="edit-modal">
    <Paper>
      <Toolbar>
        <Typography variant="h6">Edit</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Toolbar>
      <Box p={2}>
        <FormControl>
          <TextField
            label="Quiz Name"
            variant="outlined"
            value={newQuizName}
            onChange={(e) => setNewQuizName(e.target.value)}
            sx={{ m: 1 }}
          />
          <Button variant="contained" color="primary" sx={{ m: 1, width: "25%" }} onClick={handleEdit}>
            UPDATE
          </Button>
        </FormControl>
      </Box>
    </Paper>
  </Modal>
);
