import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {};

export default function BasicModal() {
  const [modalopen, setaddmodalOpen] = React.useState(false);
  const handleaddmodalOpen = () => setOpen(true);
  const handleaddmodalClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleaddmodalOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleaddmodalClose}
        aria-labelledby="add-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="Add Profile" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
