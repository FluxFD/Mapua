import React, { useEffect, useState } from 'react';
import { Modal, Button, Tab, Tabs, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { database } from '../services/Firebase';
import { ref, onValue } from 'firebase/database';
import useAuth from '../services/Auth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TaskDetailsPage from './TaskDetailsPage';

function CourseModal({ course, show, handleClose }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
  
    const tasksRef = ref(database, 'Task');
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val();
      const tasksArray = [];
  
      snapshot.forEach((childSnapshot) => {
        const task = childSnapshot.val();
        task.id = childSnapshot.key;
        tasksArray.push(task);
      });
  
      const filteredTasks = tasksArray.filter(task => task.Course === course.id);
      setTasks(filteredTasks);
    });
  
    return () => {
    };
  }, [course.id, currentUser]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{course.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-1">
          <Tabs
            defaultActiveKey="home"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="home" title="Content">
              Course Content
              <hr/>
              {tasks.map(task => (
                <Card key={task.id} className='title-header mt-3'>
                  <Card.Body>
                    <ListAltIcon />
                    <Link to={`/task/${task.id}/${task.taskName}`}>{task.taskName}</Link> - Due Date: {task.dueDate}
                  </Card.Body>
                </Card>
              ))}
            </Tab>
            <Tab eventKey="profile" title="Announcement">
              Tab content for Profile
            </Tab>
            <Tab eventKey="contact" title="Calendar" >
              Tab content for Contact
            </Tab>
            <Tab eventKey="gradebook" title="Gradebook" >
              Tab content for Contact
            </Tab>
          </Tabs>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CourseModal;
