import { useState, useEffect } from "react";
import axios from "axios";

import {
  Toolbar,
  Box,
  Paper,
  Typography,
  Modal,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  TextField,
  Switch,
} from "@mui/material";

import { Close, Edit, Delete, Add } from "@mui/icons-material";
import { createQuiz, editQuiz, deleteQuiz, fetchQuizzes } from "./crud";

const Test = () => {
  const [newQuizName, setNewQuizName] = useState("");
  const [quizId, setEditQuizId] = useState("");
  const [rows, setRows] = useState([]);
  const columns = [
    { id: "qid", label: "Quiz ID" },
    { id: "qname", label: "Quiz Name" },
    {
      id: "actions",
      label: "Actions",
      align: "left",
      format: (value, row) => (
        <>
          <IconButton onClick={() => handleeditmodalOpen(row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(row)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  // Functions for creating, editing, and deleting quizzes
  const handleCreate = () => {
    createQuiz(newQuizName)
      .then((response) => {
        console.log("Quiz created successfully:", response.data);
        setNewQuizName("");
        handlecreatemodalClose();
      })
      .catch((error) => {
        console.error("Error creating quiz:", error);
      });
  };

  const handleEdit = () => {
    editQuiz(quizId, newQuizName)
      .then((response) => {
        console.log("Quiz updated successfully:", response.data);
        setNewQuizName("");
        handleeditmodalClose();
      })
      .catch((error) => {
        console.error("Error updating quiz:", error);
      });
  };

  const handleDelete = (row) => {
    const quizId = row.quiz_id;
    console.log("Deleting quiz with ID:", quizId);

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );
    if (!confirmDelete) return;

    deleteQuiz(quizId)
      .then((response) => {
        console.log("Quiz deleted successfully:", response.data);
        setRows((prevRows) => prevRows.filter((r) => r.quiz_id !== quizId));
      })
      .catch((error) => {
        console.error("Error deleting quiz:", error);
      });
  };

  // GET QUIZ
  useEffect(() => {
    fetch(`http://localhost/learn/URL_QUIZ.php?quizName=${newQuizName}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data from the server has a 'data' property containing an array of quizzes
        setRows(data.data || []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [newQuizName]);

  const [createmodalopen, setcreatemodalOpen] = useState(false);
  const handlecreatemodalOpen = () => {
    setNewQuizName("");
    setcreatemodalOpen(true);
  };
  const handlecreatemodalClose = () => setcreatemodalOpen(false);

  const [editmodalopen, seteditmodalOpen] = useState(false);
  const handleeditmodalOpen = (quiz) => {
    console.log("Quiz to edit:", quiz);
    if (quiz.quiz_id) {
      setNewQuizName(quiz.quiz_name);
      setEditQuizId(quiz.quiz_id);
      seteditmodalOpen(true);
    } else {
      console.error("Quiz ID is undefined.");
    }
  };

  const handleeditmodalClose = () => seteditmodalOpen(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      {/* CREATE MODAL */}
      <Modal
        open={createmodalopen}
        onClose={handlecreatemodalClose}
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
              Create
            </Typography>
            <IconButton
              onClick={handlecreatemodalClose}
              sx={{ color: "white" }}
            >
              <Close />
            </IconButton>
          </Toolbar>
          <Box sx={{ p: 2, width: "100%", height: "100vh" }}>
            <FormControl sx={{ width: "100%" }}>
              <TextField
                label="Quiz Name"
                variant="outlined"
                value={newQuizName}
                onChange={(e) => setNewQuizName(e.target.value)}
                sx={{ m: 1 }}
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Label"
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ m: 1, width: "25%" }}
                onClick={handleCreate}
              >
                Create
              </Button>
            </FormControl>
          </Box>
        </Paper>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        open={editmodalopen}
        onClose={handleeditmodalClose}
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
              Edit
            </Typography>
            <IconButton onClick={handleeditmodalClose} sx={{ color: "white" }}>
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
              <Button
                variant="contained"
                color="primary"
                sx={{ m: 1, width: "25%" }}
                onClick={handleEdit}
              >
                UPDATE
              </Button>
            </FormControl>
          </Box>
        </Paper>
      </Modal>

      {/* TABLE */}

      <Paper sx={{ width: "100%", overflow: "hidden", marginTop: 2 }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography id="modal-modal-title" variant="h6">
            Quizzes
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={handlecreatemodalOpen}
          >
            CREATE
          </Button>
        </Toolbar>

        <TableContainer sx={{ height: 730, maxHeight: 730 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    <b>{column.label}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.quiz_id}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "actions"
                          ? column.format(row[column.id], row)
                          : column.id === "qname"
                          ? row.quiz_name
                          : column.id === "qid"
                          ? row.quiz_id
                          : column.format && typeof row[column.id] === "number"
                          ? column.format(row[column.id])
                          : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default Test;
