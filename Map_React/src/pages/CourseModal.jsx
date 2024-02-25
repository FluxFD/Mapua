import React, { useEffect, useState } from 'react'
import { Modal, Button, Tab, Tabs, Card } from 'react-bootstrap'
import ScoreOffcanvas from '../components/ScoreOffCanvas'
import ActivityOptionsOffcanvas from '../components/ActivityOptionOffCanvas'
import { database } from '../services/Firebase'
import { ref, onValue } from 'firebase/database'
import useAuth from '../services/Auth'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CampaignIcon from '@mui/icons-material/Campaign'
import ArticleIcon from '@mui/icons-material/Article'
import GradingIcon from '@mui/icons-material/Grading'

function CourseModal({ course, show, handleClose }) {
  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [userScores, setUserScores] = useState({})
  const [userName, setUserName] = useState('')
  const [showScore, setShowScore] = useState(false)
  const [scoreValue, setScoreValue] = useState(0)
  const [taskName, setTaskName] = useState('')
  const [announcements, setAnnouncements] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [reviewerActivities, setReviewerActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)

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

    const announcementsRef = ref(database, 'Announcement')
    onValue(announcementsRef, (snapshot) => {
      const announcementsData = snapshot.val() || {}
      const announcementsArray = []

      Object.entries(announcementsData).forEach(
        ([announcementId, announcement]) => {
          if (announcement.Course === course.id) {
            announcementsArray.push({ id: announcementId, ...announcement })
          }
        }
      )

      setAnnouncements(announcementsArray)
    })

    const reviewersRef = ref(database, 'Reviewer')
    onValue(reviewersRef, (snapshot) => {
      const reviewersData = snapshot.val() || {}
      const reviewersArray = []

      Object.entries(reviewersData).forEach(([reviewerId, reviewer]) => {
        if (reviewer.Course === course.id) {
          reviewersArray.push({ id: reviewerId, ...reviewer })
        }
      })

      setReviewers(reviewersArray)
    })

    const reviewerActivityRef = ref(database, 'ReviewerActivity')
    onValue(reviewerActivityRef, (snapshot) => {
      const reviewerActivityData = snapshot.val() || {}
      const reviewerActivityArray = []

      Object.entries(reviewerActivityData).forEach(([activityId, activity]) => {
        if (activity.Course === course.id) {
          reviewerActivityArray.push({ id: activityId, ...activity })
        }
      })

      setReviewerActivities(reviewerActivityArray)
    })

    return () => {}
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

  const handleReviewerClick = (fileUrl) => {
    window.open(fileUrl, '_blank')
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    handleClose()
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
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
                {/* Displaying tasks */}
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
                {/* Displaying reviewers */}
                {reviewers.map((reviewer) => (
                  <Card
                    style={{ cursor: 'pointer' }}
                    key={reviewer.id}
                    className="title-header mt-3"
                    onClick={() => handleReviewerClick(reviewer.file)}
                  >
                    <Card.Body>
                      <ArticleIcon />
                      {reviewer.title}
                    </Card.Body>
                  </Card>
                ))}
                {/* Displaying ReviewerActivity */}
                {reviewerActivities.map((activity) => (
                  <Card
                    style={{ cursor: 'pointer' }}
                    key={activity.id}
                    className="title-header mt-3"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <Card.Body>
                      <GradingIcon />
                      {activity.title} - Date: {activity.date}
                    </Card.Body>
                  </Card>
                ))}
              </Tab>
              <Tab eventKey="announcement" title="Announcement">
                {announcements.map((announcement) => (
                  <Card
                    style={{ cursor: 'pointer' }}
                    key={announcement.id}
                    className="title-header mt-3"
                  >
                    <Card.Body>
                      <CampaignIcon />
                      {announcement.title} - Date: {announcement.date}
                    </Card.Body>
                  </Card>
                ))}
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

      <ScoreOffcanvas
        show={showScore}
        handleClose={() => setShowScore(false)}
        taskName={taskName}
        scoreValue={scoreValue}
      />

      <ActivityOptionsOffcanvas
        show={selectedActivity !== null}
        handleClose={() => setSelectedActivity(null)}
        selectedActivity={selectedActivity}
      />
    </>
  )
}

export default CourseModal
