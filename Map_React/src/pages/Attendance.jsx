import React, { useEffect, useState } from 'react'
import { Container, Card, Col, Row, Tab, Tabs, Table } from 'react-bootstrap'
import { database } from '../services/Firebase'
import { ref, onValue, remove, update,get } from 'firebase/database'
import VerifiedIcon from '@mui/icons-material/Verified'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import Tooltip from '@mui/material/Tooltip'

function AttendanceRecord() {
  const [dispatcherAttendance, setDispatcherAttendance] = useState([]);

  useEffect(() => {
    const attendanceRef = ref(database, 'dispatchRecords');
  
    onValue(attendanceRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const attendanceArray = [];
  
          // Group by driverName, date, and aggregate time and timeOut
          Object.entries(data).forEach(([date, times]) => {
            Object.entries(times).forEach(([time, drivers]) => {
              Object.entries(drivers).forEach(([driverName, record]) => {
                const existingRecordIndex = attendanceArray.findIndex(
                  (item) => item.driverName === driverName && item.date === date
                );
  
                if (existingRecordIndex !== -1) {
                  // If a record with the same name and date exists, update time and timeOut
                  attendanceArray[existingRecordIndex].time += `, ${time}`;
                  attendanceArray[existingRecordIndex].timeOut += ` ${record.timeOut || ''}`;
                } else {
                  // Otherwise, create a new record
                  attendanceArray.push({
                    driverName,
                    date,
                    time,
                    timeOut: record.timeOut || '',
                  });
                }
              });
            });
          });
  
          setDispatcherAttendance(attendanceArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });
  
    // Clean up the listener when the component unmounts
    return () => {
      // Remove the listener or perform any cleanup
    };
  }, []);

  return (
    <Container fluid style={{ paddingLeft: '13%', paddingRight: '1%' }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Attendance Record</b>
              </h3>
              <p className="text-muted">
                View detailed attendance records effortlessly
              </p>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Card>
      <Card className="mt-4 ms-5 p-5 title-header">
        <Tabs
          defaultActiveKey="teller"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="teller" title="Teller Attendance">
            Teller Attendance
          </Tab>
          <Tab eventKey="dispatch" title="Dispatcher Attendance">
          <Table className="text-center" striped bordered hover>
          <thead style={{ cursor: 'pointer' }}>
            <tr>
              <th>
                Name <SwapVertIcon />
              </th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
            </tr>
          </thead>
          <tbody>
  {dispatcherAttendance.map((record, index) => (
    <tr key={index}>
      <td>{record.driverName}</td>
      <td>{record.date}</td>
      <td>{record.time}</td>
      <td>{record.timeOut || 'Not available'}</td>
    </tr>
  ))}
</tbody>
        </Table>
          </Tab>
        </Tabs>
      </Card>
    </Container>
  )
}

export default AttendanceRecord
