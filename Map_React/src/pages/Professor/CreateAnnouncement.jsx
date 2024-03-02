import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ref, push, update } from "firebase/database";
import { database } from "../../services/Firebase";

function CreateAnnouncementModal({ show, onHide, selectedCourse }) {
  const [announcementTitle, setAnnouncementTitle] = useState("");

  const handleTitleChange = (event) => {
    setAnnouncementTitle(event.target.value);
  };

  const handleCreate = async () => {
    const announcementRef = ref(database, `Announcement/${selectedCourse.uid}`);
    const newAnnouncementKey = push(announcementRef).key;
    const currentDate = new Date().toLocaleDateString();

    try {
      await update(ref(database), {
        [`Announcement/${newAnnouncementKey}`]: {
          Course: selectedCourse.uid,
          date: currentDate,
          title: announcementTitle,
        },
      });
      console.log("Announcement created successfully!");
      setAnnouncementTitle("");
      onHide();
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Announcement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="announcementTitle">
            <Form.Label>Announcement Title</Form.Label>
            <Form.Control
              as="textarea"
              value={announcementTitle}
              onChange={handleTitleChange}
              placeholder="Enter announcement title"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateAnnouncementModal;
