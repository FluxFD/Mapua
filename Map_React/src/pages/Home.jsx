import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';

function HomePage() {
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
      if (!currentUser) return;
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
    <Container fluid style={{ paddingLeft: '13%', paddingRight: '1%' }}>
      <Card style={{ width: '40%' }} className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={1}></Col>
          <Col sm={10}>
            <div className="ms-5">
              {studentData && (
                <>
                  <h3>
                    <b>{studentData.name}</b>
                  </h3>
                  <p className="text-muted">{studentData.studentNo}</p>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card>
      <Row className="d-flex align-items-center">
        <Col sm={8}>
        <Card
  style={{ width: '90%' }}
  className="mt-5 ms-5 p-5 title-header bg-light"
>
  <FilterAltIcon />
  {courses.map((course) => (
    <div key={course.id}>
      {course.studies.map((study) => (
        <Card style={{cursor:"pointer"}} key={study.id} border="warning" className="mt-4 p-3 title-header">
          <h5 className="ms-4 mb-1">{course.id}</h5>
          <h5 className="ms-4 mb-1">{study.id}</h5>
          <p className="ms-4 mb-1">Due Date: {study.dueDate}</p>
        </Card>
      ))}
    </div>
  ))}
</Card>

        </Col>
        <Col sm={4}>
          <Card className="mt-5 ms-5 p-5 title-header bg-light">
            Progress Report
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
