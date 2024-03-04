import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { database } from "../../services/Firebase";
import { ref, push, set } from "firebase/database";

function EnumerationModal({ show, onHide, enumeration }) {
  const { id: enumerationId, title, date, activities, question } = enumeration;

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([""]);

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, ""]);
  };

  const handleNewAnswerChange = (index, event) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = event.target.value;
    setNewAnswers(updatedAnswers);
  };

  const handleSave = () => {
    const activitiesRef = ref(
      database,
      `Enumeration/${enumerationId}/activities`
    );
    const newActivityRef = push(activitiesRef);

    set(newActivityRef, {
      question: newQuestion,
      answer: newAnswers,
      questionType: "Enumeration",
    })
      .then(() => {
        console.log("New question and answers added successfully");
        setNewQuestion("");
        setNewAnswers([""]);
      })
      .catch((error) => {
        console.error("Error adding new question and answers: ", error);
      });
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {activities &&
            Object.values(activities).map((activity) => (
              <div key={activity.id}>
                <Form.Group>
                  <Form.Label>
                    <b>Question:</b> {activity.question}
                  </Form.Label>
                  {activity.answer &&
                    activity.answer.map((ans, index) => (
                      <Form.Control
                        key={index}
                        type="text"
                        value={ans}
                        readOnly
                        className="mb-2"
                        disabled
                      />
                    ))}
                </Form.Group>
              </div>
            ))}
          <hr />
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="New question"
              value={newQuestion}
              className="mb-2 mt-2"
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <hr />

            {newAnswers.map((answer, index) => (
              <Form.Control
                key={index}
                type="text"
                value={answer}
                onChange={(e) => handleNewAnswerChange(index, e)}
                placeholder="New answer"
                className="mt-2  mb-2"
              />
            ))}
            <Button
              className="mt-3"
              variant="secondary"
              onClick={handleAddAnswer}
            >
              Add Answer
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EnumerationModal;
