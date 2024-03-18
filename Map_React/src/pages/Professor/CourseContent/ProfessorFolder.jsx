import React, { useState, useRef } from "react";
import { Card, Modal, Button, Form } from "react-bootstrap";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArticleIcon from "@mui/icons-material/Article";

import ReviewerModal from "../ReviewerModal";

import { ref, remove, push, update } from "firebase/database";
import { database, auth } from "../../../services/Firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

function FolderProf({
  folders,
  selectedCourse,
  tasks,
  reviewers,
  deleteFolder,
}) {
  const filteredFolders = folders.filter(
    (folder) => folder.Course === selectedCourse.uid
  );

  const foldersWithTasks = filteredFolders.filter((folder) =>
    tasks.some((task) => task.FolderName === folder.id)
  );

  const reviewersWithFolderName = reviewers.filter(
    (reviewer) => reviewer.FolderName
  );

  const [expandedFolder, setExpandedFolder] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileDetails, setFileDetails] = useState({
    fileName: "",
    file: null,
  });
  const fileInputRef = useRef(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  const handleReviewerClick = (reviewer) => {
    setSelectedReviewer(reviewer);
  };

  const handleCloseReviewerModal = () => {
    setSelectedReviewer(null);
  };

  const toggleFolder = (folderId) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
    } else {
      setExpandedFolder(folderId);
    }
  };

  const handleDeleteFolder = (folderId) => {
    deleteFolder(folderId);
  };

  const handleDeleteTask = (taskId) => {
    const taskRef = ref(database, `Tasks/${taskId}`);
    remove(taskRef)
      .then(() => {
        console.log(`Task ${taskId} deleted successfully`);
      })
      .catch((error) => {
        console.error(`Error deleting task ${taskId}:`, error);
      });
  };

  const handleFileUpload = async () => {
    const { fileName, file } = fileDetails;
    const user = auth.currentUser;

    if (!fileName || !file || !selectedFolder) {
      console.error(
        "Please select a file, provide a file name, and select a folder."
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
        const fileRef = storageRef(storage, file.name);
        await uploadBytes(fileRef, file);
        console.log("File uploaded successfully");

        const downloadURL = await getDownloadURL(fileRef);

        const reviewerRef = ref(database, `Reviewer/${selectedCourse.uid}`);
        const newFileKey = push(reviewerRef).key;
        update(ref(database), {
          [`Reviewer/${newFileKey}`]: {
            Course: selectedCourse.uid,
            title: fileName,
            FolderName: selectedFolder,
            createdBy: createdBy,
            date: formattedDate,
            file: downloadURL,
          },
        });
        console.log("File details saved to the database");
        fileInputRef.current.value = null;
        setFileDetails({ fileName: "", file: null });
        setSelectedFolder(null);
        setShowUploadModal(false);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    } else {
      console.error("No user is logged in");
      return;
    }
  };

  return (
    <div>
      {filteredFolders.map((folder, index) => {
        const folderHasTasks = foldersWithTasks.some((f) => f.id === folder.id);

        return (
          <Card key={index} className="title-header mt-3">
            <Card.Header
              className="d-flex align-items-center justify-content-between p-3"
              onClick={() => toggleFolder(folder.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <FolderOpenIcon className="me-2" />
                {folder.id}
              </div>
              <DeleteIcon
                color="error"
                className="cursor-pointer"
                onClick={() => handleDeleteFolder(folder.id)}
              />
            </Card.Header>
            {expandedFolder === folder.id && (
              <Card.Body>
                <div
                  className="d-flex justify-content-end align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <Breadcrumbs
                    className="d-flex justify-content-end"
                    aria-label="breadcrumb"
                    style={{ cursor: "pointer" }}
                  >
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      onClick={() => {
                        setSelectedFolder(folder.id);
                        setShowUploadModal(true);
                      }}
                    >
                      <AttachFileIcon
                        color="primary"
                        className="me-1"
                        style={{ fontSize: "18px" }}
                      />
                      Upload File
                    </Link>
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                    >
                      <AddCircleOutlineIcon
                        color="primary"
                        className="me-1"
                        style={{ fontSize: "18px" }}
                      />
                      Create Task
                    </Link>
                  </Breadcrumbs>
                </div>

                {folderHasTasks && (
                  <div className="ms-3">
                    {tasks
                      .filter((task) => task.FolderName === folder.id)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="d-flex align-items-center justify-content-between mt-2"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex align-items-center">
                            <ListAltIcon className="me-2" />
                            {task.taskName} - {task.dueDate}
                          </div>

                          <CloseIcon
                            color="error"
                            className="cursor-pointer"
                            onClick={() => handleDeleteTask(task.id)}
                            style={{ fontSize: "18px" }}
                          />
                        </div>
                      ))}
                  </div>
                )}

                {reviewersWithFolderName
                  .filter((reviewer) => reviewer.FolderName === folder.id)
                  .map((reviewer) => (
                    <div
                      key={reviewer.id}
                      className="d-flex align-items-center justify-content-between mt-2 ms-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleReviewerClick(reviewer)}
                    >
                      <div className="d-flex align-items-center">
                        <ArticleIcon className="me-2" />
                        {reviewer.title} - {reviewer.date}
                      </div>

                      <CloseIcon
                        color="error"
                        className="cursor-pointer"
                        onClick={() => handleDeleteTask(reviewer.id)}
                        style={{ fontSize: "18px" }}
                      />
                    </div>
                  ))}

                {selectedReviewer && (
                  <ReviewerModal
                    show={selectedReviewer !== null}
                    onHide={handleCloseReviewerModal}
                    reviewer={selectedReviewer}
                  />
                )}

                {!folderHasTasks &&
                  reviewersWithFolderName.filter(
                    (reviewer) => reviewer.FolderName === folder.id
                  ).length === 0 && (
                    <div
                      className="ms-3 text-muted"
                      style={{ cursor: "pointer" }}
                    >
                      No tasks available
                    </div>
                  )}

                {/* Modal for uploading file */}
                <Modal
                  show={showUploadModal}
                  onHide={() => setShowUploadModal(false)}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Upload File</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="fileName">
                        <Form.Control
                          type="text"
                          placeholder="File name"
                          value={fileDetails.fileName}
                          onChange={(e) =>
                            setFileDetails({
                              ...fileDetails,
                              fileName: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group controlId="fileUpload" className="mb-3">
                        <Form.Control
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) =>
                            setFileDetails({
                              ...fileDetails,
                              file: e.target.files[0],
                            })
                          }
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowUploadModal(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleFileUpload}>
                      Upload
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
            )}
          </Card>
        );
      })}

      {tasks
        .filter(
          (task) => !task.FolderName && task.Course === selectedCourse.uid
        )
        .map((task) => (
          <Card className="title-header mt-3">
            <Card.Header className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center">
                <ListAltIcon className="me-2" />
                {task.taskName} - {task.dueDate}
              </div>
              <DeleteIcon
                color="error"
                className="cursor-pointer"
                onClick={() => handleDeleteTask(task.id)}
              />
            </Card.Header>
          </Card>
        ))}
    </div>
  );
}

export default FolderProf;
