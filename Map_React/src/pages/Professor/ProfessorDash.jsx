// ProfessorDashboard.js
import React, { useState, useEffect, useRef } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import "../../index.css";
import { Link, useNavigate } from "react-router-dom";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import { database } from "../../services/Firebase";
import { ref, onValue, off, set, update, push } from "firebase/database";

function ProfessorDashboard({ onMessageClick }) {
  const [latestMessages, setLatestMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(database, "Message");

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messageData = snapshot.val();
      if (messageData) {
        const messageList = Object.keys(messageData).map((key) => ({
          id: key,
          ...messageData[key],
        }));
        messageList.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        const top5Messages = messageList.slice(0, 5);
        setLatestMessages(top5Messages);
      } else {
        setLatestMessages([]);
      }
    });

    return () => {
      off(messagesRef, "value", unsubscribe);
    };
  }, []);

  const handleMessageClick = (messageId) => {
    onMessageClick(messageId);
  };

  return (
    <Container fluid style={{ paddingLeft: "18%", paddingRight: "5%" }}>
      <Row className="mt-5 d-flex justify-content-evenly align-items-center ">
        <div className="ms-5 ">
          <Breadcrumbs aria-label="breadcrumb" style={{ color: "white" }}>
            <Typography underline="hover" color="white">
              Dashboard
            </Typography>
            <Typography underline="hover" color="white">
              Message
            </Typography>
          </Breadcrumbs>
        </div>
        <Card className="title-header ms-5 p-3">
          <div className="mb-2">
            <h5>
              <b>Latest</b>
            </h5>
          </div>
          {latestMessages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleMessageClick(message.id)}
            >
              <Card
                className="title-header p-3 mb-2"
                style={{ cursor: "pointer" }}
              >
                <b>{message.name}</b>
                <p>{message.date}</p>
              </Card>
            </div>
          ))}
        </Card>
      </Row>
    </Container>
  );
}

export default ProfessorDashboard;
