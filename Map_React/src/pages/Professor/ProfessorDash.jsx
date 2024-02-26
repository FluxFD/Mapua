import React, { useState, useEffect, useRef } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import "../../index.css";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

function ProfessorDashboard() {
  return (
    <Container fluid style={{ paddingLeft: "18%", paddingRight: "5%" }}>
      <Row className="mt-5 d-flex justify-content-evenly align-items-center ">
        <Col sm={8}>
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

            <Card className="title-header p-3">
              <b>Message Title</b>
              <p>Date & Time</p>
            </Card>
          </Card>
        </Col>
        <Col>
          <Card className="title-header p-3">
            <p>test</p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfessorDashboard;
