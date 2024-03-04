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
  Row,
} from "react-bootstrap";
import "../../index.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ArticleIcon from "@mui/icons-material/Article";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";
import "../../index.css";

import CreateTaskModal from "./ModalCreateTask";
import CreateAnnouncementModal from "./CreateAnnouncement";
import ReviewerModal from "./ReviewerModal";
import EnumerationModal from "./EnumerationModal";

// Firebase
import { database, storage, auth } from "../../services/Firebase";
import { ref, onValue, update, push, remove, get } from "firebase/database";
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
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [scores, setScores] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [selectedEnumeration, setSelectedEnumeration] = useState(null);
  const [enumerations, setEnumerations] = useState([]);
  const [enumActivities, setEnumActivities] = useState({});

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

  const handleOpenReviewerModal = (reviewer) => {
    setSelectedReviewer(reviewer);
  };

  const handleCloseReviewerModal = () => {
    setSelectedReviewer(null);
  };

  const handleOpenEnumerationrModal = (enumerationId) => {
    setSelectedEnumeration(enumerationId);
  };

  const handleCloseEnumerationModal = () => {
    setSelectedEnumeration(null);
  };

  const handleToggleExpansion = (id) => {
    setReviewerActivity((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, isExpanded: !activity.isExpanded }
          : activity
      )
    );
  };

  const toggleEnumerationExpansion = (enumerationId) => {
    setEnumerations((prevEnumerations) =>
      prevEnumerations.map((enumeration) =>
        enumeration.id === enumerationId
          ? { ...enumeration, isExpanded: !enumeration.isExpanded }
          : enumeration
      )
    );
  };

  const handleDeleteConfirmation = (itemId) => {
    setDeleteItemId(itemId);
    setShowDeleteConfirmation(true);
  };

  useEffect(() => {
    const reviewersRef = ref(database, "Reviewer");
    const reviewerActivityRef = ref(database, "ReviewerActivity");
    const announcementsRef = ref(database, "Announcement");
    const scoresRef = ref(database, "Score");
    const enumerationsRef = ref(database, "Enumeration");

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

        reviewerActivityArray.forEach(async (activity) => {
          const activitiesRef = ref(
            database,
            `ReviewerActivity/${activity.id}/activities`
          );
          const activitiesSnapshot = await get(activitiesRef);
          const activitiesData = activitiesSnapshot.val() || {};

          const activitiesArray = Object.entries(activitiesData).map(
            ([activityId, activityData]) => ({
              id: activityId,
              ...activityData,
            })
          );

          activity.activities = activitiesArray;
        });

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

    const unsubscribeScores = onValue(scoresRef, (snapshot) => {
      const scoresData = snapshot.val() || {};
      const scoresArray = [];

      Object.entries(scoresData).forEach(([key, value]) => {
        const { score, studentName, taskName } = value;

        scoresArray.push({ id: key, score, studentName, taskName });
      });

      setScores(scoresArray);
    });

    const unsubscribeEnumerations = onValue(enumerationsRef, (snapshot) => {
      const enumerationsData = snapshot.val() || {};
      const enumerationsArray = [];
      const activitiesObject = {};

      Object.entries(enumerationsData).forEach(
        ([enumerationId, enumeration]) => {
          if (enumeration.Course === selectedCourse.uid) {
            enumerationsArray.push({ id: enumerationId, ...enumeration });
            const enumActivitiesRef = ref(
              database,
              `Enumeration/${enumerationId}/activities`
            );
            onValue(enumActivitiesRef, (snapshot) => {
              const activitiesData = snapshot.val() || {};
              activitiesObject[enumerationId] = activitiesData;
              setEnumActivities(activitiesObject);
            });
          }
        }
      );

      setEnumerations(enumerationsArray);
    });

    return () => {
      unsubscribeReviewers();
      unsubscribeReviewerActivity();
      unsubscribeAnnouncements();
      unsubscribeScores();
      unsubscribeEnumerations();
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
        case "ReviewerActivity":
          itemRef = ref(database, `ReviewerActivity/${id}`);
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
                  {reviewers.map((reviewer) => (
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

                  {reviewerActivity.map((activity) => (
                    <Card
                      key={activity.id}
                      className="title-header mt-3 cursor-pointer"
                      onClick={() => handleToggleExpansion(activity.id)}
                    >
                      <Card.Header className="p-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            <ListAltIcon className="me-2" />
                            {activity.title} - Date: {activity.date}
                          </span>
                          <div className="d-flex align-items-center">
                            <DeleteIcon
                              color="error"
                              className="cursor-pointer"
                              onClick={() =>
                                handleDeleteConfirmation({
                                  id: activity.id,
                                  type: "ReviewerActivity",
                                })
                              }
                            />
                          </div>
                        </div>
                      </Card.Header>
                      {activity.isExpanded && (
                        <Card.Body>
                          {Array.isArray(activity.activities) &&
                            activity.activities.map((subActivity) => (
                              <Typography className="ms-4 mb-2" variant="body2">
                                <div key={subActivity.id}>
                                  <div className="hoverable">
                                    {subActivity.questionType}
                                  </div>
                                </div>
                              </Typography>
                            ))}
                        </Card.Body>
                      )}
                    </Card>
                  ))}

                  {enumerations.map((enumeration) => (
                    <Card
                      key={enumeration.id}
                      className="title-header mt-3 cursor-pointer"
                      onClick={(e) =>
                        toggleEnumerationExpansion(enumeration.id)
                      }
                    >
                      <Card.Header className="p-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <span>
                            <ListAltIcon className="me-2" />
                            {enumeration.title} - Date: {enumeration.date}
                          </span>
                          <div className="d-flex align-items-center">
                            <DeleteIcon
                              color="error"
                              className="cursor-pointer"
                              onClick={() =>
                                handleDeleteConfirmation({
                                  id: enumeration.id,
                                  type: "Enumeration",
                                })
                              }
                            />
                          </div>
                        </div>
                      </Card.Header>
                      {enumeration.isExpanded && (
                        <Card.Body>
                          <Typography className="ms-4" variant="body2">
                            {enumActivities[enumeration.id] &&
                              Object.values(enumActivities[enumeration.id]).map(
                                (activityEnum) => (
                                  <div key={activityEnum.id}>
                                    <div
                                      className="hoverable"
                                      onClick={() =>
                                        handleOpenEnumerationrModal(
                                          enumeration.id
                                        )
                                      }
                                    >
                                      {activityEnum.questionType}
                                    </div>
                                  </div>
                                )
                              )}
                          </Typography>
                        </Card.Body>
                      )}
                      {selectedEnumeration === enumeration.id && (
                        <EnumerationModal
                          show={selectedEnumeration === enumeration.id}
                          onHide={handleCloseEnumerationModal}
                          enumeration={enumeration}
                        />
                      )}
                    </Card>
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
                  Tab content for Calendar
                </Tab>
                <Tab eventKey="gradeBook" title="Gradebook">
                  <Table striped bordered hover>
                    <thead className="text-center">
                      <tr>
                        <th>Student Name</th>
                        <th>Task Name</th>
                        <th>Score</th>
                        {/* <th>Action</th> */}
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
                            <tr key={score.id}>
                              <td>{score.studentName}</td>
                              <td>{score.taskName}</td>
                              <td>{score.score}</td>
                              {/* <td>
                                <VisibilityIcon />
                              </td> */}
                            </tr>
                          )
                        );
                      })}
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
