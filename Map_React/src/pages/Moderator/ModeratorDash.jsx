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
import CircleIcon from "@mui/icons-material/Circle";
import { green } from "@mui/material/colors";

import axios from "axios";

function ModeratorDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // State to track the user being edited
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

    //FIREBASE USER CREATION
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        const newUser = {
          name: name,
          email: email,
          studentNo: studentNo,
          role: role,
          uid: uid,
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

    //MYSQL ACCOUNT CREATION

    axios
      .post("http://localhost:8800/user", {
        id: studentNo,
        name: name,
        email: email,
        password: password,
      })
      .then((response) => {
        // Handle successful response
        console.log("User created successfully:", response.data);
      })
      .catch((error) => {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(
            "Server responded with error status:",
            error.response.status
          );
          console.error("Error data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
        }
      });
  };

  const handleDeleteUser = (uid, studentNo) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    // Delete user data from Realtime Database
    const userRef = ref(database, `students/${uid}`);
    set(userRef, null)
      .then(() => {
        toast.success("User deleted successfully from database");
      })
      .catch((error) => {
        console.error("Error deleting user from database: ", error);
        toast.error("Error deleting user from database. Please try again.");
      });
    //MYSQL DELETION
    axios
      .delete("http://localhost:8800/user/" + studentNo)
      .then((response) => {
        // Handle successful response
        console.log("User deleted successfully:", response.data);
      })
      .catch((error) => {
        // Handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(
            "Server responded with error status:",
            error.response.status
          );
          console.error("Error data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received from server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up request:", error.message);
        }
      });
  };

  const handleEditUser = () => {
    const newName = nameRef.current.value;
    const newEmail = emailRef.current.value;
    const newStudentNo = studentNoRef.current.value;
    const newRole = roleRef.current.checked ? "Professor" : "Student";

    const updatedUser = {
      name: newName,
      email: newEmail,
      studentNo: newStudentNo,
      role: newRole,
    };

    // Update user data in Realtime Database
    const usersRef = ref(database, "students/" + editingUser.uid);
    update(usersRef, updatedUser)
      .then(() => {
        toast.success("User data updated successfully");
        setShowModal(false);
        setEditingUser(null);
      })
      .catch((error) => {
        console.error("Error updating user data: ", error);
        toast.error("Error updating user data. Please try again.");
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

  const openEditModal = (user) => {
    if (user.uid) {
      setEditingUser(user);
      setShowModal(true);
    } else {
      console.error("User object does not contain UID.");
    }
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
                    <h5>
                      {student.name}
                      {""}{" "}
                      {student.isActive ? (
                        <span>
                          <CircleIcon
                            size="small"
                            sx={{
                              color: green[300],
                              fontSize: 12,
                              verticalAlign: "middle",
                            }}
                          />{" "}
                          <span style={{ fontSize: "14px", color: "green" }}>
                            Active
                          </span>
                        </span>
                      ) : (
                        <span>
                          <CircleIcon
                            color="error"
                            sx={{ fontSize: 12, verticalAlign: "middle" }}
                          />{" "}
                          <span
                            className="text-muted"
                            style={{ fontSize: "14px" }}
                          >
                            Inactive
                          </span>
                        </span>
                      )}
                    </h5>

                    <p>Student Number: {student.studentNo}</p>
                    <p className="text-muted">{student.role}</p>
                  </div>
                </div>
              </Col>
              <Col className="d-flex align-items-center">
                <Tooltip title="Edit" arrow>
                  <EditIcon
                    className="me-2"
                    color="primary"
                    onClick={() => openEditModal(student)}
                  />
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <DeleteIcon
                    color="error"
                    onClick={() => handleDeleteUser(student.uid)}
                  />
                </Tooltip>
              </Col>
            </Row>
          </Card>
        ))}
      </Card>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                ref={nameRef}
                defaultValue={editingUser ? editingUser.name : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="studentNo">
              <Form.Label>Student Number</Form.Label>
              <Form.Control
                type="number"
                disabled={editingUser !== null}
                ref={studentNoRef}
                defaultValue={editingUser ? editingUser.studentNo : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                disabled={editingUser !== null}
                ref={emailRef}
                defaultValue={editingUser ? editingUser.email : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                disabled={editingUser !== null}
                ref={passwordRef}
              />
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
                  defaultChecked={
                    !editingUser || editingUser.role === "Student"
                  }
                  ref={roleRef}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Professor"
                  name="role"
                  id="professor"
                  defaultChecked={
                    editingUser && editingUser.role === "Professor"
                  }
                  ref={roleRef}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setEditingUser(null);
            }}
          >
            Close
          </Button>
          <Button
            variant="outline-primary"
            onClick={editingUser ? handleEditUser : handleCreateUser}
          >
            {editingUser ? "Save Changes" : "Create User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ModeratorDashboard;
