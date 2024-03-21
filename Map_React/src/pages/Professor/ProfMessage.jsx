import React, { useEffect, useState } from 'react'
import { database } from '../../services/Firebase'
import { ref, onValue, push } from 'firebase/database'
import useAuth from '../../services/Auth'
import { Container, Card, Row, Col, Button, Image, Form } from 'react-bootstrap'
import Typography from '@mui/material/Typography'

function Message() {
  const [courses, setCourses] = useState([])
  const { currentUser } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [studentsWithMessages, setStudentsWithMessages] = useState([])
  const [courseMessagesToggle, setCourseMessagesToggle] = useState(false)

  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const date = String(dateObj.getDate()).padStart(2, "0");
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const meridian = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${year}-${month}-${date} ${hours}:${minutes} ${meridian}`;
  };

  useEffect(() => {
    const studentsRef = ref(database, 'students')
    onValue(studentsRef, (snapshot) => {
      const studentsData = snapshot.val()
      if (!studentsData) return

      const studentsWithMessagesArray = []

      for (const studentId in studentsData) {
        const student = studentsData[studentId]
        const hasMessages = student && student.Message

        if (hasMessages) {
          const studentWithMessages = {
            id: studentId,
            name: student.name,
            email: student.email,
            messages: Object.values(student.Message),
          }
          studentsWithMessagesArray.push(studentWithMessages)
        }
      }

      setStudentsWithMessages(studentsWithMessagesArray)
    })

    const coursesRef = ref(database, 'Course')
    onValue(coursesRef, (snapshot) => {
      const coursesData = snapshot.val()
      if (coursesData) {
        const coursesArray = Object.keys(coursesData)
          .map((courseId) => ({
            id: courseId,
            createdBy: coursesData[courseId].createdBy,
          }))
          .filter((course) => course.createdBy === currentUser?.email)
        setCourses(coursesArray)
      }
    })
  }, [currentUser])

  const handleCourseClick = (course) => {
    setSelectedCourse(course)
    setSelectedStudent(null)
    setCourseMessagesToggle((prevState) => !prevState)
  }

  const handleStudentClick = (student) => {
    setSelectedStudent(student)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser || !selectedStudent) return

    const currentDate = new Date().toISOString()

    const messageObject = {
      name: currentUser.email,
      date: currentDate,
      message: e.target.elements.formMessage.value,
      Course: selectedCourse.id,
    }

    try {
      await push(
        ref(database, `students/${selectedStudent.id}/Message`),
        messageObject
      )
      e.target.elements.formMessage.value = ''

      const updatedStudentRef = ref(database, `students/${selectedStudent.id}`)
      onValue(updatedStudentRef, (snapshot) => {
        const updatedStudentData = snapshot.val()
        if (updatedStudentData) {
          const updatedStudentWithMessages = {
            id: selectedStudent.id,
            name: updatedStudentData.name,
            email: updatedStudentData.email,
            messages: Object.values(updatedStudentData.Message || {}),
          }
          setSelectedStudent(updatedStudentWithMessages)
        }
      })
    } catch (error) {
      console.error('Error saving message:', error.message)
    }
  }

  return (
    <Container
      fluid
      style={{ paddingLeft: '18%', paddingRight: '5%', height: '90vh' }}
    >
      <Card className="mt-5" style={{ padding: '20px' }}>
        <Row>
          <Col sm={4}>
            <Card
              className="mt-3"
              style={{ height: '80vh', overflowX: 'auto' }}
            >
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
                            onClick={() => handleCourseClick(course)}
                          >
                            <Card.Body>
                              <h5>{course.id}</h5>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    ))}
                  {!currentUser && <p>Please log in to view courses</p>}
                </div>
                <div className="mt-1">
                  {courseMessagesToggle &&
                    studentsWithMessages
                      .filter((student) =>
                        student.messages.some(
                          (message) =>
                            message.Course === (selectedCourse?.id || '')
                        )
                      )
                      .map((student) => (
                        <Row key={student.id} className="mb-4">
                          <Col md={12}>
                            <Card
                              style={{ cursor: 'pointer' }}
                              className="ms-3"
                              onClick={() => handleStudentClick(student)}
                            >
                              <Card.Body>
                                <h5>{student.name}</h5>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card
              className="mt-3"
              style={{ height: '80vh', overflowX: 'auto' }}
            >
              <Card.Body>
                {selectedStudent && (
                  <div style={{ padding: '20px' }}>
                    {selectedStudent.messages
                      .filter((message) => message.Course === selectedCourse.id)
                      .map((message, index) => (
                        <Row className="mb-3" key={index}>
                          <Col sm={1}>
                            <Image
                              src="/profile.png"
                              roundedCircle
                              style={{ width: '100%' }}
                            />
                          </Col>
                          <Col className="d-flex flex-column" md={9}>
                            <Typography variant="button" display="block">
                              {message.name}
                            </Typography>
                            <Typography variant="overline" display="block">
                            {formatDate(message.date)}
                            </Typography>
                            <Typography className="ms-4 mt-3" variant="body2">
                             - {message.message}
                            </Typography>
                          </Col>
                          <hr className="mt-3" />
                        </Row>
                      ))}
                    <Form className="mt-4" onSubmit={handleSubmit}>
                      <Form.Group controlId="formMessage">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter your message"
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end mt-3">
                        <Button variant="primary" type="submit">
                          Send Message
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}

export default Message
