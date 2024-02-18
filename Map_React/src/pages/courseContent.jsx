import React, { useEffect, useState } from 'react'
import { Container, Card, Col, Row, Tab, Tabs } from 'react-bootstrap'
import AddIcon from '@mui/icons-material/Add'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { database } from '../services/Firebase'
import { ref, onValue } from 'firebase/database'
import useAuth from '../services/Auth'

function CourseContent() {
  return (
    <Container fluid style={{ paddingLeft: '18%', paddingRight: '5%' }}>
      <h1>Course Name</h1>
      <div className="mt-5">
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="Content">
            Course Content
            <hr/>
            <Card className='title-header'>
                <Card.Body>
                  <h3>taskName</h3>
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
    </Container>
  )
}
export default CourseContent
