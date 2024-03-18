import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal, Row, Col, ProgressBar } from "react-bootstrap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import { ref, push, update } from "firebase/database";
import { database, auth } from "../../../services/Firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

function CreateVideoModal({ show, onHide, selectedCourse }) {
  const [videoSource, setVideoSource] = useState(null);
  const [fileDetails, setFileDetails] = useState({ fileName: "", file: null });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoSource(fileUrl);
      setFileDetails({ fileName: file.name, file: file });
    }
  };

  const handleModalHide = () => {
    setVideoSource(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadProgress(0);

    onHide();
  };

  const handleFileUpload = async () => {
    const { fileName, file } = fileDetails;
    const user = auth.currentUser;

    if (!fileName || !file || !selectedCourse) {
      console.error(
        "Please select a file, provide a file name, and select a course."
      );
      return;
    }

    if (user) {
      const createdBy = user.email;
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const year = currentDate.getFullYear();
      const formattedDate = `${month}/${date}/${year}`;

      try {
        const storage = getStorage();
        const fileRef = storageRef(storage, `Videos/${fileName}`);

        const uploadTask = uploadBytesResumable(fileRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading file: ", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log("File uploaded successfully");
                const reviewerRef = ref(
                  database,
                  `VideoActivity/${selectedCourse.uid}`
                );
                const newFileKey = push(reviewerRef).key;
                update(ref(database), {
                  [`VideoActivity/${newFileKey}`]: {
                    Course: selectedCourse.uid,
                    title: fileName,
                    createdBy: createdBy,
                    date: formattedDate,
                    video: downloadURL,
                  },
                });
                console.log("File details saved to the database");
                fileInputRef.current.value = "";
                setFileDetails({ fileName: "", file: null });
                handleModalHide();
              })
              .catch((error) => {
                console.error("Error getting download URL: ", error);
              });
          }
        );
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    } else {
      console.error("No user is logged in");
    }
  };

  return (
    <Modal show={show} onHide={handleModalHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="fileUpload" className="mb-3">
            <Form.Control
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Form.Group>
          {videoSource && (
            <Row>
              <Col>
                <iframe
                  src={videoSource}
                  width="100%"
                  height="300"
                  frameBorder="0"
                  allowFullScreen
                  title="Preview"
                ></iframe>
              </Col>
            </Row>
          )}
          {uploadProgress > 0 && (
            <ProgressBar
              now={uploadProgress}
              label={`${uploadProgress}%`}
              variant="info"
              className="mt-3"
            />
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleModalHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleFileUpload}>
          Upload Video
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateVideoModal;
