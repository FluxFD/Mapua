import React, { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Paper,
  Button,
  Toolbar,
  Menu,
  MenuItem,
  Pagination,
  Typography,
  IconButton,
  Modal,
  Chip,
  TableFooter,
  Stack,
  Box,
  FormControl,
  Input,
  TextField,
} from "@mui/material";
import {
  Add,
  Sort,
  Delete,
  Edit,
  Search,
  Close,
  Save,
} from "@mui/icons-material";
import CustomTheme from "../customTheme";

const UserTable = () => {
  // const username = useState('');
  // const idnum = useState('');
  // const status = useState('');

  //DATA CONNECTION
  const [data, setData] = React.useState([
    { id: 1, name: "Juan Dela Cruz", idnum: "0123456789", status: "true" },
    { id: 2, name: "Juana Dela Cruz", idnum: "0123456789", status: "true" },
    { id: 3, name: "Pilar Palacio", idnum: "0123456789", status: "true" },
    { id: 4, name: "Protacio Palacio", idnum: "0123456789", status: "true" },
    { id: 5, name: "John Doe", idnum: "0123456789", status: "true" },
    { id: 6, name: "Jane Doe", idnum: "0123456789", status: "true" },
    { id: 7, name: "Juan Dela Cruz", idnum: "0123456789", status: "true" },
    { id: 8, name: "Juan Dela Cruz", idnum: "0123456789", status: "true" },
    { id: 9, name: "Juan Dela Cruz", idnum: "0123456789", status: "true" },
    { id: 10, name: "Juan Dela Cruz", idnum: "0123456789", status: "true" },
    // add more data as needed
  ]);

  const chipcolor = (row) => {
    if (row.status === "true") {
      return (
        <Chip
          variant="contained"
          color="success"
          label="Logged in"
          sx={{ width: "100%" }}
        />
      );
    } else if (row.status === "false") {
      return (
        <Chip variant="contained" label="Logged out" sx={{ width: "100%" }} />
      );
    } else {
      return (
        <Chip
          variant="contained"
          color="error"
          label="ERROR"
          sx={{ width: "100%" }}
        />
      );
    }
  };

  //ADD PROFILE MODAL
  const [addmodalopen, setaddmodalOpen] = React.useState(false);
  const handleaddmodalOpen = () => setaddmodalOpen(true);
  const handleaddmodalClose = () => setaddmodalOpen(false);

  //ADD PROFILE MODAL
  const [editmodalopen, seteditmodalOpen] = React.useState(false);
  const handleeditmodalOpen = () => seteditmodalOpen(true);
  const handleeditmodalClose = () => seteditmodalOpen(false);

  //ADD PROFILE BUTTON
  const handleAddProfile = () => {
    const newId = data.length + 1;
    const newProfile = { id: newId, name: "New User", age: 0 }; //SQL INPUT GOES HERE
    setData([...data, newProfile]);
    handleaddmodalClose();
  };

  //SORT BUTTON
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handlesortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlesortClose = () => {
    setAnchorEl(null);
  };

  //PAGINATION
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      {/* ADD PROFILE MODAL */}
      <Modal
        open={addmodalopen}
        onClose={handleaddmodalClose}
        aria-labelledby="add-modal"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vh",
            height: "80vh",
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
              Add Profile
            </Typography>
            <IconButton onClick={handleaddmodalClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Toolbar>
          <Box sx={{ paddingLeft: 10, paddingRight: 10 }}>
            <FormControl
              required
              component="form"
              // onSubmit={handleSubmit}
              noValidate
              fullWidth
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
              />

              <Stack direction="row" spacing={2}>
                <Button
                  type="cancel"
                  onClick={handleaddmodalClose}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  // onClick={handleSubmit}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  startIcon={<Save />}
                  onClick={handleAddProfile}
                >
                  Save
                </Button>
              </Stack>
            </FormControl>
          </Box>
        </Paper>
      </Modal>
      {/* END OF ADD PROFILE MODAL */}

      {/* EDIT PROFILE MODAL */}
      <Modal
        open={editmodalopen}
        onClose={handleeditmodalClose}
        aria-labelledby="add-modal"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80vh",
            height: "80vh",
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
              Edit Profile
            </Typography>
            <IconButton onClick={handleeditmodalClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Toolbar>
          <Box sx={{ paddingLeft: 10, paddingRight: 10 }}>
            <FormControl
              required
              component="form"
              // onSubmit={handleSubmit}
              noValidate
              fullWidth
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                id="password"
              />

              <Stack direction="row" spacing={2}>
                <Button
                  type="cancel"
                  onClick={handleeditmodalClose}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  // onClick={handleSubmit}
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  startIcon={<Save />}
                  onClick={handleAddProfile}
                >
                  Save
                </Button>
              </Stack>
            </FormControl>
          </Box>
        </Paper>
      </Modal>
      {/* EDIT OF EDIT PROFILE MODAL */}

      {/* TOOLBAR */}
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack direction="row">
          <Button
            id="sort-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handlesortClick}
            variant="text"
            startIcon={<Sort />}
            sx={{ marginRight: 1 }}
          >
            SORT
          </Button>

          <Menu
            id="sort-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handlesortClose}
            MenuListProps={{
              "aria-labelledby": "sort-button",
            }}
          >
            <MenuItem onClick={handlesortClose}>Ascending</MenuItem>
            <MenuItem onClick={handlesortClose}>Descending</MenuItem>
            <MenuItem onClick={handlesortClose}>By Date</MenuItem>
          </Menu>

          {/* <IconButton aria-label="search">
            <Search />
          </IconButton> */}
        </Stack>
        {/* SORT BUTTON */}

        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={handleaddmodalOpen}
          theme={CustomTheme}
        >
          ADD PROFILE
        </Button>
      </Toolbar>
      {/* END TOOLBAR */}

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{ height: "85vh", maxHeight: "85vh" }}
      >
        <Table>
          <TableBody>
            {data.slice(0, 10).map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ width: "85%" }}>
                  <Typography variant="h4" fontSize={16} fontWeight={"bold"}>
                    {row.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: "gray" }}>
                    ID Number: {row.idnum}
                  </Typography>
                </TableCell>
                {/* <TableCell sx={{ width: "7%" }}>{chipcolor(row)}</TableCell> */}
                <TableCell sx={{ width: "10%" }}>
                  <IconButton aria-label="edit" onClick={handleeditmodalOpen}>
                    <Edit />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[]} // Customize the rows per page options as needed
                colSpan={3} // Span the pagination across all columns
                count={data.length} // Total number of rows
                rowsPerPage={5} // Initial rows per page
                page={0} // Initial page index
                onChangePage={() => {}} // Handle page change
                onChangeRowsPerPage={() => {}} // Handle rows per page change
                sx={{
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                  background: "white",
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* END TABLE */}
    </>
  );
};

export default UserTable;
