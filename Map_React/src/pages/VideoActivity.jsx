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

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const db = getDatabase();
        const snapshot = await get(child(ref(db), 'VideoActivity'));
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.title === title) {
              const videoName = data.video;
              setVideoSrc(videoName);
              setVideoDataId(childSnapshot.key);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
  
    fetchVideo();
  }, [title]);
  

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!videoDataId) return
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

          activitiesData.forEach((activity) => {
            const activityTimeInSeconds = convertTimeToSeconds(activity.time)
            const currentTimeInSeconds = Math.floor(currentTime)
            if (activityTimeInSeconds === currentTimeInSeconds) {
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
  }, [videoDataId, currentTime])
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
    const handleModalClose = () => {
      if (videoRef.current && !showModal) {
        videoRef.current.currentTime += 1
        videoRef.current.play()
      }
    }

    handleModalClose()

    const handleVideoEnd = () => {
      window.location.href = '/main'
    }

    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnd)
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [showModal])


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
                  setShowModal(false)
                } else {
                  setShakeKey(Date.now())
                }
              }

              return (
                <div key={activity.id}>
                  <h4>{activity.question}</h4>
                  {Object.keys(activity.choices).map((key) => (
                    <Card
                      key={`${activity.id}-${key}-${shakeKey}`}
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
