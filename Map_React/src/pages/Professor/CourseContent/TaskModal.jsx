import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { database } from "../../../services/Firebase";
import { ref, push, set } from "firebase/database";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

function TaskModal({ show, onHide, task, selectedTask, setSelectedTask }) {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState([""]);
  const [showForm, setShowForm] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const [enumerationItems, setEnumerationItems] = useState([""]);
  const [answer, setAnswer] = useState("");
  const [answerValue, setAnswerValue] = useState("");
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState(null);

  const handleQuestionTypeChange = (event) => {
    setQuestionType(event.target.value);
  };

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleChoiceChange = (index, value) => {
    setSelectedChoiceIndex(value);
    const updatedChoices = [...choices];
    updatedChoices[index] = value;
    setChoices(updatedChoices);
  };

  const handleRadioChange = (value) => {
    setSelectedChoiceIndex(value);
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

  const handleSave = () => {
    const activitiesRef = ref(database, `Tasks/${selectedTask.id}/Activities`);
    const newActivityRef = push(activitiesRef);

    let newActivity;

    if (questionType === "Enumeration") {
      newActivity = {
        Question: newQuestion,
        Answer: enumerationItems,
        questionType: questionType,
      };
    } else if (questionType === "MultipleChoice") {
      const choicesToSave = choices.reduce((acc, choice, index) => {
        acc[String.fromCharCode(65 + index)] = choice;
        return acc;
      }, {});
      newActivity = {
        Question: newQuestion,
        Choices: choicesToSave,
        questionType: questionType,
        Answer: selectedChoiceIndex, // Update the Answer to hold the selected choice index
      };
    } else {
      newActivity = {
        Question: newQuestion,
        Answer: answer,
        questionType: questionType,
      };
    }

    set(newActivityRef, newActivity)
      .then(() => {
        console.log("New item added successfully");
        setQuestionType("");
        setEnumerationItems([""]);
        setNumberOfItems(1);
        setNewQuestion("");
        setNewAnswers([""]);
        setChoices(["", "", "", ""]);
        setAnswer("");

        setSelectedTask((prevTask) => ({
          ...prevTask,
          Activities: {
            ...prevTask.Activities,
            [newActivityRef.key]: newActivity,
          },
        }));
      })
      .catch((error) => {
        console.error("Error adding new activity: ", error);
      });
  };

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

            <Form.Control
              as="textarea"
              rows={3}
              placeholder="New question"
              value={newQuestion}
              className="mb-2"
              onChange={(e) => setNewQuestion(e.target.value)}
            />

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
                        // checked={selectedChoiceIndex === index} // Add checked prop to mark the selected radio button
                        // onClick={() => handleRadioChange(index)}

                        checked={selectedChoiceIndex === index} // Add checked prop
                        onChange={() => handleRadioChange(choice)} // Add onChange handler
                      />
                    </Col>
                  </Row>
                ))}
              </Row>
            )}
            <hr />
          </>
        )}
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

export default TaskModal;
