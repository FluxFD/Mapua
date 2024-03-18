import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Form,
  Button,
  Spinner,
  Card,
  Image,
  Row,
  Col,
} from 'react-bootstrap'
import { ref, get, push, set } from 'firebase/database'
import { database } from '../services/Firebase'
import useAuth from '../services/Auth'

const TaskDetailsPage = () => {
  const { taskId, taskName } = useParams()
  const [selectedOptions, setSelectedOptions] = useState({})
  const [questionData, setQuestionData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestionData = async () => {
      const questionRef = ref(database, `Tasks/${taskId}/Activities`)
      try {
        const snapshot = await get(questionRef)
        const data = snapshot.val()
        setQuestionData(data)
      } catch (error) {
        console.error('Error fetching question data:', error)
      }
    }

    fetchQuestionData()
  }, [taskId])

  const handleOptionChange = (questionId, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: value,
    }))
  }

  const handleSubmit = (e) => {
    e?.preventDefault();
    setIsLoading(true);
  
    const scores = [];
  
    setTimeout(() => {
      let correctAnswers = 0;
      Object.entries(questionData).forEach(([questionId, question]) => {
        const userAnswer = selectedOptions[questionId];
        let correctAnswersArray;
  
        if (question.QuestionType === 'Enumeration') {
          correctAnswersArray = question.Answer.map((answer) => answer.trim());
          const userAnswerArray = Object.values(userAnswer || {}).map((value) => value.trim());
  
          console.log('User Answer Array:', userAnswerArray);
  
          const isCorrect =
            userAnswerArray.length > 0 &&
            correctAnswersArray.every((correctAnswer) => userAnswerArray.includes(correctAnswer));
          
          if (isCorrect) {
            correctAnswers++;
          }
  
          scores.push({
            question: question.Question,
            userAnswer: userAnswerArray.join(', '),
            correctAnswer: correctAnswersArray.join(', '),
            isCorrect: isCorrect,
          });
        } else {
          correctAnswersArray = [question.Answer.trim()];
  
          const isCorrect =
            userAnswer !== undefined && correctAnswersArray.includes(userAnswer);
  
          if (isCorrect) {
            correctAnswers++;
          }
  
          scores.push({
            question: question.Question,
            userAnswer: userAnswer || '',
            correctAnswer: correctAnswersArray.join(', '),
            isCorrect: isCorrect,
          });
        }
      });
  
      console.log('Scores:', scores); // Log scores array
  
      const score = (correctAnswers / Object.keys(questionData).length) * 100;
  
      const studentRef = ref(database, `students/${currentUser.uid}`);
      get(studentRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const studentName = snapshot.val().name;
  
            const scoreRef = ref(database, `Score`);
            const newScoreRef = push(scoreRef);
            set(newScoreRef, {
              taskName: taskName,
              score: score,
              studentName: studentName,
              studentId: currentUser.uid,
              scores: scores, // Include scores array in the score data
            })
              .then(() => {
                console.log('Score saved successfully.');
                setIsLoading(false);
                navigate('/main');
              })
              .catch((error) => {
                console.error('Error saving score:', error);
              });
          } else {
            console.log('Student data not found.');
          }
        })
        .catch((error) => {
          console.error('Error fetching student data:', error);
        });
  
      setSelectedOptions({});
      setIsLoading(false);
    }, 3000); // 3 seconds delay
  };
  
  return (
    <Container>
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
              <h2>Task: {taskName}</h2>
            </Col>
          </Row>

          {questionData && Object.keys(questionData).length > 0 && (
            <div className="mt-4">
              {Object.entries(questionData).map(([questionId, question]) => (
                <div key={questionId}>
                  <p>Question {questionId}</p>
                  {question.QuestionType === 'Multiplechoice' && (
                    <>
                      <h5 className="mb-3">{question.Question}</h5>
                      <Form className="mb-4">
                        {question.Choices &&
                          Object.entries(question.Choices).map(
                            ([key, choice]) => (
                              <Card
                                className="mb-3 title-header d-flex justify-content-center"
                                style={{ height: '40px' }}
                                key={key}
                              >
                                <Form.Check
                                  className="ms-2"
                                  type="radio"
                                  id={`${key}-${questionId}`}
                                  label={choice}
                                  checked={selectedOptions[questionId] === key}
                                  onChange={() =>
                                    handleOptionChange(questionId, key)
                                  }
                                />
                              </Card>
                            )
                          )}
                      </Form>
                    </>
                  )}
                  {question.QuestionType === 'Identification' && (
                    <>
                      <h5 className="mb-3">{question.Question}</h5>
                      <Form.Control
                        type="text"
                        placeholder="Your answer"
                        value={selectedOptions[questionId] || ''}
                        onChange={(e) =>
                          handleOptionChange(questionId, e.target.value)
                        }
                        className="mb-4"
                      />
                    </>
                  )}
                  {question.QuestionType === 'Enumeration' && (
                    <>
                      <h5 className="mb-3">{question.Question}</h5>
                      {question.Answer &&
                        question.Answer.map((answer, answerIndex) => (
                          <Form.Control
                            key={answerIndex}
                            type="text"
                            placeholder={`Answer ${answerIndex + 1}`}
                            value={
                              selectedOptions[questionId]?.[answerIndex] || ''
                            }
                            onChange={(e) =>
                              handleOptionChange(questionId, {
                                ...selectedOptions[questionId],
                                [answerIndex]: e.target.value,
                              })
                            }
                            className="mb-4"
                          />
                        ))}
                    </>
                  )}
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

export default TaskDetailsPage
