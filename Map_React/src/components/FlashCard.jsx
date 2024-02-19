import React, { useState } from 'react';
import { Card, Container, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function Flashcard({ question, answer, onFlip, showAnswer, onNext, onPrev }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const navigate = useNavigate();

  const navigateToMain = () => {
    navigate('/main');
  };

  const handleFlip = () => {
    onFlip();
    setShowTooltip(false);
  };

  return (
    <Container style={{ height: '100vh' }}>
      <div>
<Button className="mt-2" onClick={navigateToMain}>
        <ArrowCircleLeftIcon />
      </Button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
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
              height: '50%',
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
                  <Card.Text>
                    <h1>{question}</h1>
                  </Card.Text>
                </Card.Body>
              </div>
              <div className="card-back d-flex justify-content-center align-items-center">
                <Card.Body>
                  <Card.Text>
                    <h1>
                      <span>Answer:</span> {answer}
                    </h1>
                  </Card.Text>
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
  );
}

export default Flashcard;
