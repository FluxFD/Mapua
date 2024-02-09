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
    if (currentUser) {
      const studentRef = ref(database, 'students/' + currentUser.uid);

      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();
        setStudentData(studentData);
      });

      const coursesRef = ref(database, 'Course');

      onValue(coursesRef, (snapshot) => {
        const coursesData = snapshot.val();
        if (coursesData) {
          const coursesArray = Object.keys(coursesData).map((key) => ({
            id: key,
            ...coursesData[key],
          }));
          setCourses(coursesArray);
        }
      });

      return () => {
        onValue(studentRef, null);
        onValue(coursesRef, null);
      };
    }
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
              <div style={{ cursor: 'pointer' }} key={course.id} onClick={() => handleCardClick(course.id)}>
                <Card border="warning" className="mt-4 p-3 title-header">
                  <h5 className="ms-4 mb-1">{course.id}</h5>
                  <p className="ms-4 mb-1">Due Activity: {course.Name}</p>
                  <p className="ms-4 mb-1">Due Date: {course.DueDate}</p>
                </Card>
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
