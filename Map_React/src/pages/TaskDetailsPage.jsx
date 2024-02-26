import React, { useState, useEffect } from 'react';
import { useParams, } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner, Card, Image, Row, Col } from 'react-bootstrap';
import { database } from '../services/Firebase';
import { ref, get, set, push } from 'firebase/database';
import useAuth from '../services/Auth';

const TaskDetailsPage = () => {
  const { taskName } = useParams();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionData = async () => {
      const questionRef = ref(database, `Quiz/${taskName}`);
      try {
        const snapshot = await get(questionRef);
        if (snapshot.exists()) {
          const questions = [];
          snapshot.forEach((childSnapshot) => {
            questions.push(childSnapshot.val());
          });
          setQuestionData(questions);
        } else {
          console.log('No data available for the specified task.');
        }
      } catch (error) {
        console.error('Error fetching question data: ', error);
      }
    };

    fetchQuestionData();
  }, [taskName]);

  const handleOptionChange = (index, option) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = option;
    setSelectedOptions(updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a delay before navigating
    setTimeout(() => {
      let correctAnswers = 0;
      questionData.forEach((question, index) => {
        const userAnswer = selectedOptions[index];
        if (userAnswer === question.answer) {
          correctAnswers++;
        }
      });
      const score = (correctAnswers / questionData.length) * 100;

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

      setSelectedOptions([]);
    }, 3000); // 3 seconds delay
  };

  return (
    <Container>
      <div style={{paddingLeft:"15%", paddingRight:"15%"}} className='text-white mt-5'>

        <Card className='mt-5 p-4'>
          <Row>
            <Col className='col-md-2 d-flex align-items-center'>
            <Image className="" src="/logo.png" style={{ width: "80%" }} />
            </Col>
            <Col className="d-flex align-items-center">
            <h2>Task: {taskName}</h2></Col>


          </Row>

        {questionData && questionData.length > 0 && (
          <div className='mt-4'>
            {questionData.map((question, index) => (
              <div key={index}>
                <p>Question {index+1}</p>
                <h5 className="mb-3" >{index + 1}. {question.question}</h5>
                <Form className="mb-4" >
                  {question.choices &&
                    Object.entries(question.choices).map(([key, choice]) => (
                      <Card className='mb-3 title-header d-flex justify-content-center' style={{height:"40px"}}>
                      <Form.Check
                      className='ms-2'
                        key={key}
                        type="radio"
                        id={`${key}-${index}`}
                        label={choice}
                        checked={selectedOptions[index] === key}
                        onChange={() => handleOptionChange(index, key)}
                      />
                      </Card>
                    ))}
                </Form>
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
  );
};

export default TaskDetailsPage;
