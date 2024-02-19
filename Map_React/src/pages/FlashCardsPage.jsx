import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { database } from '../services/Firebase'
import { ref, get, child } from 'firebase/database'
import Flashcard from '../components/FlashCard'

function FlashcardPage() {
  const { activityId } = useParams()
  const [activities, setActivities] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const snapshot = await get(
          child(ref(database), `ReviewerActivity/${activityId}/activities`)
        )
        if (snapshot.exists()) {
          setActivities(Object.values(snapshot.val()))
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    }

    fetchActivities()
  }, [activityId])

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % activities.length)
    setShowAnswer(false)
  }

  const handlePrev = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + activities.length) % activities.length
    )
    setShowAnswer(false)
  }

  const handleFlip = () => {
    setShowAnswer((prevState) => !prevState)
  }

  return (
    <div>
      {activities.length > 0 && (
        <Flashcard
          question={activities[currentCardIndex].question}
          answer={activities[currentCardIndex].answer}
          onFlip={handleFlip}
          showAnswer={showAnswer}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  )
}

export default FlashcardPage
