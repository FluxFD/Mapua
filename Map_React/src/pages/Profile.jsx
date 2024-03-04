import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Form,
} from "react-bootstrap";
import { Fingerprint } from "@mui/icons-material";
import { database } from "../services/Firebase";
import { ref, onValue, set } from "firebase/database";
import useAuth from "../services/Auth";

function Profile() {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [editName, setEditName] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  useEffect(() => {
    const fetchStudentData = () => {
      if (!currentUser) return;
      const studentRef = ref(database, "students/" + currentUser.uid);
      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();
        setStudentData(studentData);

        // Store studentNo in localStorage
        if (studentData && studentData.studentNo) {
          localStorage.setItem("studentData", JSON.stringify(studentData));
        }
      });
    };

    fetchStudentData();

    return () => {};
  }, [currentUser]);

  useEffect(() => {
    // Listen for messages from the parent
    window.addEventListener("message", function (event) {
      // Check if the message is from an allowed origin
      if (event.origin === "http://localhost/fingerprint") {
        // Check the message content
        if (event.data === "getData") {
          // Access localStorage data and send it back to the parent
          var studentData = localStorage.getItem("studentData");
          // Send data back to the parent
          event.source.postMessage(studentData, event.origin);
        }
      }
    });
  }, [studentData]);

  function handleEditName() {
    if (!editName) {
      setEditNumber(false);
      setEditEmail(false);
    }
    setEditName(!editName);
  }

  function handleEditNumber() {
    if (!editNumber) {
      setEditName(false);
      setEditEmail(false);
    }
    setEditNumber(!editNumber);
  }

  function handleEditEmail() {
    if (!editEmail) {
      setEditName(false);
      setEditNumber(false);
    }
    setEditEmail(!editEmail);
  }

  function handleFingerprint() {
    window.open("http://localhost/fingerprint/register");
  }

  return (
    <Container fluid style={{ paddingLeft: "15%", paddingRight: "1%" }}>
      <Card style={{ margin: "20px" }}>
        <div style={{ margin: "20px" }}>
          <h4>Profile Settings</h4>
        </div>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
          }}
        >
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Row style={{ marginBottom: "20px" }}>
                    <Col>
                      <Form.Label htmlFor="inputStudentName">
                        Student Name
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        id="student-name"
                        value={studentData ? studentData.name : ""}
                        style={{ width: "50rem" }}
                        disabled={!editName} // Enable/disable based on edit mode
                        onChange={(e) => {
                          set(ref(database, "students/" + currentUser.uid), {
                            email: studentData.email,
                            isActive: studentData.isActive,
                            name: e.target.value,
                            role: studentData.role,
                            studentNo: studentData.studentNo,
                            uid: studentData.uid,
                          });
                        }}
                      />
                    </Col>
                    <Col>
                      <Button
                        onClick={handleEditName}
                        type="button"
                        style={{ width: "10rem" }}
                        variant="primary"
                      >
                        {editName ? "Save" : "Edit"}
                        {/* Change button label based on edit mode */}
                      </Button>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: "20px" }}>
                    <Col>
                      <Form.Label htmlFor="inputStudentNumber">
                        Student Number
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        id="student-number"
                        value={studentData ? studentData.studentNo : ""}
                        style={{ width: "50rem" }}
                        disabled={!editNumber} // Enable/disable based on edit mode
                      />
                    </Col>
                    <Col>
                      
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </div>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Row>
            <Col>
              <hr />
            </Col>
          </Row>
        </div>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
          }}
        >
          <h4>Account Settings</h4>
        </div>
        <div
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
          }}
        >
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Row style={{ marginBottom: "20px" }}>
                    <Col>
                      <Form.Label htmlFor="inputEmail">Email</Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        id="student-email"
                        value={studentData ? studentData.email : ""}
                        style={{ width: "50rem" }}
                        disabled={!editEmail} // Enable/disable based on edit mode
                        onChange={(e) => {
                          set(ref(database, "students/" + currentUser.uid), {
                            email: e.target.value,
                            isActive: studentData.isActive,
                            name: studentData.name,
                            role: studentData.role,
                            studentNo: studentData.studentNo,
                            uid: studentData.uid,
                          });
                        }}
                      />
                    </Col>
                    <Col>
                      <Button
                        onClick={handleEditEmail}
                        type="button"
                        style={{ width: "10rem" }}
                        variant="primary"
                        
                      >
                        {editEmail ? "Save" : "Edit"}
                        {/* Change button label based on edit mode */}
                      </Button>
                    </Col>
                  </Row>

                  <Row style={{ marginBottom: "20px" }}>
                    <Col>
                      <Form.Label htmlFor="inputEmail">Fingerprint</Form.Label>
                    </Col>
                    <Col>
                      <div style={{ width: "50rem" }}></div>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        variant="primary"
                        style={{ width: "10rem" }}
                        onClick={handleFingerprint}
                      >
                        <Fingerprint style={{ marginRight: "5px" }} />
                        Register
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </div>
      </Card>
    </Container>
  );
}

export default Profile;
