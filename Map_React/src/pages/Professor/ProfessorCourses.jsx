import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import "../../index.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import ProfessorOffcanvas from "./ProfessorCanvas";

// Firebase
import { database } from "../../services/Firebase";
import { auth } from "../../services/Firebase";
import { ref, onValue, off, set, update, push } from "firebase/database";

// Icons
import AddIcon from "@mui/icons-material/Add";

function ProfessorCourse() {
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModalContent, setShowModalContent] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const coursesRef = ref(database, "Course");
    onValue(coursesRef, (snapshot) => {
      const coursesData = snapshot.val();
      if (coursesData) {
        const coursesList = Object.keys(coursesData).map((key) => ({
          uid: key,
          createdBy: coursesData[key].createdBy,
        }));
        setCourses(coursesList);
      } else {
        setCourses([]);
      }
    });

    return () => {
      off(coursesRef);
    };
  }, []);

  const handleAddCourse = () => {
    const user = auth.currentUser;
    if (user) {
      const courseData = {
        createdBy: user.email,
      };
      update(ref(database, `Course/${courseName}`), courseData);
      setShowModal(false);
    }
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setShowModalContent(true);
  };

  return (
    <Container fluid style={{ paddingLeft: "18%", paddingRight: "5%" }}>
      <Row className="mt-5 d-flex justify-content-evenly align-items-center ">
        <Row className="d-flex align-items-center mb-3">
          <Col sm={10}>
            <div>
              <Breadcrumbs aria-label="breadcrumb" style={{ color: "white" }}>
                <Typography underline="hover" color="white">
                  Dashboard
                </Typography>
                <Typography underline="hover" color="white">
                  Course
                </Typography>
              </Breadcrumbs>
            </div>
          </Col>
          <Col>
            <div className="me-">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <AddIcon /> Add Courses
              </Button>
            </div>
          </Col>
        </Row>

        {courses.map((course) => (
          <div key={course.uid} onClick={() => handleCardClick(course)}>
            <Card
              className="title-header  p-3 mt-2"
              style={{ cursor: "pointer" }}
            >
              <div>
                <b>{course.uid}</b>
                <p>{course.createdBy}</p>
              </div>
            </Card>
          </div>
        ))}
      </Row>

      {selectedCourse && (
        <ProfessorOffcanvas
          show={showModalContent}
          onHide={() => setShowModalContent(false)}
          selectedCourse={selectedCourse}
        />
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="courseName">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleAddCourse}>
            Create Course
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProfessorCourse;
