import React, { useEffect, useState } from 'react'
import { Modal, Button, Tab, Tabs, Card, Offcanvas } from 'react-bootstrap'
import { Link } from 'react-router-dom' // Import Link from React Router
import { database } from '../services/Firebase'
import { ref, onValue } from 'firebase/database'
import useAuth from '../services/Auth'
import ListAltIcon from '@mui/icons-material/ListAlt'

function CourseModal({ course, show, handleClose }) {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [userScores, setUserScores] = useState({})
  const [userName, setUserName] = useState('')
  const [showScore, setShowScore] = useState(false)
  const [scoreValue, setScoreValue] = useState(0)
  const [taskName, setTaskName] = useState('')

  useEffect(() => {
    if (!currentUser) return

    const scoresRef = ref(database, 'Score')
    onValue(scoresRef, (snapshot) => {
      const scoresData = snapshot.val() || {}
      setUserScores(scoresData)
    })

    const userRef = ref(database, `students/${currentUser.uid}/name`)
    onValue(userRef, (snapshot) => {
      const name = snapshot.val()
      setUserName(name)
    })

    const tasksRef = ref(database, 'Task')
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {}
      const tasksArray = []

      Object.entries(tasksData).forEach(([taskId, task]) => {
        if (task.Course === course.id) {
          tasksArray.push({ id: taskId, ...task })
        }
      })

      setTasks(tasksArray)
    })

    return () => {
      // Cleanup
    }
  }, [course.id, currentUser])

  const handleClick = (taskId, taskName) => {
    const userScoreKeys = Object.keys(userScores)
    const matchingScore = userScoreKeys.find((uid) => {
      const score = userScores[uid]
      return score.taskName === taskName && score.studentName === userName
    })

    if (matchingScore) {
      setShowScore(true)
      setScoreValue(userScores[matchingScore].score)
      setTaskName(taskName)
      handleClose()
    } else {
      window.location.href = `/task/${taskId}/${taskName}`
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{course.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-1">
            <Tabs
              defaultActiveKey="home"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title="Content">
                Course Content
                <hr />
                {tasks.map((task) => (
                  <Card
                    style={{ cursor: 'pointer' }}
                    key={task.id}
                    className="title-header mt-3"
                    onClick={() => handleClick(task.id, task.taskName)}
                  >
                    <Card.Body>
                      <ListAltIcon />
                      {task.taskName} - Due Date: {task.dueDate}
                    </Card.Body>
                  </Card>
                ))}
              </Tab>
              <Tab eventKey="profile" title="Announcement">
                Tab content for Profile
              </Tab>
              <Tab eventKey="contact" title="Calendar">
                Tab content for Contact
              </Tab>
              <Tab eventKey="gradebook" title="Gradebook">
                Tab content for Contact
              </Tab>
            </Tabs>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Offcanvas
        show={showScore}
        onHide={() => setShowScore(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{taskName}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Your score for this task is: {scoreValue}</p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default CourseModal
