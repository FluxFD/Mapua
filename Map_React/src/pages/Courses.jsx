import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';

function Courses() {
  const [courses, setCourses] = useState([]);
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = () => {
      if (!currentUser) return;
      const studentRef = ref(database, 'students/' + currentUser.uid);
      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();
        setStudentData(studentData);
      });
    };

    const fetchCourses = () => {
      if (!currentUser) {
        setCourses([]); // Reset courses if the user is not authenticated
        return;
      }
      const coursesRef = ref(database, 'Course');
      onValue(coursesRef, (snapshot) => {
        const coursesData = snapshot.val();
        if (coursesData) {
          const coursesArray = Object.keys(coursesData).map((courseId) => {
            const course = coursesData[courseId];
            const studies = Object.keys(course).map((studyId) => ({
              id: studyId,
              dueDate: course[studyId].dueDate
            }));
            return {
              id: courseId,
              studies: studies
            };
          });
          setCourses(coursesArray);
        }
      });
    };

    fetchStudentData();
    fetchCourses();

    return () => {
      // Cleanup code here if needed
    };
  }, [currentUser]);

  return (
    <Container fluid style={{ paddingLeft: '18%', paddingRight: '5%' }}>
      <h1>Courses</h1>
      <div className="mt-5">
        {currentUser && courses.map((course) => (
          <Row key={course.id} className="mb-4">
            <Col md={12}>
              <Card className='title-header'>
                <Card.Body>
                  <h3>{course.id}</h3>
                  {/* Render other details of the course */}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
        {!currentUser && <p>Please log in to view courses</p>}
      </div>
    </Container>
  );
}

export default Courses;
