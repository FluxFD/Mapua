import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal, Row, Col } from "react-bootstrap";
import "../../index.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

// Firebase
import { database, storage, auth } from "../../services/Firebase";
import { ref, onValue, off, set, update, push } from "firebase/database";

function CreateTaskModal({ show, onHide, selectedCourse }) {
  const [quizName, setQuizName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [question, setQuestion] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const [enumerationItems, setEnumerationItems] = useState([""]);
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [answerValue, setAnswerValue] = useState("");

  const handleQuizNameChange = (event) => {
    setQuizName(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleQuestion = (event) => {
    setQuestion(event.target.value);
  };

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleChoiceChange = (index, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
    setSelectedChoiceIndex(index);
  };

  const handleCreateQuiz = async () => {
    const user = auth.currentUser;

    if (user) {
      const createdBy = user.email;
      const quizName = document.getElementById("taskName").value;
      const dueDateInput = document.getElementById("dueDate").value;
      const question = document.getElementById("question").value;
      const questionType = document.getElementById("questionType").value;
      const inputDate = new Date(dueDateInput);
      const month = inputDate.getMonth() + 1;
      const date = inputDate.getDate();
      const year = inputDate.getFullYear();

      const formattedDate = `${month}/${date}/${year}`;

      let answer;

      if (questionType === "MultipleChoice") {
        answer = choices[selectedChoiceIndex];
      } else {
        answer = answerValue;
      }

      try {
        if (questionType === "Enumeration") {
          const enumerationRef = ref(database, "Enumeration");

          const newEnumerationRef = push(enumerationRef);
          const newEnumKey = newEnumerationRef.key;

          await set(newEnumerationRef, {
            Course: selectedCourse.uid,
            createdBy: createdBy,
            date: formattedDate,
            title: quizName,
          });

          const activitiesEnumRef = ref(
            database,
            `Enumeration/${newEnumKey}/activities`
          );
          const newActivityEnumRef = push(activitiesEnumRef);
          const newActivityEnumKey = newActivityEnumRef.key;

          await set(newActivityEnumRef, {
            question: question,
            questionType: questionType,
            answer: enumerationItems,
          });

          setQuestionType("");
          setEnumerationItems([""]);
          setNumberOfItems(1);
          console.log("Enumeration question created successfully");
        } else {
          const taskRef = ref(database, "ReviewerActivity");
          const newTaskRef = push(taskRef);
          const newTaskKey = newTaskRef.key;

          await set(newTaskRef, {
            Course: selectedCourse.uid,
            createdBy: createdBy,
            date: formattedDate,
            title: quizName,
          });

          const activitiesRef = ref(
            database,
            `ReviewerActivity/${newTaskKey}/activities`
          );
          const newActivityRef = push(activitiesRef);
          const newActivityKey = newActivityRef.key;

          const choicesToSave =
            questionType === "MultipleChoice"
              ? choices.reduce((acc, choice, index) => {
                  acc[String.fromCharCode(65 + index)] = choice;
                  return acc;
                }, {})
              : {};

          await set(newActivityRef, {
            question: question,
            questionType: questionType,
            answer: answer,
            choices: choicesToSave,
          });

          console.log("Other types of questions created successfully");
        }

        // Reset form state
        setQuizName("");
        setDueDate("");
        setQuestion("");
        setQuestionType("");
        setAnswer("");
        setChoices(["", "", "", ""]);

        onHide();
      } catch (error) {
        console.error("Error creating quiz: ", error);
      }
    } else {
      console.error("No user is logged in");
    }
  };

  const handleEnumerationItemChange = (e, index) => {
    const { value } = e.target;
    const updatedItems = [...enumerationItems];
    updatedItems[index] = value;
    setEnumerationItems(updatedItems);
  };

  const addEnumerationItem = () => {
    setNumberOfItems(numberOfItems + 1);
    setEnumerationItems([...enumerationItems, ""]);
  };

  const removeEnumerationItem = (index) => {
    setNumberOfItems(numberOfItems - 1);
    setEnumerationItems(enumerationItems.filter((item, i) => i !== index));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="taskName">
                <Form.Control
                  type="text"
                  placeholder="Quiz Name"
                  value={quizName}
                  onChange={handleQuizNameChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="dueDate">
                <Form.Control
                  type="date"
                  placeholder="Due Date"
                  value={dueDate}
                  onChange={handleDueDateChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Select
            aria-label="Default select example"
            id="questionType"
            className="mb-3"
            onChange={handleQuestionTypeChange}
            value={questionType}
          >
            <option>Choose question type</option>
            <option value="MultipleChoice">Multiple Choice</option>
            <option value="Identification">Identification</option>
            <option value="Enumeration">Enumeration</option>
          </Form.Select>
          <Form.Group className="mb-3" controlId="question">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter question"
              value={question}
              onChange={handleQuestion}
            />
          </Form.Group>

          {questionType === "Identification" && (
            <Form.Group className="mb-3" controlId="answer">
              <Form.Control
                type="text"
                placeholder="Enter answer"
                value={answer}
                onChange={handleAnswerChange}
              />
            </Form.Group>
          )}

          {questionType === "Enumeration" && (
            <Form.Group className="mb-3" controlId="enumeration">
              <div className="d-flex justify-content-between align-items-center">
                <Form.Label className="mb-0">
                  <p>Enter answers for enumeration:</p>
                </Form.Label>
                <p
                  className="d-flex align-items-center"
                  onClick={addEnumerationItem}
                >
                  <AddCircleOutlineIcon color="primary" className="me-2" />
                  Add answers
                </p>
              </div>
              {[...Array(numberOfItems)].map((_, index) => (
                <div className="d-flex align-items-center mb-3" key={index}>
                  <Form.Control
                    className="me-2"
                    type="text"
                    placeholder={`Answer ${index + 1}`}
                    value={enumerationItems[index]}
                    onChange={(e) => handleEnumerationItemChange(e, index)}
                  />
                  <DeleteIcon
                    color="error"
                    className="cursor-pointer"
                    onClick={() => removeEnumerationItem(index)}
                  />
                </div>
              ))}
            </Form.Group>
          )}

          {questionType === "MultipleChoice" && (
            <Row className="justify-content-center">
              <Form.Label>Enter choices</Form.Label>
              {choices.map((choice, index) => (
                <Row key={index}>
                  <Col>
                    <Form.Check
                      className="d-flex align-items-center"
                      type="radio"
                      aria-label={`radio ${String.fromCharCode(65 + index)}`}
                      name="choices"
                      id={`choice${index + 1}`}
                      label={
                        <Form.Control
                          className="ms-2"
                          type="text"
                          placeholder={`Choice ${String.fromCharCode(
                            65 + index
                          )}`}
                          value={choice}
                          onChange={(e) =>
                            handleChoiceChange(index, e.target.value)
                          }
                        />
                      }
                    />
                  </Col>
                </Row>
              ))}
            </Row>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateQuiz}>
          Create Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateTaskModal;
