import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

import { database } from "../../../services/Firebase";
import { ref, push, set } from "firebase/database";

function VideoModal({ show, onHide, videoActivity }) {
  const activityKeys = Object.keys(videoActivity.activities);
  const [choices, setChoices] = useState([]);
  const indexToLetter = (index) => String.fromCharCode(65 + index);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);

  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  const handleAnswerChange = (answer) => {
    setAnswer(answer);
  };

  const handleRadioChange = (index) => {
    setSelectedChoiceIndex(index);
  };

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSaveNewItem = () => {
    const activitiesRef = ref(
      database,
      `VideoActivity/${videoActivity.id}/activities`
    );
    const newItemRef = push(activitiesRef);
    const newItemData = {
      question: newQuestion,
      choices: choices.reduce((acc, choice, index) => {
        acc[`${String.fromCharCode(65 + index)}`] = choice;
        return acc;
      }, {}),
      answer: indexToLetter(selectedChoiceIndex),
      time: timestamp,
    };
    set(newItemRef, newItemData)
      .then(() => {
        console.log("New item added successfully");
        setNewQuestion("");
        setChoices([""]);
        setTimestamp("");
        setAnswer("");
        setSelectedChoiceIndex(null);
      })
      .catch((error) => {
        console.error("Error adding new item:", error);
      });
  };

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

        <hr />

        <Form.Group>
          <div
            className="d-flex justify-content-between align-items-center"
            onClick={() => setShowForm(!showForm)}
          >
            <Form.Label className="mb-0">
              <p>Enter new item:</p>
            </Form.Label>
            <p className="d-flex align-items-center">
              <AddCircleOutlineIcon color="primary" className="me-2" />
              {showForm ? "Hide Form" : "Show Form"}
            </p>
          </div>
        </Form.Group>

        {showForm && (
          <>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="New question"
                className="mb-2"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label>Enter choices:</Form.Label>
                <p className="d-flex align-items-center" onClick={addChoice}>
                  <AddCircleOutlineIcon color="primary" className="me-2" />
                  Add choices
                </p>
              </div>

              {choices.map((choice, index) => (
                <div key={index} className="mb-3">
                  <Row className="align-items-center">
                    <Col xs={10}>
                      <Form.Check
                        className="d-flex align-items-center"
                        type="radio"
                        aria-label={`radio ${indexToLetter(index)}`}
                        name="choices"
                        id={`choice${index + 1}`}
                        label={
                          <Form.Control
                            className="ms-2"
                            type="text"
                            placeholder={`Choice ${indexToLetter(index)}`}
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(index, e.target.value)
                            }
                          />
                        }
                        onClick={() => handleAnswerChange(index)}
                        onChange={() => handleRadioChange(index)}
                      />
                    </Col>
                    <Col xs={2}>
                      {index !== 0 && (
                        <CloseIcon
                          color="error"
                          className="cursor-pointer"
                          onClick={() => removeChoice(index)}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>

            <Form.Group className="mb-3" controlId="timestamp">
              <Form.Control
                type="text"
                placeholder="Enter popup duration"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveNewItem}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VideoModal;
