import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import { database } from "../services/Firebase";
import { ref, set } from "firebase/database";
import { toast } from "react-toastify";
import DisplayEvents from "../components/DisplayEvent";

// icons
import AddIcon from "@mui/icons-material/Add";

function EventPlanner() {
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [attendees, setAttendees] = useState("");
  const [eventDetails, setEventDetails] = useState("");

  const handleCreateEvent = () => {
    const formattedDate = eventDate.replace(/-/g, "");
    const eventId = formattedDate + "_" + Date.now();
    const eventRef = ref(database, "events/" + eventId);

    const newEvent = {
      name: eventName,
      date: eventDate,
      time: eventTime,
      attendees: attendees,
      details: eventDetails,
    };

    set(eventRef, newEvent);

    setShowModal(false);
    toast.success("Event Created Successfully");
  };

  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Event Planner</b>
              </h3>
              <p className="text-muted">
                Manage and plan events with the organization
              </p>
            </div>
          </Col>
          <Col>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <AddIcon className="" /> Add Event
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="eventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => setEventName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => setEventDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventTime">
              <Form.Label>Event Time</Form.Label>
              <Form.Control
                type="time"
                onChange={(e) => setEventTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="attendees">
              <Form.Label>Attendees</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setAttendees(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Drivers">Drivers</option>
                <option value="Dispatchers">Dispatchers</option>
                <option value="Mechanics">Mechanics</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventDetails">
              <Form.Label>Event Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => setEventDetails(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="mt-4 ms-5 p-4 title-header">
        <DisplayEvents />
      </Card>
    </Container>
  );
}

export default EventPlanner;
