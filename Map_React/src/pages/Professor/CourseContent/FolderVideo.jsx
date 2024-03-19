import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Modal, Row, Col, ProgressBar } from "react-bootstrap";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

import { ref, push, update } from "firebase/database";
import { database, auth } from "../../../services/Firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

function CreateVideoModalFolder({ show, onHide, selectedCourse, folderId }) {
  const [videoSource, setVideoSource] = useState(null);
  const [fileDetails, setFileDetails] = useState({ fileName: "", file: null });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [timestamp, setTimestamp] = useState("");
  const [maxDuration, setMaxDuration] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const indexToLetter = (index) => String.fromCharCode(65 + index);

  const handleChoiceChange = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const addChoice = () => {
    setChoices([...choices, ""]);
  };

  const removeChoice = (index) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setVideoSource(fileUrl);
      setFileDetails({ fileName: file.name, file: file });

      const video = document.createElement("video");

      video.addEventListener("loadedmetadata", () => {
        const durationInSeconds = Math.floor(video.duration);

        setMaxDuration(durationInSeconds);
      });

      video.src = fileUrl;

      video.load();
    }
  };

  const formatTime = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleModalHide = () => {
    setVideoSource(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadProgress(0);
    setMaxDuration(0);
    onHide();
  };

  const handleFileUpload = async () => {
    const { fileName, file } = fileDetails;
    const user = auth.currentUser;
    console.log("Folder ID before upload:", folderId);

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
                const reviewerRef = ref(
                  database,
                  `VideoActivity/${selectedCourse.uid}`
                );
                const newFileKey = push(reviewerRef).key;

                const videoActivityUpdate = {
                  Course: selectedCourse.uid,
                  title: fileName,
                  createdBy: createdBy,
                  date: formattedDate,
                  video: downloadURL,
                  FolderName: folderId,
                };

                update(
                  ref(database, `VideoActivity/${newFileKey}`),
                  videoActivityUpdate
                );

                const activityRef = ref(
                  database,
                  `VideoActivity/${newFileKey}/activities`
                );
                const activityKey = push(activityRef).key;
                const activityUpdate = {
                  question: question,
                  choices: Object.fromEntries(
                    choices.map((choice, index) => [
                      indexToLetter(index),
                      choice,
                    ])
                  ),
                  answer: indexToLetter(selectedAnswer),
                  time: timestamp,
                };
                update(
                  ref(
                    database,
                    `VideoActivity/${newFileKey}/activities/${activityKey}`
                  ),
                  activityUpdate
                );

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

  // useEffect(() => {
  //   console.log("Selected folder ID:", folderId);
  // }, [folderId]);

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

          <p>Duration of the video: {formatTime(maxDuration)}</p>

          <Form.Group className="mb-3" controlId="question">
            <Form.Control
              type="text"
              placeholder="Enter question"
              onChange={(e) => setQuestion(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Enter choices:</Form.Label>
              <p className="d-flex align-items-center" onClick={addChoice}>
                <AddCircleOutlineIcon color="primary" className="me-2" />
                Add choices
              </p>
            </div>

            {choices.map((choice, index) => (
              <div key={index} className="mb-3">
                <Row className="align-items-center">
                  <Col xs={10}>
                    <Form.Check
                      className="d-flex align-items-center"
                      type="radio"
                      aria-label={`radio ${indexToLetter(index)}`}
                      name="choices"
                      id={`choice${index + 1}`}
                      label={
                        <Form.Control
                          className="ms-2"
                          type="text"
                          placeholder={`Choice ${indexToLetter(index)}`}
                          value={choice}
                          onChange={(e) =>
                            handleChoiceChange(index, e.target.value)
                          }
                        />
                      }
                      onClick={() => handleAnswerChange(index)}
                    />
                  </Col>
                  <Col xs={2}>
                    {index !== 0 && (
                      <CloseIcon
                        color="error"
                        className="cursor-pointer"
                        onClick={() => removeChoice(index)}
                      />
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </Form.Group>

          <Form.Group className="mb-3" controlId="timestamp">
            <Form.Control
              type="text"
              placeholder="Enter popup duration"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </Form.Group>

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

export default CreateVideoModalFolder;
