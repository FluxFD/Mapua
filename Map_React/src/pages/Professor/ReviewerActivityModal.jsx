import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function ReviewerActivityModal({ show, onHide, activity }) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{activity.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {activity.activities.map((act) => (
          <div key={act.id}>
            <Form.Group>
              <Form.Label>
                <b>Question:</b> {act.question}
              </Form.Label>
              {Array.isArray(act.answer) ? (
                act.answer.map((ans, index) => (
                  <Form.Control
                    key={index}
                    type="text"
                    value={ans}
                    readOnly
                    className="mb-2"
                    disabled
                  />
                ))
              ) : (
                <Form.Control
                  type="text"
                  value={act.answer}
                  readOnly
                  className="mb-2"
                  disabled
                />
              )}
            </Form.Group>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReviewerActivityModal;
