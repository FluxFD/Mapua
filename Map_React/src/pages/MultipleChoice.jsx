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
} from 'react-bootstrap'
import useAuth from '../services/Auth'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
function MultipleChoice() {
  const { activityId } = useParams()
  const [selectedOptions, setSelectedOptions] = useState([])
  const [activities, setActivities] = useState([])
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [activityTitle, setActivityTitle] = useState('')

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
              questions.push(childSnapshot.val())
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
    e.preventDefault()
    setIsLoading(true)

    // Simulate a delay before navigating
    setTimeout(() => {
      let correctAnswers = 0
      activities.forEach((question, index) => {
        const userAnswer = selectedOptions[index]
        if (userAnswer === question.answer) {
          correctAnswers++
        }
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
    }, 3000) // 3 seconds delay
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
              <Image className="" src="/logo.png" style={{ width: '80%' }} />
            </Col>
            <Col className="d-flex align-items-center">
              <h2>Task: {activityTitle}</h2>
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
                  <Form className="mb-4">
                    {question.choices &&
                      Object.entries(question.choices).map(([key, choice]) => (
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
