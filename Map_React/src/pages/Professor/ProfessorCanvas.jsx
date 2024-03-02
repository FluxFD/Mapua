import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Modal,
  Tab,
  Tabs,
  Card,
  Offcanvas,
  Accordion,
  Row,
  Col,
} from "react-bootstrap";
import "../../index.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import CreateTaskModal from "./ModalCreateTask";
import CreateAnnouncementModal from "./CreateAnnouncement";

// Firebase
import { database, storage, auth } from "../../services/Firebase";
import { ref, onValue, off, set, update, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

function ProfessorOffcanvas({ show, onHide, selectedCourse }) {
  const [tasks, setTasks] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [reviewerActivity, setReviewerActivity] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const handleOpenCreateTaskModal = () => {
    setShowCreateTaskModal(true);
  };

  const handleCloseCreateTaskModal = () => {
    setShowCreateTaskModal(false);
  };

  const handleOpenAnnouncementModal = () => {
    setShowAnnouncementModal(true);
  };

  const handleCloseAnnouncementModal = () => {
    setShowAnnouncementModal(false);
  };

  useEffect(() => {
    const tasksRef = ref(database, "Task");
    const reviewersRef = ref(database, "Reviewer");
    const reviewerActivityRef = ref(database, "ReviewerActivity");
    const announcementsRef = ref(database, "Announcement");

    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {};
      const tasksArray = [];

      Object.entries(tasksData).forEach(([taskId, task]) => {
        if (task.Course === selectedCourse.uid) {
          tasksArray.push({ id: taskId, ...task });
        }
      });

      setTasks(tasksArray);
    });

    const unsubscribeReviewers = onValue(reviewersRef, (snapshot) => {
      const reviewersData = snapshot.val() || {};
      const reviewersArray = [];

      Object.entries(reviewersData).forEach(([reviewerId, reviewer]) => {
        if (reviewer.Course === selectedCourse.uid) {
          reviewersArray.push({ id: reviewerId, ...reviewer });
        }
      });

      setReviewers(reviewersArray);
    });

    const unsubscribeReviewerActivity = onValue(
      reviewerActivityRef,
      (snapshot) => {
        const reviewerActivityData = snapshot.val() || {};
        const reviewerActivityArray = [];

        Object.entries(reviewerActivityData).forEach(
          ([activityId, activity]) => {
            if (activity.Course === selectedCourse.uid) {
              reviewerActivityArray.push({ id: activityId, ...activity });
            }
          }
        );

        setReviewerActivity(reviewerActivityArray);
      }
    );

    const unsubscribeAnnouncements = onValue(announcementsRef, (snapshot) => {
      const announcementsData = snapshot.val() || {};
      const announcementsArray = [];

      Object.entries(announcementsData).forEach(
        ([announcementId, announcement]) => {
          if (announcement.Course === selectedCourse.uid) {
            announcementsArray.push({
              id: announcementId,
              ...announcement,
            });
          }
        }
      );

      setAnnouncements(announcementsArray);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeReviewers();
      unsubscribeReviewerActivity();
      unsubscribeAnnouncements();
    };
  }, [selectedCourse.uid]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    const fileName = document.getElementById("fileName").value;
    const user = auth.currentUser;

    if (user) {
      const createdBy = user.email;
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const date = currentDate.getDate();
      const year = currentDate.getFullYear();
      const formattedDate = `${month}/${date}/${year}`;

      try {
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
            createdBy: createdBy,
            date: formattedDate,
            file: downloadURL,
          },
        });
        console.log("File details saved to the database");
        fileInputRef.current.value = null;
        setTitle("");
        handleCloseModal();
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    } else {
      console.error("No user is logged in");
      return;
    }
  };

  const handleFileNameChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
      {selectedCourse && (
        <Offcanvas
          show={show}
          onHide={onHide}
          placement="end"
          backdrop="static"
          style={{
            width: "85%",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{selectedCourse.uid}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="mt-1">
              <Tabs
                defaultActiveKey="content"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="content" title="Course Content">
                  <Breadcrumbs
                    className="d-flex justify-content-end"
                    aria-label="breadcrumb"
                    style={{ cursor: "pointer" }}
                  >
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      onClick={handleOpenModal}
                    >
                      <AttachFileIcon /> Upload File
                    </Link>
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      onClick={handleOpenCreateTaskModal}
                    >
                      <AddIcon /> Create Task
                    </Link>
                  </Breadcrumbs>

                  <CreateTaskModal
                    show={showCreateTaskModal}
                    onHide={handleCloseCreateTaskModal}
                    selectedCourse={selectedCourse}
                  />
                  <hr />
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      style={{ cursor: "pointer" }}
                      className="title-header mt-3"
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            <ListAltIcon className="me-2" />
                            {task.taskName} - Due Date: {task.dueDate}
                          </span>

                          <DeleteIcon
                            color="error"
                            className="cursor-pointer"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  {reviewers.map((reviewer) => (
                    <Card
                      key={reviewer.id}
                      style={{ cursor: "pointer" }}
                      className="title-header mt-3"
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            <ArticleIcon className="me-2" />
                            {reviewer.title} - Due Date: {reviewer.date}
                          </span>

                          <DeleteIcon
                            color="error"
                            className="cursor-pointer"
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  {reviewerActivity.map((activity) => (
                    <div defaultActiveKey="0">
                      <Accordion
                        key={activity.id}
                        className="title-header mt-3 cursor-pointer"
                      >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <div className="d-flex align-items-center">
                              <span>
                                <ListAltIcon className="me-2" />
                                {activity.title} - Date: {activity.date}
                              </span>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="d-flex align-items-center ms-3">
                              <ListAltIcon className="me-2" />
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  ))}
                </Tab>
                <Tab eventKey="announcement" title="Announcement">
                  <Breadcrumbs
                    className="d-flex justify-content-end"
                    aria-label="breadcrumb"
                    style={{ cursor: "pointer" }}
                  >
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      onClick={() => setShowAnnouncementModal(true)}
                    >
                      <AddIcon /> Create Announcement
                    </Link>
                  </Breadcrumbs>

                  <CreateAnnouncementModal
                    show={showAnnouncementModal}
                    onHide={handleCloseAnnouncementModal}
                    selectedCourse={selectedCourse}
                  />

                  <hr />
                  {announcements.map((announcements) => (
                    <Card
                      key={announcements.id}
                      style={{ cursor: "pointer" }}
                      className="title-header mt-3"
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <CampaignIcon className="me-2" />
                          {announcements.title} - Date: {announcements.date}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Tab>
                <Tab eventKey="calendar" title="Calendar">
                  Tab content for Calendar
                </Tab>
                <Tab eventKey="gradeBook" title="Gradebook">
                  Tab content for Gradebook
                </Tab>
              </Tabs>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Upload Modal */}
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="fileName">
              <Form.Control
                type="text"
                placeholder="File name"
                value={title}
                onChange={handleFileNameChange}
              />
            </Form.Group>
            <Form.Group controlId="fileUpload" className="mb-3">
              <Form.Control type="file" ref={fileInputRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFileUpload}>
            Upload File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProfessorOffcanvas;
