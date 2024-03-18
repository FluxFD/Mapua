import React, { useState, useEffect } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';

function ViewScoreModal({ show, handleClose, selectedActivity }) {
  const { currentUser } = useAuth();
  const [userScores, setUserScores] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const scoresRef = ref(database, 'Score');
    onValue(scoresRef, (snapshot) => {
      const scoresData = snapshot.val() || {};

      // Filter scores for the current user and selected activity
      const filteredScores = Object.values(scoresData).filter(score => {
        return score.studentId === currentUser.uid && score.taskName === selectedActivity.taskName;
      });

      // Set the filtered scores to state
      setUserScores(filteredScores);
    });
  }, [currentUser, selectedActivity]);


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Scores: {selectedActivity && selectedActivity.taskName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      <h4>Grading</h4>
        <div className="d-flex flex-column align-items-center justify-content-center">
          {userScores.length > 0 ? (
            userScores.map((score, index) => {
              let backgroundColor;
              if (score.score >= 80 && score.score <= 100) {
                backgroundColor = '#50C878'; // Green
              } else if (score.score >= 60 && score.score <= 79) {
                backgroundColor = 'yellow';
              } else if (score.score >= 40 && score.score <= 59) {
                backgroundColor = 'orange';
              } else {
                backgroundColor = 'red';
              }

              return (
                <Card key={index} style={{ height: '50px', backgroundColor, borderRadius: "40px", width: "30%", margin: "5px" }} className="d-flex justify-content-center align-items-center">

                  <h4 className='text-white'>{score.score}%</h4>
                </Card>
              );
            })
          ) : (
              <p>No score found for the current user and activity.</p>
            )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewScoreModal;
