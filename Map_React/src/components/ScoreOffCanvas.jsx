import React from 'react';
import { Offcanvas } from 'react-bootstrap';

function ScoreOffcanvas({ show, handleClose, taskName, scoreValue }) {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{taskName}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <p>Your score for this task is: {scoreValue}</p>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default ScoreOffcanvas;
