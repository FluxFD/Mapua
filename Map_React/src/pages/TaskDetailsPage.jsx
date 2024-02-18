import React, { useState, useEffect } from 'react';
import { useParams, } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { database } from '../services/Firebase';
import { ref, get, set, push } from 'firebase/database';
import useAuth from '../services/Auth';

const TaskDetailsPage = () => {
  const { taskName } = useParams();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const { currentUser } = useAuth(); // Assuming useAuth() returns the authentication state, and uid is the UID of the user
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
  
    // Calculate the score
    let correctAnswers = 0;
    questionData.forEach((question, index) => {
      const userAnswer = selectedOptions[index];
      if (userAnswer === question.answer) {
        correctAnswers++;
      }
    });
    const score = (correctAnswers / questionData.length) * 100; // Assuming score is calculated as a percentage
  
    // Get the student's name from the database
    const studentRef = ref(database, `students/${currentUser.uid}`);
    get(studentRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const studentName = snapshot.val().name;
  
          // Save the score to the Score collection with a unique ID
          const scoreRef = ref(database, `Score`);
          const newScoreRef = push(scoreRef); // Generate a unique ID
          set(newScoreRef, {
            taskName: taskName,
            score: score,
            studentName: studentName,
          })
            .then(() => {
              console.log('Score saved successfully.');
              // Navigate back to /main after submission
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
  
    // Clear selected options after submission
    setSelectedOptions([]);
  };
  return (
    <Container>
      <div>
        <h2>Task: {taskName}</h2>
        {questionData && questionData.length > 0 && (
          <div>
            <h1>Multiple Choice Questions</h1>
            {questionData.map((question, index) => (
              <div key={index}>
                <h2>Question {index + 1}</h2>
                <p>{question.question}</p>
                <Form>
                  {question.choices &&
                    Object.entries(question.choices).map(([key, choice]) => (
                      <Form.Check
                        key={key}
                        type="radio"
                        id={`${key}-${index}`}
                        label={choice}
                        checked={selectedOptions[index] === key}
                        onChange={() => handleOptionChange(index, key)}
                      />
                    ))}
                </Form>
              </div>
            ))}
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default TaskDetailsPage;