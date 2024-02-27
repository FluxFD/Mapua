import React, { useState } from 'react';
import { Offcanvas, Button, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ViewScoreModal from './ViewScoreModal';

function ActivityOptionsOffcanvas({ show, handleClose, selectedActivity }) {
  const [showViewScoreModal, setShowViewScoreModal] = useState(false);

  const handleViewScoreModalClose = () => setShowViewScoreModal(false);
  const handleViewScoreModalShow = async () => {
    setShowViewScoreModal(true);

  }


  const handleFlashcardClick = () => {
    handleClose()
  }

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {selectedActivity && selectedActivity.title}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ display: 'flex', flexDirection: 'column' }}>

        <Row>
          <Button
            className="mt-2"
            variant="primary"
            // onClick={""}
          >
            <Link
              to={`/flashcards/${selectedActivity?.id}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Flash Cards
            </Link>
          </Button>
          <Button
            className="mt-2"
            variant="primary"
            // onClick={""}
          >
            <Link
              to={`/multiplechoice/${selectedActivity?.id}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Multiple Choice
            </Link>
          </Button>
          <Button
            className="mt-2"
            variant="primary"
            // onClick={""}
          >
            <Link
              to={`/identification/${selectedActivity?.id}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Identification
            </Link>
          </Button>
          <Button
            className="mt-2"
            variant="primary"
            // onClick={""}
          >
            <Link
              to={`/practiceQuestion/${selectedActivity?.id}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Practice Question
            </Link>
          </Button>
        </Row>
        <div style={{ marginTop: 'auto' }}>
          <Button
            className="mb-3"
            variant="success"
             onClick={handleViewScoreModalShow}
          >
            View Score
          </Button>
        </div>
        </Offcanvas.Body>
      {/* Conditionally render ViewScoreModal only when selectedActivity is available */}
      {selectedActivity && (
        <ViewScoreModal
          show={showViewScoreModal}
          handleClose={handleViewScoreModalClose}
          selectedActivity={selectedActivity}
        />
      )}
    </Offcanvas>
  )
}

export default ActivityOptionsOffcanvas
