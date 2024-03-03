import React from "react";
import { Modal, Button } from "react-bootstrap";

function ReviewerModal({ show, onHide, reviewer }) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{reviewer.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* PDF Viewer */}
        <iframe
          src={reviewer.file}
          title="PDF Viewer"
          width="100%"
          height="500px"
          frameBorder="0"
          scrolling="auto"
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReviewerModal;
