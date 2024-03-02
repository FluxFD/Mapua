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
  const calendarRef = useRef(null); // Ref to access FullCalendar instance
  const [currentView, setCurrentView] = useState("dayGridMonth"); // State to hold the current view
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]); // State to hold events

  useEffect(() => {
    const fetchData = () => {
      const eventsRef = ref(database, "ReviewerActivity");
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedEvents = Object.keys(data).map((key) => {
            const [month, day, year] = data[key].date.split("/");
            const parsedDate = new Date(year, month - 1, day);

            return {
              title: data[key].title,
              date: parsedDate,
            };
          });
          console.log("Fetched events:", formattedEvents);
          setEvents(formattedEvents);
        }
      });
    };

    fetchData();
    return () => {};
  }, []);

  return (
    <Container fluid style={{ paddingLeft: "15%", paddingRight: "1%" }}>
      <Card style={{ margin: "20px", maxHeight: "100vh", height: "95vh" }}>
        <div id="calendar" style={{ margin: "20px" }}>
          <FullCalendar
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
              const isPastEvent = eventDate < new Date(); // Check if the event date is before today's date
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
