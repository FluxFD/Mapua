import React from 'react';
import { Modal, Button, Tab, Tabs, Card } from 'react-bootstrap';

function CourseModal({ course, show, handleClose }) {
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
            <Card className='title-header'>
                <Card.Body>
                  
                </Card.Body>
              </Card>
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
        {/* Additional buttons or actions */}
      </Modal.Footer>
    </Modal>
  );
}

export default CourseModal;
