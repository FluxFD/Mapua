import React, { useEffect, useState, useRef } from 'react'
import {
  Modal,
  Button,
  Tab,
  Tabs,
  Card,
  Table,
  Offcanvas,
} from 'react-bootstrap'
import ScoreOffcanvas from '../components/ScoreOffCanvas'
import ActivityOptionsOffcanvas from '../components/ActivityOptionOffCanvas'
import { database } from '../services/Firebase'
import { ref, onValue } from 'firebase/database'
import useAuth from '../services/Auth'
import CampaignIcon from '@mui/icons-material/Campaign'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { useNavigate } from 'react-router-dom'

// CourseModal components
import FoldersList from '../courseModalContent/FoldersList'
import TaskList from '../courseModalContent/TaskList'
import ReviewersList from '../courseModalContent/ReviewersList'
import VideoActivitiesList from '../courseModalContent/VideoActivitiesList'

function CourseModal({ course, show, handleClose }) {
  const navigate = useNavigate()

  const { currentUser } = useAuth()
  const [tasks, setTasks] = useState([])
  const [folderedTask, setFolderedTask] = useState([])
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
  const [calendarKey, setCalendarKey] = useState(Date.now()) // Key for FullCalendar component
  const [folders, setFolders] = useState([])
  const [openFolderId, setOpenFolderId] = useState(null)

  const calendarRef = useRef(null)
  // const [rerenderCalendar, setRerenderCalendar] = useState(false); // State to trigger rerender of calendar

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

    const foldersRef = ref(database, `Folders/${course.id}`)
    onValue(foldersRef, (snapshot) => {
      const folderData = snapshot.val() || {}
      const folderArray = Object.entries(folderData).map(
        ([folderId, folder]) => ({
          id: folderId,
          ...folder,
        })
      )

      setFolders(folderArray)
    })

    const tasksRef = ref(database, 'Tasks')
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {}
      const tasksArray = []

      Object.entries(tasksData).forEach(([taskId, task]) => {
        if (task.Course === course.id && !task.FolderName) {
          tasksArray.push({ id: taskId, ...task })
        }
      })

      setTasks(tasksArray)
    })

    const FolderedTasksRef = ref(database, 'Tasks')
    onValue(FolderedTasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {}
      const tasksArray = []

      Object.entries(tasksData).forEach(([taskId, task]) => {
        if (task.Course === course.id && task.FolderName) {
          tasksArray.push({ id: taskId, ...task })
        }
      })

      setFolderedTask(tasksArray)
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

  const handleTabChange = (key) => {
    if (key === 'calendar') {
      setCalendarKey(Date.now()) // Update calendar key to force remount
    }
  }

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

  function modifyDateString(dateString) {
    const dateObj = new Date(dateString)
    dateObj.setUTCHours(dateObj.getUTCHours() + 8) // Adjust to UTC+8 timezone
    const isoDate = dateObj.toISOString().split('T')[0] // Extract YYYY-MM-DD
    return isoDate
  }

  const handleToggle = (folderId) => {
    setOpenFolderId(folderId === openFolderId ? null : folderId)
  }

  const handleActivityClick = (tasks, taskId, taskName) => {
    setSelectedActivity({ tasks, taskId, taskName });
    console.log('Selected Activity:', { tasks, taskId, taskName }); // Log selected activity
    handleClose();
  };

  return (
    <>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        backdrop="static"
        style={{
          width: '85%',
          borderTopLeftRadius: '20px',
          borderBottomLeftRadius: '20px',
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{course.id}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mt-1">
            <Tabs
              defaultActiveKey="home"
              id="uncontrolled-tab-example"
              className="mb-3"
              onSelect={handleTabChange} // Add event handler for tab selection
            >
              <Tab eventKey="home" title="Content">
                Course Content
                <hr />
                <FoldersList
                  folders={folders}
                  folderedTask={folderedTask}
                  handleToggle={handleToggle}
                  openFolderId={openFolderId}
                />
                <TaskList tasks={tasks} handleClick={(task, taskId, taskName) => handleActivityClick(task, taskId, taskName)} />
                <ReviewersList
                  reviewers={reviewers}
                  handleReviewerClick={handleReviewerClick}
                />
                <VideoActivitiesList
                  videoActivities={videoActivities}
                  handleVideoClick={handleVideoClick}
                />
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
                <div id="calendar" style={{ margin: '20px' }}>
                  <FullCalendar
                    key={calendarKey}
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    initialView={'dayGridWeek'}
                    height="69vh"
                    events={reviewerActivities.map((activities) => ({
                      title: activities.title,
                      date: modifyDateString(activities.date),
                    }))}
                  />
                </div>
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
                            <tr key={task.title}>
                              <td>{task.title}</td>
                              {/* Display the due date from the task object */}
                              <td>{task ? task.date : '-'}</td>
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
        </Offcanvas.Body>
      </Offcanvas>

      <ScoreOffcanvas
        show={showScore}
        handleClose={() => setShowScore(false)}
        taskName={taskName}
        scoreValue={scoreValue}
      />

<ActivityOptionsOffcanvas
  show={selectedActivity !== null}
  handleClose={() => {
    console.log('Closing Activity Options Offcanvas');
    setSelectedActivity(null);
  }}
  selectedActivity={selectedActivity}
/>
    </>
  )
}

export default CourseModal
