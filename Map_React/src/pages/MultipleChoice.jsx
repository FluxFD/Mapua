import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { database } from '../services/Firebase'
import { ref, get, child, push, set } from 'firebase/database'
import {
  Container,
  Form,
  Button,
  Spinner,
  Card,
  Row,
  Col,
  Image,
} from 'react-bootstrap'
import useAuth from '../services/Auth'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'

function MultipleChoice() {
  const { taskId } = useParams()
  const [selectedOptions, setSelectedOptions] = useState([])
  const [activities, setActivities] = useState([])
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activityTitle, setActivityTitle] = useState('')

  const handleOptionChange = (questionId, optionValue) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: optionValue,
    }))
  }

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activityRef = ref(database, `Tasks/${taskId}`)
        const activitySnapshot = await get(activityRef)

        if (activitySnapshot.exists()) {
          const activityData = activitySnapshot.val()
          const title = activityData.title
          setActivityTitle(title)

          const questionsSnapshot = await get(child(activityRef, 'Activities'))

          if (questionsSnapshot.exists()) {
            const questions = []
            questionsSnapshot.forEach((childSnapshot) => {
              const question = childSnapshot.val()
              if (question.QuestionType === 'Multiplechoice') {
                questions.push(question)
              }
            })
            setActivities(questions)
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [taskId])

  const handleSubmit = (e) => {
    e?.preventDefault()
    setIsLoading(true)
    console.log('Selected Options:', selectedOptions)
    const scores = []

    setTimeout(() => {
      let correctAnswers = 0
      activities.forEach((question) => {
        const userAnswer = selectedOptions[question.id]
        let correctAnswersArray

        if (question.QuestionType === 'Enumeration') {
          correctAnswersArray = question.Answer.map((answer) => answer.trim())
          const userAnswerArray = Object.values(userAnswer || {}).map((value) =>
            value.trim()
          )

          const isCorrect =
            userAnswerArray.length > 0 &&
            correctAnswersArray.every((correctAnswer) =>
              userAnswerArray.includes(correctAnswer)
            )

          if (isCorrect) {
            correctAnswers++
          }

          scores.push({
            question: question.Question,
            userAnswer: userAnswerArray.join(', '),
            correctAnswer: correctAnswersArray.join(', '),
            isCorrect: isCorrect,
          })
        } else {
          correctAnswersArray = [question.Answer.trim()]

          const isCorrect =
            userAnswer !== undefined && correctAnswersArray.includes(userAnswer)

          if (isCorrect) {
            correctAnswers++
          }

          scores.push({
            question: question.Question,
            userAnswer: userAnswer || '',
            correctAnswer: correctAnswersArray.join(', '),
            isCorrect: isCorrect,
          })
        }
      })

      console.log('Scores:', scores) // Log scores array

      const score = (correctAnswers / activities.length) * 100

      const studentRef = ref(database, `students/${currentUser.uid}`)
      get(studentRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const studentName = snapshot.val().name

            const scoreRef = ref(database, `Score`)
            const newScoreRef = push(scoreRef)
            set(newScoreRef, {
              taskName: taskId,
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

      setSelectedOptions({})
      setIsLoading(false)
    }, 3000)
  }

  const navigateToMain = () => {
    navigate('/main')
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
              <Image
                className=""
                src="/logo.png"
                style={{ width: '80%' }}
                alt="Logo"
              />
            </Col>
            <Col className="d-flex align-items-center">
              <h2>Task: {taskId}</h2>
            </Col>
          </Row>
          {activities && activities.length > 0 && (
            <div className="mt-4">
              {activities.map((question, index) => (
                <div key={index}>
                  <p>Question {index + 1}</p>
                  <h5 className="mb-3">
                    {index + 1}. {question.Question}
                  </h5>
                  <Form className="mb-4">
                    {question.Choices &&
                      Object.entries(question.Choices).map(([key, choice]) => (
                        <Card
                          className="mb-3 title-header d-flex justify-content-center"
                          style={{ height: '40px' }}
                          key={key}
                        >
                          <Form.Check
                            className="ms-2"
                            type="radio"
                            id={`${question.id}-${key}`}
                            name={`question-${question.id}`}
                            label={choice}
                            value={key}
                            checked={selectedOptions[question.id] === key}
                            onChange={() =>
                              handleOptionChange(question.id, key)
                            }
                          />
                        </Card>
                      ))}
                  </Form>
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
    </Container>
  )
}

export default MultipleChoice
