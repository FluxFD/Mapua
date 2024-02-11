import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { database } from '../services/Firebase';
import { ref, get } from 'firebase/database'; // Import `get` to fetch data once
import useAuth from '../services/Auth';

function Courses() {
  const [courses, setCourses] = useState([]); // State to hold courses data

  useEffect(() => {
    // Define a reference to the "Courses" collection
    const coursesRef = ref(database, 'Course');

    // Fetch the data once from the "Courses" collection
    get(coursesRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Convert the snapshot to an array of courses
          const coursesData = [];
          snapshot.forEach((childSnapshot) => {
            coursesData.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
          // Update the state with the fetched courses
          setCourses(coursesData);
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <Container className='mt-5' fluid style={{ paddingLeft: '18%', paddingRight: '5%' }}>
      <h1>Courses</h1>
      <div className="mt-5">
        {courses.map((course) => (
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
      </div>
    </Container>
  );
}

export default Courses;
