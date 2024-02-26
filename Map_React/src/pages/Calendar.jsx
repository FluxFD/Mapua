import {useState, useEffect} from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";


function Calendar() {

  return (
    <Container fluid style={{ paddingLeft: "15%", paddingRight: "1%" }}>
      <Card style={{ margin: "20px", maxHeight: "95vh" }}>
        <div id="calendar" style={{ margin: "20px" }}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="35rem"
            // events={[]}
          />
        </div>
      </Card>
    </Container>
  );
}

export default Calendar;
