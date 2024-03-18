import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Modal,
  Tab,
  Tabs,
  Card,
  Offcanvas,
  Table,
} from "react-bootstrap";
import "../../index.css";
import ArticleIcon from "@mui/icons-material/Article";
import PublicIcon from "@mui/icons-material/Public";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../../index.css";

import CreateTaskModal from "./ModalCreateTask";
import CreateAnnouncementModal from "./CreateAnnouncement";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ProfScoreView from "./ProfessorScoreView";
import CreateFolder from "./CreateFolder";
import FolderProf from "./CourseContent/ProfessorFolder";
import ReviewerModal from "./ReviewerModal";

// Firebase
import { database, storage, auth } from "../../services/Firebase";
import {
  ref,
  onValue,
  update,
  push,
  remove,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

function ProfessorOffcanvas({ show, onHide, selectedCourse }) {
  const [reviewers, setReviewers] = useState([]);
  const [reviewerActivity, setReviewerActivity] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [scores, setScores] = useState([]);
  const calendarRef = useRef(null);
  const [calendarKey, setCalendarKey] = useState(Date.now());
  const [folders, setFolders] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [reviewersWithoutFolderName, setReviewersWithoutFolderName] = useState(
    []
  );

  function modifyDateString(dateString) {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    dateObj.setUTCHours(dateObj.getUTCHours() + 8);
    const isoDate = dateObj.toISOString().split("T")[0];
    return isoDate;
  }
  const [selectedScore, setSelectedScore] = useState(null);

  const handleOpenScoreView = (score) => {
    setSelectedScore(score);
  };

  const handleCloseScoreView = () => {
    setSelectedScore(null);
  };

  const handleOpenCreateTaskModal = () => {
    setShowCreateTaskModal(true);
  };

  const handleCloseCreateTaskModal = () => {
    setShowCreateTaskModal(false);
  };

  const handleOpenCreateFolder = () => {
    setShowCreateFolder(true);
  };

  const handleCloseCreateFolder = () => {
    setShowCreateFolder(false);
  };

  const handleOpenAnnouncementModal = () => {
    setShowAnnouncementModal(true);
  };

  const handleCloseAnnouncementModal = () => {
    setShowAnnouncementModal(false);
  };

  const handleDeleteConfirmation = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteConfirmation(true);
  };

  const handleOpenReviewerModal = (reviewer) => {
    setSelectedReviewer(reviewer);
  };

  const handleCloseReviewerModal = () => {
    setSelectedReviewer(null);
  };

  useEffect(() => {
    const reviewersRef = ref(database, "Reviewer");
    const announcementsRef = ref(database, "Announcement");
    const scoresRef = ref(database, "Score");
    const foldersRef = ref(database, "Folders");
    const tasksRef = ref(database, "Tasks");

    const unsubscribeReviewers = onValue(reviewersRef, (snapshot) => {
      const reviewersData = snapshot.val() || {};
      const reviewersArray = [];

      Object.entries(reviewersData).forEach(([reviewerId, reviewer]) => {
        if (reviewer.Course === selectedCourse.uid) {
          reviewersArray.push({ id: reviewerId, ...reviewer });
        }
      });

      const reviewersWithFolderName = reviewersArray.filter(
        (reviewer) => reviewer.FolderName
      );
      const reviewersWithoutFolderName = reviewersArray.filter(
        (reviewer) => !reviewer.FolderName
      );

      setReviewers(reviewersWithFolderName);
      setReviewersWithoutFolderName(reviewersWithoutFolderName);

      setReviewers(reviewersArray);
    });

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

    const unsubscribeScores = onValue(scoresRef, (snapshot) => {
      const scoresData = snapshot.val() || {};
      const scoresArray = [];

      Object.entries(scoresData).forEach(([key, value]) => {
        const { score, studentName, taskName } = value;

        scoresArray.push({ id: key, score, studentName, taskName });
      });

      setScores(scoresArray);
    });

    const unsubscribeFolders = onValue(foldersRef, (snapshot) => {
      const foldersData = snapshot.val() || {};
      const foldersArray = Object.entries(foldersData).flatMap(
        ([course, folders]) =>
          Object.entries(folders).map(([folderId, folder]) => ({
            id: folderId,
            ...folder,
            Course: course,
          }))
      );
      setFolders(foldersArray);
    });

    const unsubscribeTasks = onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {};

      const tasksWithFolderName = [];
      const tasksWithoutFolderName = [];

      Object.entries(tasksData).forEach(([taskId, task]) => {
        if (task.hasOwnProperty("FolderName")) {
          tasksWithFolderName.push({
            id: taskId,
            ...task,
          });
        } else {
          tasksWithoutFolderName.push({
            id: taskId,
            ...task,
          });
        }
      });

      setTasks([...tasksWithFolderName, ...tasksWithoutFolderName]);

      console.log("Tasks with FolderName:", tasksWithFolderName);
      console.log("Tasks without FolderName:", tasksWithoutFolderName);
    });

    return () => {
      unsubscribeReviewers();
      unsubscribeAnnouncements();
      unsubscribeScores();
      unsubscribeFolders();
      unsubscribeTasks();
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

  const handleDeleteItem = () => {
    if (deleteItemId && deleteItemId.id && deleteItemId.type) {
      const { id, type } = deleteItemId;

      let itemRef;
      switch (type) {
        case "Reviewer":
          itemRef = ref(database, `Reviewer/${id}`);
          break;
        case "Announcement":
          itemRef = ref(database, `Announcement/${id}`);
          break;
        default:
          console.error("Invalid item type for deletion");
          return;
      }

      remove(itemRef)
        .then(() => {
          console.log("Item deleted successfully");
          setShowDeleteConfirmation(false);
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    } else {
      console.error("No valid item selected for deletion");
    }
  };

  const handleTabChange = (key) => {
    if (key === "calendar") {
      setCalendarKey(Date.now()); // Update calendar key to force remount
    }
  };

  const deleteFolder = (folderId) => {
    const tasksToDeleteRef = ref(database, "Tasks");
    const tasksToDeleteQuery = query(
      tasksToDeleteRef,
      orderByChild("FolderName"),
      equalTo(folderId)
    );

    get(tasksToDeleteQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const tasksToDelete = snapshot.val();
          Object.keys(tasksToDelete).forEach((taskId) => {
            const taskRef = ref(database, `Tasks/${taskId}`);
            remove(taskRef)
              .then(() => {
                console.log(
                  `Task ${taskId} associated with folder ${folderId} deleted successfully`
                );
              })
              .catch((error) => {
                console.error(`Error deleting task ${taskId}:`, error);
              });
          });
        }
      })
      .catch((error) => {
        console.error("Error retrieving tasks:", error);
      });

    const folderRef = ref(
      database,
      `Folders/${selectedCourse.uid}/${folderId}`
    );
    remove(folderRef)
      .then(() => {
        console.log(`Folder ${folderId} deleted successfully`);
      })
      .catch((error) => {
        console.error("Error deleting folder:", error);
      });
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
                onSelect={handleTabChange}
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
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      onClick={handleOpenCreateFolder}
                    >
                      <AddIcon /> Create Folder
                    </Link>
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      href="http://localhost:3080/static/web-ui/server/1/projects"
                    >
                      <PublicIcon /> GNS3 Web GUI
                    </Link>
                  </Breadcrumbs>

                  <CreateTaskModal
                    show={showCreateTaskModal}
                    onHide={handleCloseCreateTaskModal}
                    selectedCourse={selectedCourse}
                  />
                  <CreateFolder
                    show={showCreateFolder}
                    onHide={handleCloseCreateFolder}
                    selectedCourse={selectedCourse}
                  />

                  <hr />

                  {reviewersWithoutFolderName.map((reviewer) => (
                    <Card
                      onClick={() => handleOpenReviewerModal(reviewer)}
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
                            onClick={() =>
                              handleDeleteConfirmation({
                                id: reviewer.id,
                                type: "Reviewer",
                              })
                            }
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}

                  {selectedReviewer && (
                    <ReviewerModal
                      show={selectedReviewer !== null}
                      onHide={handleCloseReviewerModal}
                      reviewer={selectedReviewer}
                    />
                  )}

                  <FolderProf
                    folders={folders}
                    selectedCourse={selectedCourse}
                    tasks={tasks}
                    reviewers={reviewers}
                    deleteFolder={deleteFolder}
                  />
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
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            <ArticleIcon className="me-2" />
                            {announcements.title} - Due Date:
                            {announcements.date}
                          </span>

                          <DeleteIcon
                            color="error"
                            className="cursor-pointer"
                            onClick={() =>
                              handleDeleteConfirmation({
                                id: announcements.id,
                                type: "Announcement",
                              })
                            }
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Tab>
                <Tab eventKey="calendar" title="Calendar">
                  <div id="calendar" style={{ margin: "20px" }}>
                    <FullCalendar
                      key={calendarKey}
                      ref={calendarRef}
                      plugins={[dayGridPlugin]}
                      initialView={"dayGridWeek"}
                      height="69vh"
                      events={reviewerActivity.map((reviewer) => ({
                        title: reviewer.title,
                        date: modifyDateString(reviewer.date),
                      }))}
                    />
                  </div>
                </Tab>
                <Tab eventKey="gradeBook" title="Gradebook">
                  <Table striped bordered hover style={{ cursor: "pointer" }}>
                    <thead className="text-center">
                      <tr>
                        <th>Student Name</th>
                        <th>Task Name</th>
                        <th>Score</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {scores.map((score) => {
                        const matchedActivity = reviewerActivity.find(
                          (activity) => activity.title === score.taskName
                        );
                        const shouldDisplayScore =
                          matchedActivity !== undefined;

                        return (
                          shouldDisplayScore && (
                            <tr
                              key={score.id}
                              onClick={() => handleOpenScoreView(score)}
                            >
                              <td>{score.studentName}</td>
                              <td>{score.taskName}</td>
                              <td>{score.score}</td>
                              <td>
                                <VisibilityIcon />
                              </td>
                            </tr>
                          )
                        );
                      })}

                      <ProfScoreView
                        show={selectedScore != null}
                        onHide={handleCloseScoreView}
                        score={selectedScore}
                      />
                    </tbody>
                  </Table>
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

      {/* Delete confirmation modal */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProfessorOffcanvas;
