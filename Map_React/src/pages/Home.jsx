import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Row, Modal, Button, Spinner, Image } from 'react-bootstrap'; // Import Spinner from react-bootstrap
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [hideCancel, setHideCancel] = useState(false);

  useEffect(() => {
    const fetchStudentData = () => {
      if (!currentUser) return;
      const studentRef = ref(database, 'students/' + currentUser.uid);
      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();
        setStudentData(studentData);

        //TODO:
        // MAP STUDENT DATA HERE TO LOCAL STORAGE

        // console.log(studentData.name)
      });
    };

    const fetchTasks = () => {
      if (!currentUser) return;
      const tasksRef = ref(database, 'Task');
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
                taskName: task.taskName
              });
            }
          });
          setTasks(tasksArray);
        }
      });
    };

    fetchStudentData();
    fetchTasks();

    return () => {
    };
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
    <Container fluid style={{ paddingLeft: '13%', paddingRight: '1%' }}>
      <div style={{ width: '100%' }}>
      <Card style={{ width: '40%' }} className="d-flex mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={1}>
          <Image className="" src="/profile.png" style={{ width: '350%' }} />
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
          <Card style={{ width: '90%' }} className="mt-5 ms-5 p-5 title-header bg-light">
            <FilterAltIcon />
            {tasks.map((task) => (
              <Card
                key={task.id}
                onClick={() => handleTaskClick(task)} // Handle click on the task card
                style={{cursor: "pointer"}}
                border="warning"
                className="mt-4 p-3 title-header"
              >
                <h4 className="ms-4 mb-1">{task.Course}</h4>
                <p className="ms-4 mb-1">Task Name: {task.taskName}</p>
                <p className="ms-4 mb-1 text-danger">Due Date: {task.dueDate}</p>
              </Card>
            ))}
          </Card>
        </Col>
        <Col sm={4}>
          <Card className="mt-5 ms-5 p-5 title-header bg-light">
            Progress Report
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to answer this question?
        </Modal.Body>
        <Modal.Footer>
          { !hideCancel &&
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          }
          <Button variant="primary" onClick={handleModalConfirm}>
            {showSpinner ? <Spinner animation="border" size="sm" /> : 'Confirm'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default HomePage;
