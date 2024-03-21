import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

function VideoModal({ show, onHide, videoActivity }) {
  // Convert activities object keys to an array
  const activityKeys = Object.keys(videoActivity.activities);

  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{videoActivity.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <iframe
          src={videoActivity.video}
          title="PDF Viewer"
          width="100%"
          height="500px"
          frameBorder="0"
          scrolling="auto"
        ></iframe>

        {activityKeys.length ? (
          activityKeys.map((key) => {
            const activity = videoActivity.activities[key];
            return (
              <div key={key}>
                <Form className="mt-2">
                  <Form.Group>
                    <Form.Label>
                      <b>Question:</b> {activity.question}
                    </Form.Label>
                  </Form.Group>
                  <Row>
                    {Object.entries(activity.choices).map(
                      ([choiceKey, choiceValue]) => (
                        <Col key={choiceKey}>
                          <Form.Check
                            className="d-flex align-items-center"
                            type="radio"
                            label={
                              <span className="ms-2">
                                <b>{`${choiceKey}: ${choiceValue}`}</b>
                              </span>
                            }
                            checked={choiceKey === activity.answer}
                            disabled
                          />
                        </Col>
                      )
                    )}
                  </Row>
                  <Form.Control
                    className="mt-2"
                    type="text"
                    placeholder={activity.time}
                    disabled
                  />
                </Form>
              </div>
            );
          })
        ) : (
          <p>No activities found</p>
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

export default VideoModal;
