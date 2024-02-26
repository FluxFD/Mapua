import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Button,
  Modal,
  Tab,
  Tabs,
  Card,
  Offcanvas,
} from "react-bootstrap";
import "../../index.css";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CampaignIcon from "@mui/icons-material/Campaign";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import AddIcon from "@mui/icons-material/Add";

// Firebase
import { database } from "../../services/Firebase";
import { ref, onValue, off, set, update, push } from "firebase/database";

function ProfessorOffcanvas({ show, onHide, selectedCourse }) {
  const [tasks, setTasks] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [reviewerActivity, setReviewerActivity] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

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
          // Filter announcements based on the selected course
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
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      href="/"
                    >
                      <AttachFileIcon /> Upload File
                    </Link>
                    <Link
                      className="d-flex align-items-center"
                      underline="hover"
                      color="text.primary"
                      href=""
                    >
                      <AddIcon /> Create Task
                    </Link>
                  </Breadcrumbs>
                  <hr />
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      style={{ cursor: "pointer" }}
                      className="title-header mt-3"
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <ListAltIcon className="me-2" />
                          {task.taskName} - Due Date: {task.dueDate}
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
                        <div className="d-flex align-items-center">
                          <ListAltIcon className="me-2" />
                          {reviewer.title}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  {reviewerActivity.map((activity) => (
                    <Card
                      key={activity.id}
                      style={{ cursor: "pointer" }}
                      className="title-header mt-3"
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <ListAltIcon className="me-2" />
                          {activity.title} - Date: {activity.date}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </Tab>
                <Tab eventKey="announcement" title="Announcement">
                  Announcement
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
    </>
  );
}

export default ProfessorOffcanvas;
