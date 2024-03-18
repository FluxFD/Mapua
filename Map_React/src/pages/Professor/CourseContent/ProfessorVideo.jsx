import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

function CreateVideoModal({ show, onHide, selectedCourse }) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Video</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={onHide}>
          Upload Video
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateVideoModal;
