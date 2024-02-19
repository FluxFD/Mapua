import React from 'react'
import { Offcanvas, Button, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function ActivityOptionsOffcanvas({ show, handleClose, selectedActivity }) {
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
      <Offcanvas.Body>
        <Row>
          <Button
            className="mt-2"
            variant="primary"
            onClick={handleFlashcardClick}
          >
            <Link
              to={`/flashcards/${selectedActivity?.id}`}
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Flash Cards
            </Link>
          </Button>
        </Row>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default ActivityOptionsOffcanvas
