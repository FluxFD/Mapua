import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { database } from "../../services/Firebase";
import { ref, push, set } from "firebase/database";

function EnumerationModal({ show, onHide, enumeration }) {
  const { id: enumerationId, title, date, activities, question } = enumeration;

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([""]);
  const [showForm, setShowForm] = useState(false);

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, ""]);
  };

  const handleNewAnswerChange = (index, event) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = event.target.value;
    setNewAnswers(updatedAnswers);
  };

  const handleDeleteAnswer = (index) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers.splice(index, 1);
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
      QuestionType: "Enumeration",
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
            {showForm && (
              <>
                <Form.Control
                  type="text"
                  placeholder="New question"
                  value={newQuestion}
                  className="mb-2"
                  onChange={(e) => setNewQuestion(e.target.value)}
                />

                {newAnswers.map((answer, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center">
                    <Form.Control
                      type="text"
                      value={answer}
                      onChange={(e) => handleNewAnswerChange(index, e)}
                      placeholder="New answer"
                      className="mr-2"
                    />
                    <DeleteIcon
                      color="error"
                      onClick={() => handleDeleteAnswer(index)}
                    />
                  </div>
                ))}
                <hr />
                <p
                  className="d-flex align-items-center mt-2 justify-content-end"
                  onClick={handleAddAnswer}
                >
                  <AddCircleOutlineIcon color="primary" className="me-2" />
                  Add new answer
                </p>
              </>
            )}
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
