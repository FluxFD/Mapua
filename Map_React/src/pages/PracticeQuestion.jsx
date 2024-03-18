import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { database } from '../services/Firebase'
import { ref, get, child, set, push } from 'firebase/database'
import {
  Container,
  Form,
  Button,
  Spinner,
  Card,
  Row,
  Col,
  Image,
  Modal,
} from 'react-bootstrap'
import useAuth from '../services/Auth'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'

function PracticeQuestion() {
  const { activityId } = useParams()
  const [selectedOptions, setSelectedOptions] = useState([])
  const [activities, setActivities] = useState([])
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activityTitle, setActivityTitle] = useState('')
  const [showModal, setShowModal] = useState(true)
  const [timerInput, setTimerInput] = useState(0)
  const [displayTimer, setDisplayTimer] = useState('')
  const [timerExpired, setTimerExpired] = useState(false)

  const handleCloseModal = () => setShowModal(false)

  const handleOptionChange = (index, option) => {
    const updatedOptions = [...selectedOptions]
    updatedOptions[index] = option
    setSelectedOptions(updatedOptions)
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activityRef = ref(database, `ReviewerActivity/${activityId}`)
        const activitySnapshot = await get(activityRef)

        if (activitySnapshot.exists()) {
          const activityData = activitySnapshot.val()
          const title = activityData.title
          setActivityTitle(title)

          const questionsSnapshot = await get(child(activityRef, 'activities'))

          if (questionsSnapshot.exists()) {
            const questions = []
            questionsSnapshot.forEach((childSnapshot) => {
              const questionData = childSnapshot.val()
              const questionType = questionData.questionType
              questions.push({ ...questionData, questionType })
            })
            setActivities(questions)
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [activityId])

  const handleSubmit = (e) => {
    e?.preventDefault()
    setIsLoading(true)

    const scores = []

    setTimeout(() => {
      let correctAnswers = 0
      activities.forEach((question, index) => {
        const userAnswer = selectedOptions[index]
        const correctAnswer = question.answer
        const isCorrect =
          userAnswer !== undefined &&
          correctAnswer !== undefined &&
          (question.questionType === 'Identification'
            ? userAnswer.toLowerCase() === correctAnswer.toLowerCase()
            : userAnswer === correctAnswer)

        if (isCorrect) {
          correctAnswers++
        }

        scores.push({
          question: question.question,
          userAnswer: userAnswer || '',
          correctAnswer: correctAnswer || '',
          isCorrect: isCorrect,
        })
      })

      const score = (correctAnswers / activities.length) * 100

      const studentRef = ref(database, `students/${currentUser.uid}`)
      get(studentRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const studentName = snapshot.val().name

            const scoreRef = ref(database, `Score`)
            const newScoreRef = push(scoreRef)
            set(newScoreRef, {
              taskName: activityTitle,
              score: score,
              studentName: studentName,
              studentId: currentUser.uid,
              scores: scores,
            })
              .then(() => {
                console.log('Score saved successfully.')
                setIsLoading(false)
                navigate('/main')
              })
              .catch((error) => {
                console.error('Error saving score:', error)
              })
          } else {
            console.log('Student data not found.')
          }
        })
        .catch((error) => {
          console.error('Error fetching student data:', error)
        })

      setSelectedOptions([])
    }, 3000)
  }

  const navigateToMain = () => {
    navigate('/main')
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const startTimer = () => {
    let seconds = timerInput * 60
    const timerInterval = setInterval(() => {
      if (seconds > 0) {
        setDisplayTimer(formatTime(seconds))
        seconds--
      } else {
        clearInterval(timerInterval)
        setTimerExpired(true)
      }
    }, 1000)
  }

  useEffect(() => {
    if (timerExpired) {
      handleSubmit()
    }
  }, [timerExpired])

  const handleSubmission = (withTimer, e) => {
    if (e) {
      e.preventDefault()
    }

    if (withTimer) {
      startTimer()
      handleCloseModal()
    } else {
      handleCloseModal()
    }
  }

  return (
    <Container>
      <div>
        <Button className="mt-5" onClick={navigateToMain}>
          <ArrowCircleLeftIcon />
        </Button>
      </div>
      <div
        style={{ paddingLeft: '15%', paddingRight: '15%' }}
        className="text-white mt-5"
      >
        <Card className="mt-5 p-4">
          <Row>
            <Col className="col-md-2 d-flex align-items-center">
              <Image className="" src="/logo.png" style={{ width: '80%' }} />
            </Col>
            <Col className="d-flex align-items-center">
              <h2>Task: {activityTitle}</h2>
            </Col>
            <Col>
              {displayTimer !== '' && (
                <div className="text-center mt-3">
                  <h4>Timer: {displayTimer}</h4>
                </div>
              )}
            </Col>
          </Row>
          {activities && activities.length > 0 && (
            <div className="mt-4">
              {activities.map((question, index) => (
                <div key={index}>
                  <p>Question {index + 1}</p>
                  <h5 className="mb-3">
                    {index + 1}. {question.question}
                  </h5>
                  <h5>{question.questionType}</h5>
                  {question.questionType === 'MultipleChoice' && (
                    <Form className="mb-4">
                      {question.choices &&
                        Object.entries(question.choices).map(
                          ([key, choice]) => (
                            <Card
                              className="mb-3 title-header d-flex justify-content-center"
                              style={{ height: '40px' }}
                            >
                              <Form.Check
                                className="ms-2"
                                key={key}
                                type="radio"
                                id={`${key}-${index}`}
                                label={choice}
                                checked={selectedOptions[index] === key}
                                onChange={() => handleOptionChange(index, key)}
                              />
                            </Card>
                          )
                        )}
                    </Form>
                  )}
                  {question.questionType === 'Identification' && (
                    <Form className="mb-4">
                      <Form.Control
                        type="text"
                        placeholder="Your Answer"
                        value={selectedOptions[index] || ''}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                      />
                    </Form>
                  )}
                </div>
              ))}
              {isLoading ? (
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Submitting...
                </Button>
              ) : (
                <Button className="mt-5" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
      {/* Modal for timer input */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Timer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="timerInput">
            <Form.Label>Enter Timer Duration (in minutes)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter timer duration in minutes"
              value={timerInput}
              onChange={(e) => setTimerInput(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleSubmission(false)}>
            Proceed without Timer
          </Button>
          <Button variant="primary" onClick={() => handleSubmission(true)}>
            Proceed with Timer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default PracticeQuestion
