import React, { useState, useEffect } from "react";
import { database } from "../services/Firebase";
import { ref, onValue, remove, update } from "firebase/database";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function DisplayEvent() {
  const [events, setEvents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    name: "",
    date: "",
    time: "",
    attendees: "",
    details: "",
  });

  useEffect(() => {
    const eventsRef = ref(database, "events");

    onValue(eventsRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        const eventList = Object.keys(eventData).map((eventId) => ({
          id: eventId,
          ...eventData[eventId],
        }));
        setEvents(eventList);
      }
    });

    return () => {};
  }, []);

  const handleEdit = (eventId) => {
    setShowEditModal(true);

    const selectedEvent = events.find((event) => event.id === eventId);
    setSelectedEventId(eventId);
    setEditedEvent(selectedEvent);
  };

  const handleSaveEdit = () => {
    const eventRef = ref(database, `events/${selectedEventId}`);
    update(eventRef, editedEvent);

    setShowEditModal(false);
    toast.success("Event Updated Successfully");
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleShowDeleteModal = (eventId) => {
    setShowDeleteModal(true);
    setSelectedEventId(eventId);
  };

  const handleHideDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedEventId(null);
  };

  const handleDelete = () => {
    if (selectedEventId) {
      const eventRef = ref(database, `events/${selectedEventId}`);
      remove(eventRef);
      handleHideDeleteModal();
      toast.success("Event Successfully Deleted");
    }
  };

  return (
    <div className="mt-3">
      <Table striped bordered hover>
        <thead className="text-center">
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Attendees</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.date}</td>
              <td>{event.time}</td>
              <td>{event.attendees}</td>
              <td>{event.details}</td>
              <td className="text-center">
                <Tooltip title="Edit" arrow>
                  <EditIcon
                    className="me-2"
                    color="primary"
                    onClick={() => handleEdit(event.id)}
                  />
                </Tooltip>

                <Tooltip title="Delete" arrow>
                  <DeleteIcon
                    color="error"
                    onClick={() => handleShowDeleteModal(event.id)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleHideDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCancelEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="eventName">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                value={editedEvent.name}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventDate">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                value={editedEvent.date}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="eventTime">
              <Form.Label>Event Time</Form.Label>
              <Form.Control
                type="time"
                value={editedEvent.time}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, time: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="attendees">
              <Form.Label>Attendees</Form.Label>
              <Form.Control
                as="select"
                value={editedEvent.attendees}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, attendees: e.target.value })
                }
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
                value={editedEvent.details}
                onChange={(e) =>
                  setEditedEvent({ ...editedEvent, details: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DisplayEvent;
