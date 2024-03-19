import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Col,
  Row,
  Button,
  Form,
  InputGroup,
  Modal,
  FloatingLabel,
} from "react-bootstrap";
import { Fingerprint, VisibilityOff, Visibility } from "@mui/icons-material";
import { database } from "../services/Firebase";
import { ref, onValue, set } from "firebase/database";
import useAuth from "../services/Auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [editName, setEditName] = useState(false);
  const [editNumber, setEditNumber] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [pwordmodalOpen, setpwordmodalOpen] = useState(false);
  const [otpModalOpen, setotpmodalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");

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

  function handlePasswordModal() {
    setpwordmodalOpen(!pwordmodalOpen);
  }
  function handleOTPModal() {
    setotpmodalOpen(!otpModalOpen);
  }

  function handleFingerprint() {
    window.open("http://localhost/fingerprint/register");
  }

  // Form validation functions
  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = (password) => password.length >= 6;
  const isOTPValid = (otp) => otp.length === 6;

  // Handlers for modal submission
  function handlePasswordUpdate() {
    if (isEmailValid(email) && isPasswordValid(password)) {
      // Proceed with password update
    } else {
      // Show error or handle invalid input
    }
  }

  function handleGenerateOTP() {
    // Generate OTP and send it to the user's email
    axios
      .post("http://localhost:3000/generate", {
        userId: currentUser.uid,
        email: currentUser.email, // Use the user's email or any other relevant email
      })
      .then((response) => {
        // Handle successful OTP generation
        toast.success(response.data.message);
      })
      .catch((error) => {
        // Handle OTP generation error
        toast.error(error.response.data.error);
      });
  }

  function handleOTPSubmit() {
    if (isEmailValid(currentUser.email) && isOTPValid(otp)) {
      // Verify OTP with server
      axios
        .post("http://localhost:3000/verify", {
          userId: currentUser.uid,
          otp: otp,
        })
        .then((response) => {
          // Handle successful OTP verification
          toast.success(response.data.message);
          // Close OTP modal or perform any other actions
          setotpmodalOpen(false);
          setpwordmodalOpen(true);
        })
        .catch((error) => {
          // Handle OTP verification error
          toast.error(error.response.data.error);
        });
    } else {
      // Show error or handle invalid input
      toast.error("Invalid OTP.");
    }
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
                      <Form.Label htmlFor="updatePassword">Password</Form.Label>
                    </Col>
                    <Col>
                      <div style={{ width: "50rem" }}></div>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        variant="primary"
                        style={{ width: "10rem" }}
                        onClick={handleOTPModal}
                      >
                        Update
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

      <Modal show={pwordmodalOpen} backdrop="static" size="lg">
        <Modal.Header>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="email"
              label="Email address"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={studentData ? studentData.email : ""}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={email !== "" && !isEmailValid(email)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email address.
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel controlId="password" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={password !== "" && !isPasswordValid(password)}
              />
              <Form.Control.Feedback type="invalid">
                Password must be at least 8 characters long.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePasswordModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePasswordUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal show={otpModalOpen} backdrop="static" size="lg">
        <Modal.Header>
          <Modal.Title>OTP Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="otpEmail"
                  label="Email address"
                  className="mb-3"
                >
                  <Form.Control
                    disabled
                    type="email"
                    placeholder="name@example.com"
                    value={currentUser ? currentUser.email : ""}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={email !== "" && !isEmailValid(email)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col>
                <Button onClick={handleGenerateOTP}>Generate</Button>
              </Col>
            </Row>

            <FloatingLabel controlId="otp" label="OTP">
              <Form.Control
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                isInvalid={otp !== "" && !isOTPValid(otp)}
              />
              <Form.Control.Feedback type="invalid">
                OTP must be a 6-digit code.
              </Form.Control.Feedback>
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleOTPModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOTPSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
