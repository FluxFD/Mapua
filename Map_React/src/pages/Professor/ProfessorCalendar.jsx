import { useState, useEffect, useRef } from "react";
import { Container, Card } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

import useAuth from "../../services/Auth";
import { database } from "../../services/Firebase";
import { ref, onValue } from "firebase/database";

function ProfessorCalendar() {
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      const eventsRef = ref(database, "Tasks");
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedEvents = Object.keys(data).map((key) => {
            const [month, day, year] = data[key].date.split("/");
            const parsedDate = new Date(year, month - 1, day);

            return {
              taskName: data[key].title,
              dueDate: parsedDate,
            };
          });
          console.log("Fetched events:", formattedEvents);
          setEvents(formattedEvents);
        }
      });
    };

    fetchData();
    return () => {};
  }, [currentUser]);

  const handleDateClick = (info) => {
    setCurrentView("dayGridDay"); // Change the view to dayGridDay
    calendarRef.current.getApi().gotoDate(info.date); // Go to the clicked date
    calendarRef.current.getApi().changeView(currentView);
  };

  return (
    <Container fluid style={{ paddingLeft: "15%", paddingRight: "1%" }}>
      <Card style={{ margin: "20px", maxHeight: "100vh", height: "95vh" }}>
        <div id="calendar" style={{ margin: "20px", cursor: "pointer" }}>
          <FullCalendar
            dateClick={handleDateClick}
            plugins={[dayGridPlugin, interactionPlugin, bootstrap5Plugin]}
            ref={calendarRef}
            headerToolbar={{
              left: "title,prev,next",
              right: "dayGridDay,dayGridMonth",
            }}
            height="90vh"
            initialView="dayGridMonth"
            events={events}
            eventDisplay="block"
            eventContent={(eventInfo) => {
              const eventDate = eventInfo.event.start;
              const formattedDate = `${
                eventDate.getMonth() + 1
              }/${eventDate.getDate()}/${eventDate.getFullYear()}`;
              const isPastEvent = eventDate < new Date();
              return {
                html: `<div style="text-align: center; padding: 3px; color: "white"};"><div>${eventInfo.event.title}</div><div>${formattedDate}</div></div>`,
              };
            }}
          />
        </div>
      </Card>
    </Container>
  );
}

export default ProfessorCalendar;
