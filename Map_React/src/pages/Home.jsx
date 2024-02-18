import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';

function HomePage() {
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentData = () => {
      if (!currentUser) return;
      const studentRef = ref(database, 'students/' + currentUser.uid);
      onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();
        setStudentData(studentData);
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
              // Only add tasks due within 2 days
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

  return (
    <Container fluid style={{ paddingLeft: '13%', paddingRight: '1%' }}>
      <Card style={{ width: '40%' }} className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={1}></Col>
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
      <Row className="d-flex align-items-center">
        <Col sm={8}>
          <Card style={{ width: '90%' }} className="mt-5 ms-5 p-5 title-header bg-light">
            <FilterAltIcon />
            {tasks.map((task) => (
              <Card
                key={task.id}
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
    </Container>
  );
}

export default HomePage;
