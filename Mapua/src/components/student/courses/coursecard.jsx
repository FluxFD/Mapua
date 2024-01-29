import React from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Button,
  Modal,
  Toolbar,
  IconButton,
  Box,

} from "@mui/material";
import { Close, } from "@mui/icons-material";

const Coursecard = () => {
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
              Certificate
            </Typography>
            <IconButton onClick={handlecoursemodalClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Toolbar>
          <Box sx={{ paddingLeft: 10, paddingRight: 10 }}>
            
          </Box>
        </Paper>
      </Modal>
      {/* END OF COURSE MODAL */}

      <Card sx={{ height: 100, mb: 3 }}>
        <CardActionArea sx={{ height: "100%" }} onClick={handlecoursemodalOpen}>
          <CardContent>
            <Typography variant="h6">Certificate</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default Coursecard;
