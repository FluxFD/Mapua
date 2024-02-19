import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Modal,
  Button,
  Form,
  Dropdown,
} from "react-bootstrap";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

// Firebase
import { database } from "../../services/Firebase";
import { auth } from "../../services/Firebase";
import { ref, onValue, off, set, update } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function ModeratorDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const studentNoRef = useRef(null);
  const roleRef = useRef(null);
  const [sortBy, setSortBy] = useState("");
  const [sortLabel, setSortLabel] = useState("Sort by");

  useEffect(() => {
    const studentsRef = ref(database, "students");

    onValue(studentsRef, (snapshot) => {
      const studentsData = snapshot.val();
      if (studentsData) {
        const studentsArray = Object.values(studentsData);
        setStudents(studentsArray);
      }
    });

    return () => {
      off(studentsRef);
    };
  }, []);

  const handleCreateUser = () => {
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const studentNo = studentNoRef.current.value;
    const role = roleRef.current.checked ? "Professor" : "Student";

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        const newUser = {
          name: name,
          email: email,
          studentNo: studentNo,
          role: role,
        };

        const studentsRef = ref(database, "students/" + uid);
        set(studentsRef, newUser)
          .then(() => {
            toast.success("User added successfully");
            setShowModal(false);
          })
          .catch((error) => {
            console.error("Error adding user data: ", error);
            toast.error("Error adding user data. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Error creating user: ", error);
        toast.error("Error creating user. Please try again.");
      });
  };

  const sortStudents = (property, label) => {
    const sortedStudents = [...students].sort((a, b) => {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    });
    // Toggle sorting order
    setStudents(sortedStudents);
    setSortBy(property);
    setSortLabel(label);
  };

  return (
    <Container fluid style={{ paddingLeft: "18%", paddingRight: "5%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Users Profile</b>
              </h3>
              <p className="text-muted">
                Student and Professor credentials are listed below.
              </p>
            </div>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <AddIcon className="" /> Add User
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="mt-4 ms-5 p-3 title-header">
        <Dropdown className="d-flex align-items-center mb-2 mt-2">
          Filter by:
          <Dropdown.Toggle
            className="ms-2"
            variant="outline-secondary"
            id="dropdown-basic"
            size="sm"
          >
            {sortLabel}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => sortStudents("name", "Name")}>
              Name
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => sortStudents("studentNo", "Student Number")}
            >
              Student Number
            </Dropdown.Item>
            <Dropdown.Item onClick={() => sortStudents("role", "Role")}>
              Role
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {students.map((student) => (
          <Card className="mt-2  p-3">
            <Row>
              <Col sm={11}>
                <div
                  className="mt-3"
                  key={student.studentNo}
                  style={{
                    display: "flex",
                  }}
                >
                  <AccountCircleIcon
                    style={{ marginRight: "10px", fontSize: "56px" }}
                  />

                  <div>
                    <h5>{student.name}</h5>
                    <p>Student Number: {student.studentNo}</p>
                    <p className="text-muted">{student.role}</p>
                  </div>
                </div>
              </Col>
              <Col className="d-flex align-items-center">
                <Tooltip title="Edit" arrow>
                  <EditIcon className="me-2" color="primary" />
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <DeleteIcon color="error" />
                </Tooltip>
              </Col>
            </Row>
          </Card>
        ))}
      </Card>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" ref={nameRef} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="studentNo">
              <Form.Label>Student Number</Form.Label>
              <Form.Control type="number" ref={studentNoRef} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Select Role</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  label="Student"
                  name="role"
                  id="student"
                  defaultChecked
                  ref={roleRef}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Professor"
                  name="role"
                  id="professor"
                  ref={roleRef}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="outline-primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ModeratorDashboard;
