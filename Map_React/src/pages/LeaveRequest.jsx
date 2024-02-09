import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Card,
  Table,
  Button,
  Form,
} from "react-bootstrap";
import "../index.css";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";

// Icons
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";

// Firebase
import { database } from "../services/Firebase";
import { ref, onValue, update } from "firebase/database";

function DriverLetter() {
  const [drivers, setDrivers] = useState([]);
  const [absentLetters, setAbsentLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const driverRef = ref(database, "drivers");
    const fetchDriversData = async () => {
      await onValue(driverRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const driversArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setDrivers(driversArray);
        }
      });
    };
    fetchDriversData();

    const absentLettersRef = ref(database, "absentLetters");
    const fetchAbsentLettersData = async () => {
      await onValue(absentLettersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const absentLettersArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setAbsentLetters(absentLettersArray);
        }
      });
    };
    fetchAbsentLettersData();
  }, []);

  const getDriversWithLetters = () => {
    return drivers
      .filter((driver) =>
        absentLetters.some(
          (letters) =>
            letters.fname === driver.fname &&
            letters.status !== "accepted" &&
            letters.status !== "rejected"
        )
      )
      .map((driver) => {
        const matchingLetter = absentLetters.find(
          (letters) =>
            letters.fname === driver.fname &&
            letters.status !== "accepted" &&
            letters.status !== "rejected"
        );

        return {
          ...driver,
          letter: matchingLetter ? matchingLetter.letter : null,
          status: matchingLetter ? matchingLetter.status : null,
        };
      });
  };

  const driversWithLetters = getDriversWithLetters();

  const handleEmailIconClick = (letters) => {
    setSelectedLetter(letters);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAcceptRequest = () => {
    if (selectedLetter) {
      const { id } = selectedLetter;
      const absentLetterRef = ref(database, `absentLetters/${id}`);
      update(absentLetterRef, {
        status: "accepted",
      });

      setAbsentLetters((prevLetters) =>
        prevLetters.map((letter) =>
          letter.id === id ? { ...letter, status: "accepted" } : letter
        )
      );
    }

    handleCloseModal();
  };

  const handleRejectRequest = () => {
    if (selectedLetter) {
      const { id } = selectedLetter;
      const absentLetterRef = ref(database, `absentLetters/${id}`);
      update(absentLetterRef, {
        status: "rejected",
      });

      setAbsentLetters((prevLetters) =>
        prevLetters.map((letter) =>
          letter.id === id ? { ...letter, status: "rejected" } : letter
        )
      );
    }

    handleCloseModal();
  };

  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Driver's Leave Request</b>
              </h3>
              <p className="text-muted">
                Driver's leave request details below.
              </p>
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
        <Table className="text-center" striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>License No.</th>
              <th>License Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getDriversWithLetters().map((driverWithLetters) => (
              <tr key={driverWithLetters.id}>
                <td>{driverWithLetters.fname}</td>
                <td>{driverWithLetters.email}</td>
                <td>{driverWithLetters.licenseNo}</td>
                <td>{driverWithLetters.licenseExpiry}</td>
                <td>
                  <Tooltip title="Message" arrow>
                    <Badge
                      variant="dot"
                      color="error"
                      onClick={() => handleEmailIconClick(driverWithLetters)}
                    >
                      <EmailIcon style={{ color: "#739072" }} />
                    </Badge>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLetter && (
            <div>
              <Form.Group controlId="fname">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedLetter.fname}
                  disabled
                />
              </Form.Group>

              <Form.Group controlId="letter" className="mt-3">
                <Form.Label className="text-dark">Leave request:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={selectedLetter.letter}
                  disabled
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="mx-auto">
            <Button
              className="me-3"
              variant="outline-success"
              onClick={handleAcceptRequest}
            >
              Accept request
            </Button>
            <Button variant="danger" onClick={handleRejectRequest}>
              Reject request
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DriverLetter;
