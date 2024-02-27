import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Col,
  Row,
  Modal,
  Button,
  Spinner,
  Image,
} from "react-bootstrap"; // Import Spinner from react-bootstrap
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { database } from "../services/Firebase";
import { ref, onValue } from "firebase/database";
import useAuth from "../services/Auth";

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [modules, setModules] = useState(0);
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [hideCancel, setHideCancel] = useState(false);

  useEffect(() => {
    const fetchStudentData = () => {
      if (!currentUser) return;
      const studentRef = ref(database, "students/" + currentUser.uid);
      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();
        setStudentData(studentData);
      });
    };

    const fetchModules = () => {
      if (!currentUser) return;
      const modulesRef = ref(database, "Reviewer");
      onValue(modulesRef, (snapshot) => {
        const modulesData = snapshot.val();
        setModules(modulesData);
        console.log(modulesData);
      });
    };

    const fetchCourses = () => {
      if (!currentUser) {
        setCourses([]);
        return;
      }
      const coursesRef = ref(database, "Course");
      onValue(coursesRef, (snapshot) => {
        const coursesData = snapshot.val();
        if (coursesData) {
          const coursesArray = Object.keys(coursesData).map((courseId) => {
            const course = coursesData[courseId];
            const studies = Object.keys(course).map((studyId) => ({
              id: studyId,
              dueDate: course[studyId].dueDate,
            }));
            return {
              id: courseId,
              studies: studies,
            };
          });
          setCourses(coursesArray);
        }
      });
    };

    const fetchTasks = () => {
      if (!currentUser) return;
      const tasksRef = ref(database, "Task");
      onValue(tasksRef, (snapshot) => {
        const tasksData = snapshot.val();
        if (tasksData) {
          const tasksArray = [];
          Object.entries(tasksData).forEach(([taskId, task]) => {
            const dueDate = new Date(task.dueDate);
            const currentDate = new Date();
            const timeDifference = dueDate.getTime() - currentDate.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);

            if (daysDifference <= 2) {
              tasksArray.push({
                id: taskId,
                Course: task.Course,
                dueDate: task.dueDate,
                taskName: task.taskName,
              });
            }
          });
          setTasks(tasksArray);
          // console.log(tasks);
        }
      });
    };

    fetchStudentData();
    fetchTasks();
    fetchCourses();
    fetchModules();

    return () => {};
  }, [currentUser]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowSpinner(true);
    setHideCancel(true);
    setTimeout(() => {
      setShowSpinner(false);
      setShowModal(false);
      if (selectedTask) {
        window.location.href = `/task/${selectedTask.id}/${selectedTask.taskName}`;
      }
    }, 3000);
  };

  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <div style={{ width: "100%" }}>
        <Card
          style={{ width: "40%" }}
          className="d-flex mt-5 ms-5 p-3 title-header"
        >
          <Row className="d-flex justify-content-evenly align-items-center ">
            <Col sm={1}>
              <Image
                className=""
                src="/profile.png"
                style={{ width: "350%" }}
              />
            </Col>
            <Col sm={10}>
              <div className="ms-5">
                {studentData && (
                  <>
                    <h3>
                      <b>{studentData.name}</b>
                    </h3>
                    <p className="text-muted">{studentData.studentNo}</p>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      <Row className="d-flex align-items-center">
        <Col sm={8}>
          <Card
            style={{ width: "90%" }}
            className="mt-5 ms-5 p-5 title-header bg-light"
          >
            <FilterAltIcon />
            <div style={{ height: "62vh", overflowY: "scroll" }}>
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  onClick={() => handleTaskClick(task)} // Handle click on the task card
                  style={{ cursor: "pointer", width: "97%" }}
                  border="warning"
                  className="mt-4 p-3 title-header"
                >
                  <h4 className="ms-4 mb-1">{task.Course}</h4>
                  <p className="ms-4 mb-1">Task Name: {task.taskName}</p>
                  <p className="ms-4 mb-1 text-danger">
                    Due Date: {task.dueDate}
                  </p>
                </Card>
              ))}
            </div>
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="mt-5 ms-5 p-5 title-header bg-light">
            <h4>Progress Report</h4>
            <div
              style={{
                height: "60vh",
                width: "100%",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >
              {currentUser &&
  courses.map((course) => (
    <Row key={course.id} className="mb-4">
      <Col md={12}>
        <Card className="title-header" style={{ width: "97%" }}>
          <Card.Body>
            <h5>{course.id}</h5>
            <div overflow="auto" style={{ display: "flex" }}>
              <div
                id="materials-count"
                style={{
                  display: "inline-block",
                  width: "70rem",
                }}
              >
                <div id="module-count">
                  Modules: {course.studies.length}
                </div>
                <div id="excercises-count">Excercises: 00/10</div>
                <div id="assessment-count">Assessment: 00/10</div>
              </div>
              <div
                id="items-due"
                style={{
                  display: "inline-block",
                  width: "30rem",
                }}
              >
                <div id="items-due-count" style={{ textAlign: "center" }}>
                  00
                </div>
                <div style={{ textAlign: "center" }}>Past Due</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  ))}

            </div>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to answer this question?</Modal.Body>
        <Modal.Footer>
          {!hideCancel && (
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          )}
          <Button variant="primary" onClick={handleModalConfirm}>
            {showSpinner ? <Spinner animation="border" size="sm" /> : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default HomePage;
