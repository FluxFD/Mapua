import { useState, useEffect, useRef } from "react";
import { Container, Card } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import CourseModal from "./CourseModal";

import useAuth from "../services/Auth";
import { database } from "../services/Firebase";
import { ref, onValue } from "firebase/database";

function Calendar() {
  const calendarRef = useRef(null); // Ref to access FullCalendar instance
  const [currentView, setCurrentView] = useState("dayGridMonth"); // State to hold the current view
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(database, "ReviewerActivity");
    onValue(tasksRef, (snapshot) => {
      const tasksData = snapshot.val() || {};
      const tasksArray = [];

      Object.entries(tasksData).forEach(([taskId, task]) => {
        tasksArray.push({ id: taskId, ...task });
      });
      setTasks(tasksArray);
      // console.log(tasksArray);
    });
  }, [currentUser]);

  const handleDateClick = (info) => {
    setCurrentView("dayGridDay"); // Change the view to dayGridDay
    calendarRef.current.getApi().gotoDate(info.date); // Go to the clicked date
    calendarRef.current.getApi().changeView(currentView);
  };

  function modifyDateString(dateString) {
    const dateObj = new Date(dateString);
    dateObj.setUTCHours(dateObj.getUTCHours() + 8); // Adjust to UTC+8 timezone
    const isoDate = dateObj.toISOString().split("T")[0]; // Extract YYYY-MM-DD
    return isoDate;
  }

  return (
    <Container fluid style={{ paddingLeft: "15%", paddingRight: "1%" }}>
      <Card style={{ margin: "20px", maxHeight: "100vh", height: "95vh" }}>
        <div id="calendar" style={{ margin: "20px" }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
            // themeSystem="bootstrap5"
            initialView="dayGridMonth"
            ref={calendarRef}
            headerToolbar={{
              left: "title,prev,next",
              right: "dayGridDay,dayGridMonth", // user can switch between the two}
            }}
            height="90vh"
            events={tasks.map((task) => ({
              title: task.title,
              date: modifyDateString(task.date),
            }))}
            // {[
            //   { title: "event 1", date: "2024-02-01" },
            // ]}
            dateClick={handleDateClick}
            // eventClick={}
          />
        </div>
      </Card>
    </Container>
  );
}

export default Calendar;
