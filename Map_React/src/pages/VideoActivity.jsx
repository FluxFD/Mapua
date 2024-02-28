import React, { useRef, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Button, Modal, Form, Card } from 'react-bootstrap'
import { database } from '../services/Firebase'
import useAuth from '../services/Auth'
import {
  get,
  ref,
  child,
  getDatabase,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database'
import video1 from '../assets/video1.mp4'
import video2 from '../assets/video2.mp4'

const VideoActivity = () => {
  const { currentUser } = useAuth()
  const { title } = useParams()
  const videoRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videoSrc, setVideoSrc] = useState('')
  const [activities, setActivities] = useState([])
  const [videoDataId, setVideoDataId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [shakeKey, setShakeKey] = useState(null)

  const videoMap = {
    video1: video1,
    video2: video2,
  }

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const db = getDatabase() // Initialize the database
        const snapshot = await get(child(ref(db), 'VideoActivity'))
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val()
            if (data.title === title) {
              const videoName = data.video
              if (videoMap.hasOwnProperty(videoName)) {
                setVideoSrc(videoMap[videoName])
                setVideoDataId(childSnapshot.key)
              } else {
                console.error(`Video ${videoName} is not supported`)
              }
            }
          })
        }
      } catch (error) {
        console.error('Error fetching video:', error)
      }
    }

    fetchVideo()
  }, [title])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!videoDataId) return // Skip if videoDataId is not set yet
        const db = getDatabase()
        const activityRef = ref(db, `VideoActivity/${videoDataId}/activities`)
        const snapshot = await get(activityRef)
        if (snapshot.exists()) {
          const activitiesData = []
          snapshot.forEach((childSnapshot) => {
            activitiesData.push(childSnapshot.val())
            console.log(activitiesData)
          })
          setActivities(activitiesData)

          // Check if any activity matches the current time
          activitiesData.forEach((activity) => {
            const activityTimeInSeconds = convertTimeToSeconds(activity.time) // Convert activity time to seconds
            const currentTimeInSeconds = Math.floor(currentTime) // Convert current time to seconds
            if (activityTimeInSeconds === currentTimeInSeconds) {
              // Show modal when the current time matches the activity's time

              if (videoRef.current) {
                videoRef.current.pause()
              }
              setShowModal(true)
            }
          })
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [videoDataId, currentTime]) // Include currentTime in dependencies

  // Function to convert time in 'mm:ss' format to seconds
  const convertTimeToSeconds = (time) => {
    const [minutes, seconds] = time.split(':')
    return parseInt(minutes) * 60 + parseInt(seconds)
  }

  useEffect(() => {
    const video = videoRef.current

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleLoadedMetaData = () => {
      setDuration(video.duration)
    }

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetaData)

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetaData)
      }
    }
  }, [videoSrc])

  const handleCloseModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    // Function to handle video playback when modal closes
    const handleModalClose = () => {
      // Check if the video element exists and if the modal is closed
      if (videoRef.current && !showModal) {
        // Fast forward video by 1 second
        videoRef.current.currentTime += 1
        // Resume video playback
        videoRef.current.play()
      }
    }

    // Call the handleModalClose function when showModal state changes
    handleModalClose()

    // Check if the video has finished playing
    const handleVideoEnd = () => {
      // Navigate to /main when video finishes
      window.location.href = '/main'
    }

    // Add event listener for video end
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnd)
    }

    // Cleanup the event listener
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [showModal])

  // Listen for changes in showModal state

  return (
    <Container>
      <div className="mt-5">
        {videoSrc && (
          <>
            <video ref={videoRef} controls>
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Button variant="success" onClick={playVideo}>
              Play Video
            </Button>
            <div className="text-white">
              Current Time: {currentTime.toFixed(2)}s / Duration:{' '}
              {duration.toFixed(2)}s
            </div>
          </>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Activity Time Reached</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {activities.map((activity) => {
            const activityTimeInSeconds = convertTimeToSeconds(activity.time)
            const currentTimeInSeconds = Math.floor(currentTime)
            if (activityTimeInSeconds === currentTimeInSeconds) {
              const handleChoiceClick = (selectedChoice) => {
                setSelectedChoice(selectedChoice)
                if (selectedChoice === activity.answer) {
                  // If the selected choice matches the correct answer
                  // Display the correct icon and close the modal
                  setShowModal(false)
                  // Additional logic if needed
                } else {
                  // If the selected choice is wrong
                  // Display the wrong icon
                  // Additional logic if needed
                  setShakeKey(Date.now()) // Update the key to trigger re-rendering
                }
              }

              return (
                <div key={activity.id}>
                  <h4>{activity.question}</h4>
                  {Object.keys(activity.choices).map((key) => (
                    <Card
                      key={`${activity.id}-${key}-${shakeKey}`} // Update the key
                      className={
                        selectedChoice !== activity.answer &&
                        selectedChoice === key
                          ? 'shake'
                          : ''
                      }
                      style={{ cursor: 'pointer', marginBottom: '10px' }}
                      onClick={() => handleChoiceClick(key)}
                    >
                      <Card.Body>
                        <Card.Text>{activity.choices[key]}</Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )
            }
            return null
          })}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default VideoActivity
