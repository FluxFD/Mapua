import React from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Modal,
  Toolbar,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import CourseTable from "./coursetable";

const Coursecard = ({title, color}) => {
  const [coursemodalopen, setcoursemodalOpen] = React.useState(false);
  const handlecoursemodalOpen = () => setcoursemodalOpen(true);
  const handlecoursemodalClose = () => setcoursemodalOpen(false);

  return (
    <>
      {/* COURSE MODAL */}
      <Modal
        open={coursemodalopen}
        onClose={handlecoursemodalClose}
        aria-labelledby="course-modal"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "150vh",
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
              {title}
            </Typography>
            <IconButton onClick={handlecoursemodalClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Toolbar>
          <Box>
            <CourseTable />
          </Box>
        </Paper>
      </Modal>
      {/* END OF COURSE MODAL */}

      <Card sx={{ height: 100, mb: 3, position: "relative"}}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: 5, // Width of the colored vertical line
            backgroundColor: color, // Color of the vertical line
          }}
        ></div>
        <CardActionArea sx={{ height: "100%" }} onClick={handlecoursemodalOpen}>
          <CardContent>
            <Typography variant="h6">{title}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default Coursecard;
