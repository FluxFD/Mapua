import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ref, push, set } from "firebase/database";
import { database, auth } from "../../services/Firebase";

function CreateFolder({ show, onHide, selectedCourse }) {
  const [folderName, setFolderName] = useState("");

  const handleTitleChange = (event) => {
    setFolderName(event.target.value);
  };

  const handleCreate = () => {
    const user = auth.currentUser;
    const currentDate = new Date().toLocaleDateString();

    if (user) {
      const folderData = {
        createdBy: user.email,
        date: currentDate,
      };
      const folderRef = ref(
        database,
        `Folders/${selectedCourse.uid}/${folderName}`
      );
      set(folderRef, folderData);
      console.log("Folder created successfully!");
      setFolderName("");
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Folder Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="folderName">
            <Form.Control
              type="text"
              placeholder="Enter Folder Name"
              value={folderName}
              onChange={handleTitleChange}
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

export default CreateFolder;
