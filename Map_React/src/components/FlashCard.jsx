import React, { useState } from 'react'
import {
  Card,
  Container,
  Button,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
  Image,
} from 'react-bootstrap'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import { useNavigate } from 'react-router-dom'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

function Flashcard({ question, answer, onFlip, showAnswer, onNext, onPrev }) {
  const [showTooltip, setShowTooltip] = useState(true)
  const navigate = useNavigate()

  const navigateToMain = () => {
    navigate('/main')
  }

  const handleFlip = () => {
    onFlip()
    setShowTooltip(false)
  }

  const renderAnswer = () => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    return answer;
  };

  return (
    <Container style={{ height: '100vh' }}>
      <div>
        <Button className="mt-5" onClick={navigateToMain}>
          <ArrowCircleLeftIcon />
        </Button>
        <div className="mb-5 d-flex justify-content-center">
          <Image className="" src="/logo.png" style={{ width: '15%' }} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '60vh',
        }}
      >
        <OverlayTrigger
          show={showTooltip}
          target=".card"
          placement="top"
          overlay={<Tooltip>Click the card to show answer</Tooltip>}
        >
          <Card
            style={{
              height: '80%',
              width: '28rem',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={handleFlip}
            className={showAnswer ? 'flipped' : ''}
          >
            <div className="card-inner">
              <div className="card-front d-flex justify-content-center align-items-center">
                <Card.Body>
                  <h1>{question}</h1>
                </Card.Body>
              </div>
              <div className="card-back d-flex justify-content-center align-items-center">
                <Card.Body>
                  <h1>
                  <span>Answer:</span> {renderAnswer()}
                  </h1>
                </Card.Body>
              </div>
            </div>
          </Card>
        </OverlayTrigger>

        <div style={{ marginTop: '1rem' }}>
          <Button
            variant="warning"
            onClick={onPrev}
            className="btn btn-secondary"
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>{' '}
          <Button
            variant="success"
            onClick={onNext}
            className="btn btn-secondary"
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default Flashcard
