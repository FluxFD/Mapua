import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ref, onValue } from "firebase/database";
import { database } from "../../services/Firebase";
import Chip from "@mui/material/Chip";

function ProfScoreView({ show, onHide, score }) {
  const [subScores, setSubScores] = useState([]);

  useEffect(() => {
    if (score) {
      const scoresRef = ref(database, `Score/${score.id}/scores`);
      const scoresListener = onValue(scoresRef, (snapshot) => {
        const scoresData = snapshot.val();
        if (scoresData) {
          const scoresArray = Object.values(scoresData);
          setSubScores(scoresArray);
        } else {
          setSubScores([]);
        }
      });

      return () => {
        scoresListener();
      };
    }
  }, [score]);

  if (!score) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          {score.taskName} - {score.studentName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {subScores.map((subScore, index) => (
            <div key={index}>
              <Form.Group className="mb-3">
                <Form.Label className="d-flex justify-content-between align-items-center">
                  <div>
                    <b>Question:</b> {subScore.question}
                  </div>
                  <div>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={subScore.isCorrect ? "1/1" : "0/1"}
                      color={subScore.isCorrect ? "success" : "error"}
                    />
                  </div>
                </Form.Label>

                <div>
                  <Form.Label className="text-muted">
                    Correct Answer:
                  </Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="text"
                    value={subScore.correctAnswer}
                    readOnly
                    disabled
                  />

                  <Form.Label className="text-muted">
                    Student Answer:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={subScore.userAnswer}
                    readOnly
                    disabled
                  />
                </div>
              </Form.Group>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfScoreView;
