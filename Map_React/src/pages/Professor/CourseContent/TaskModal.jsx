import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function TaskModal({ show, onHide, task }) {
  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{task.taskName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {task.Activities ? (
          Object.keys(task.Activities).map((activityId) => {
            const activity = task.Activities[activityId];
            return (
              <div key={activityId}>
                <Form.Group>
                  <Form.Label>
                    <b>Question:</b> {activity.Question}
                  </Form.Label>
                  {Array.isArray(activity.Answer) ? (
                    activity.Answer.map((ans, index) => (
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
                      value={activity.Answer}
                      readOnly
                      className="mb-2"
                      disabled
                    />
                  )}
                </Form.Group>
              </div>
            );
          })
        ) : (
          <div>No activities found.</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;
