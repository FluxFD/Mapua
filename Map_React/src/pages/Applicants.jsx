import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Tab, Tabs } from "react-bootstrap";
import "../index.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Firebase
import { database } from "../services/Firebase";
import { ref, onValue, update } from "firebase/database";

// Icons
import AddIcon from "@mui/icons-material/Add";

const accepted = "accepted";
const rejected = "rejected";

function DriverApplicants() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const applicantsRef = ref(database, "drivers");

    const unsubscribe = onValue(applicantsRef, (snapshot) => {
      if (snapshot.exists()) {
        const applicantsArray = Object.entries(snapshot.val())
          .map(([key, value]) => ({
            key,
            ...value,
          }))
          .filter((applicant) => applicant.accountVerified === "");

        setApplicants(applicantsArray);
      } else {
        console.log("No data available");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = (applicantKey) => {
    const applicantsRef = ref(database, `drivers/${applicantKey}`);
    update(applicantsRef, { accountVerified: accepted });

    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.key === applicantKey
          ? { ...applicant, accountVerified: accepted }
          : applicant
      )
    );
  };

  const handleReject = (applicantKey) => {
    const applicantsRef = ref(database, `drivers/${applicantKey}`);
    update(applicantsRef, { accountVerified: rejected });

    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) =>
        applicant.key === applicantKey
          ? { ...applicant, accountVerified: rejected }
          : applicant
      )
    );
  };

  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Applicants</b>
              </h3>
              <p className="text-muted">Request application to join our team</p>
            </div>
          </Col>
          <Col>
            {/* <Button variant="primary">
              <AddIcon className="" /> Add Event
            </Button> */}
          </Col>
        </Row>
      </Card>

      <Card className="mt-4 ms-5 p-5 title-header">
        <Tabs
          defaultActiveKey="driver"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="driver" title="Driver Applicants">
            <div className="d-flex justify-content-center align-items-center mt-5 ">
              {applicants.map(
                (applicant, index) =>
                  index % 5 === 0 && (
                    <Row key={index} className="mb-4">
                      {applicants.slice(index, index + 5).map((applicant) => (
                        <Col key={applicant.key} className="text-center mt-2">
                          <Card className="me-3" style={{ width: "18rem" }}>
                            <Card.Body>
                              <AccountCircleIcon
                                style={{ fontSize: 100, marginBottom: 10 }}
                              />
                              <Card.Text>
                                <div>
                                  <b>{applicant.fname}</b>
                                </div>
                                <div className="text-muted">
                                  <p>{applicant.email}</p>
                                </div>
                                <div className="text-muted">
                                  <p>{applicant.licenseNo}</p>
                                </div>
                                <div className="text-muted">
                                  <p>{applicant.licenseExpiry}</p>
                                </div>
                              </Card.Text>
                              <Button
                                size="sm"
                                variant="outline-success me-3"
                                onClick={() => handleAccept(applicant.key)}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleReject(applicant.key)}
                              >
                                Reject
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )
              )}
            </div>
          </Tab>
          <Tab eventKey="mechanic" title="Maintenance Applicants">
            Maintenance Applicants
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
}

export default DriverApplicants;
