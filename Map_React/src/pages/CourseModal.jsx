import React, { useEffect, useState, useRef } from 'react'
import { Modal, Button, Tab, Tabs, Card, Table } from 'react-bootstrap'
import ScoreOffcanvas from '../components/ScoreOffCanvas'
import ActivityOptionsOffcanvas from '../components/ActivityOptionOffCanvas'
import { database } from '../services/Firebase'
import { ref, onValue } from 'firebase/database'
import useAuth from '../services/Auth'
import ListAltIcon from '@mui/icons-material/ListAlt'
import CampaignIcon from '@mui/icons-material/Campaign'
import ArticleIcon from '@mui/icons-material/Article'
import GradingIcon from '@mui/icons-material/Grading'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import { useNavigate } from 'react-router-dom'
import SlideshowIcon from '@mui/icons-material/Slideshow'

function CourseModal({ course, show, handleClose }) {
  const navigate = useNavigate()
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
  const [videoActivities, setVideoActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)

  useEffect(() => {
    if (!currentUser) return

    const scoresRef = ref(database, 'Score')
    onValue(scoresRef, (snapshot) => {
      const scoresData = snapshot.val() || {}
      setUserScores(scoresData)
      console.log(scoresData)
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

    const videoActivityRef = ref(database, 'VideoActivity')
    onValue(videoActivityRef, (snapshot) => {
      // Log the raw data received from Firebase
      console.log('Raw Video Activity Data:', snapshot.val())

      const videoActivityData = snapshot.val() || {}
      const videoActivityArray = []

      Object.entries(videoActivityData).forEach(([videoId, videoActivity]) => {
        if (videoActivity.Course === course.id) {
          videoActivityArray.push({ id: videoId, ...videoActivity })
        }
      })

      setVideoActivities(videoActivityArray)
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
    navigate(`/preview/${encodeURIComponent(fileUrl)}`)
  }

  const handleVideoClick = (videoActivity) => {
    navigate(`/video/${videoActivity.title}`)
  }

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity)
    handleClose()
  }

  function modifyDateString(dateString) {
    const dateObj = new Date(dateString)
    dateObj.setUTCHours(dateObj.getUTCHours() + 8) // Adjust to UTC+8 timezone
    const isoDate = dateObj.toISOString().split('T')[0] // Extract YYYY-MM-DD
    return isoDate
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
                {/* Displaying VideoAct */}
                {videoActivities.map((videoActivity) => (
                  <Card
                    style={{ cursor: 'pointer' }}
                    key={videoActivity.id}
                    className="title-header mt-3"
                    onClick={() => handleVideoClick(videoActivity)}
                  >
                    <Card.Body>
                      <SlideshowIcon />
                      {videoActivity.title} - Date: {videoActivity.date}
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
              <Tab eventKey="calendar" title="Calendar">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView={'dayGridWeek'}
                  headerToolbar={{
                    left: 'title',
                    right: 'prev,next',
                  }}
                  height="69vh"
                  events={tasks.map((task) => ({
                    title: task.taskName,
                    date: modifyDateString(task.dueDate),
                  }))}
                />
              </Tab>
              <Tab eventKey="gradebook" title="Gradebook">
                <div style={{ height: '69vh', overflowY: 'auto' }}>
                  <Table className="table" size="md">
                    <thead>
                      <tr>
                        <th>Task Name</th>
                        <th>Due Date</th>
                        {/* <th>Status</th> */}
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks &&
                        Object.values(tasks).map((task) => {
                          // Find the corresponding score based on taskName
                          const score = Object.values(userScores).find(
                            (score) => score.taskName === task.taskName
                          )
                          return (
                            <tr key={task.taskName}>
                              <td>{task.taskName}</td>
                              {/* Display the due date from the task object */}
                              <td>{task ? task.dueDate : '-'}</td>
                              {/* <td>{score.status}</td> */}
                              <td>{score ? score.score : '-'}</td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </Table>
                </div>
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
