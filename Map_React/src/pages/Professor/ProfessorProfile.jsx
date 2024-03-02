import React, { useEffect, useState } from "react";
import { Container, Card, Col, Row, Button, Form } from "react-bootstrap";
import { database } from "../../services/Firebase";
import { ref, onValue, set } from "firebase/database";
import useAuth from "../../services/Auth";

function ProfessorProfile() {
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

        if (studentData && studentData.studentNo) {
          localStorage.setItem("studentData", JSON.stringify(studentData));
        }
      });
    };

    fetchStudentData();

    return () => {};
  }, [currentUser]);

  function handleEditName() {
    if (editName) {
      const studentRef = ref(database, "students/" + currentUser.uid + "/name");
      set(studentRef, studentData.name);
    }
    setEditName(!editName);
  }

  function handleEditEmail() {
    if (editEmail) {
      const studentRef = ref(
        database,
        "students/" + currentUser.uid + "/email"
      );
      set(studentRef, studentData.email);
    }
    setEditEmail(!editEmail);
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
                      {editName ? (
                        <Form.Control
                          type="text"
                          id="student-name"
                          value={studentData ? studentData.name : ""}
                          style={{ width: "50rem" }}
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          id="student-name"
                          value={studentData ? studentData.name : ""}
                          style={{ width: "50rem" }}
                          disabled
                        />
                      )}
                    </Col>
                    <Col>
                      <Button
                        onClick={handleEditName}
                        type="button"
                        style={{ width: "10rem" }}
                        variant="primary"
                      >
                        {editName ? "Save" : "Edit"}
                      </Button>
                    </Col>
                  </Row>
                  <Row
                    className="align-items-center"
                    style={{ marginBottom: "20px" }}
                  >
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
                        disabled
                      />
                    </Col>
                    <Col></Col>
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
                      {editEmail ? (
                        <Form.Control
                          type="text"
                          id="student-email"
                          value={studentData ? studentData.email : ""}
                          style={{ width: "50rem" }}
                          onChange={(e) =>
                            setStudentData({
                              ...studentData,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <Form.Control
                          type="text"
                          id="student-email"
                          value={studentData ? studentData.email : ""}
                          style={{ width: "50rem" }}
                          disabled
                        />
                      )}
                    </Col>
                    <Col>
                      <Button
                        onClick={handleEditEmail}
                        type="button"
                        style={{ width: "10rem" }}
                        variant="primary"
                      >
                        {editEmail ? "Save" : "Edit"}
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

export default ProfessorProfile;
