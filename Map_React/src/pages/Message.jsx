import React, { useEffect, useState } from 'react'
import { database } from '../services/Firebase'
import { ref, onValue, push } from 'firebase/database'
import useAuth from '../services/Auth'
import { Container, Card, Row, Col, Button, Image, Form } from 'react-bootstrap'
import Profile from './Profile'

function Message() {
  const [message, setMessage] = useState('')
  const [courses, setCourses] = useState([])
  const { currentUser } = useAuth()
  const [studentData, setStudentData] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [clickedText, setClickedText] = useState(null)
  const [courseMessages, setCourseMessages] = useState([])

  useEffect(() => {
    const fetchStudentData = () => {
      if (!currentUser) return
      const studentRef = ref(database, 'students/' + currentUser.uid)
      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val()
        setStudentData(studentData)
      })
    }

    const fetchCourses = () => {
      if (!currentUser) {
        setCourses([])
        return
      }
      const coursesRef = ref(database, 'Course')
      onValue(coursesRef, (snapshot) => {
        const coursesData = snapshot.val()
        if (coursesData) {
          const coursesArray = Object.keys(coursesData).map((courseId) => {
            const course = coursesData[courseId]
            const studies = Object.keys(course).map((studyId) => ({
              id: studyId,
              dueDate: course[studyId].dueDate,
            }))
            return {
              id: courseId,
              studies: studies,
            }
          })
          setCourses(coursesArray)
        }
      })
    }

    const fetchMessages = () => {
      if (!currentUser || !clickedText) return
      const messageRef = ref(database, 'Message')
      onValue(messageRef, (snapshot) => {
        const messagesData = snapshot.val()
        if (messagesData) {
          const courseMessages = Object.values(messagesData).filter(
            (message) => message.Course === clickedText
          )
          setCourseMessages(courseMessages)
        }
      })
    }

    fetchStudentData()
    fetchCourses()
    fetchMessages()

    return () => {}
  }, [currentUser, clickedText])

  const handleCardClick = (course) => {
    setSelectedCourse(course)
    setClickedText(course.id) // Update the text when a course card is clicked
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (currentUser && selectedCourse) {
      const messageRef = ref(database, 'Message')
      const messageData = {
        Course: selectedCourse.id,
        date: new Date().toISOString(),
        message: message,
        uid: currentUser.uid,
        name: studentData?.name,
      }
      setMessage('')
      push(messageRef, messageData)
    }
  }

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate)
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const date = String(dateObj.getDate()).padStart(2, '0')
    let hours = dateObj.getHours()
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    const meridian = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12 || 12 // Convert to 12-hour format
    return `${year}-${month}-${date} ${hours}:${minutes} ${meridian}`
  }

  return (
    <Container
      fluid
      style={{ paddingLeft: '18%', paddingRight: '5%', height: '90vh' }}
    >
      <Card className="mt-5" style={{ padding: '20px', height: '90vh' }}>
        <Row>
          <Col sm={4}>
            <Card className="mt-3" style={{ height: '80vh' }}>
              <Card.Body>
                <h1>Message</h1>
                <hr />
                <div className="mt-4">
                  {currentUser &&
                    courses.map((course) => (
                      <Row key={course.id} className="mb-4">
                        <Col md={12}>
                          <Card
                            style={{ cursor: 'pointer' }}
                            className="title-header"
                            onClick={() => handleCardClick(course)}
                          >
                            <Card.Body>
                              <h3>{course.id}</h3>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    ))}
                  {!currentUser && <p>Please log in to view courses</p>}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="mt-3" style={{ height: '80vh' }}>
              <Card.Body>
                <Card style={{ height: '60vh', overflowY: 'auto' }}>
                  <div style={{ padding: '20px' }}>
                    {courseMessages.map((message, index) => (
                      <Row key={index}>
                        <Col sm={1}>
                          <Image
                            src="/profile.png"
                            roundedCircle
                            style={{ width: '100%' }}
                          />
                        </Col>
                        <Col
                          className="d-flex flex-column"
                          md={9}
                          style={{ fontWeight: 'bold' }}
                        >
                          <p className="mb-0">{message.name}</p>
                          <p className="mb-0">{formatDate(message.date)}</p>
                        </Col>
                        <Card className="mt-3 mb-3">
                          <p>{message.message}</p>
                        </Card>
                      </Row>
                    ))}
                  </div>
                </Card>

                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group controlId="formMessage">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter your message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}

export default Message
