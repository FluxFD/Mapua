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
} from "@mui/material";

import { Close, Edit, Delete, Add } from "@mui/icons-material";



const Test = () => {
  const columns = [
    { id: "qid", label: "Quiz ID" },
    { id: "qname", label: "Quiz Name" },
    {
      id: "actions",
      label: "Actions",
      align: "left",
      format: (value, row) => (
        <>
          <IconButton onClick={handleeditmodalOpen}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.qid)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost/learn/URL_QUIZ.php", { withCredentials: true })
        .then((response) => {
            setRows(response.data);
        })
        .catch((error) => {
            console.error("Error fetching quiz data:", error);
        });
}, []);

  function createData(qid, qname) {
    return { qid, qname };
  }

  const [createmodalopen, setcreatemodalOpen] = useState(false);
  const handlecreatemodalOpen = () => setcreatemodalOpen(true);
  const handlecreatemodalClose = () => setcreatemodalOpen(false);

  const [editmodalopen, seteditmodalOpen] = useState(false);
  const handleeditmodalOpen = () => seteditmodalOpen(true);
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
          <Box sx={{ p: 2, width: '100%', height: '100vh' }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField label="Quiz Name" variant="outlined" sx={{ m: 1 }} />
              <Button
                variant="contained"
                color="primary"
                sx={{ m: 1 }}
                onClick={handlecreatemodalClose}
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

        <TableContainer sx={{ height: 600, maxHeight: 600 }}>
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
                  <TableRow key={row.qid} hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "actions"
                          ? column.format(row[column.id], row)
                          : column.format && typeof row[column.id] === "number"
                          ? column.format(row[column.id])
                          : row[column.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              <TableRow></TableRow>
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
