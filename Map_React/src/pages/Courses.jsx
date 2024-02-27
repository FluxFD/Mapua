import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Row, Modal } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';
import CourseModal from './CourseModal'; // Make sure to adjust the path if needed


function Courses() {
  const [courses, setCourses] = useState([]);
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


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
        setCourses([]);
        return;
      }
      const coursesRef = ref(database, 'Course');
      onValue(coursesRef, (snapshot) => {
        const coursesData = snapshot.val();
        if (coursesData) {
          const coursesArray = Object.keys(coursesData).map((courseId) => {
            return {
              id: courseId,
              ...coursesData[courseId]
            };
          });
          console.log(coursesArray,"array")
          setCourses(coursesArray);
        } else {
          setCourses([]);
        }
      });
    };

    fetchStudentData(); // Assuming fetchStudentData is defined elsewhere
    fetchCourses();

    return () => {
    };
  }, [currentUser]);

  return (
    <Container fluid style={{ paddingLeft: '18%', paddingRight: '5%' }}>
      <h1 className="text-white mt-5">Courses</h1>
      <div className="mt-5">
        {currentUser && courses.map((course) => (
          <Row key={course.id} className="mb-4">
            <Col md={12}>
              <Card style={{cursor:"pointer"}} className='title-header' onClick={() => handleCardClick(course)}>
                <Card.Body>
                  <h4>{course.id}</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
        {!currentUser && <p>Please log in to view courses</p>}
      </div>
      {selectedCourse && (
        <CourseModal
          show={showModal}
          handleClose={handleCloseModal}
          course={selectedCourse}
        />
      )}
    </Container>
  );
}

export default Courses;
