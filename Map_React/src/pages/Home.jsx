import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";

function HomePage() {
  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Dashboard</b>
              </h3>
              <p className="text-muted">Graphical Data Overview</p>
            </div>
          </Col>
          <Col>
            {/* <Button variant="primary">
              <AddIcon className="" /> Add Event
            </Button> */}
          </Col>
        </Row>
      </Card>
      <Row className="d-flex align-items-center">
        <Col>
          <Card className="mt-4 ms-5 p-5 title-header">Graph 1</Card>
        </Col>
        <Col>
          <Card className="mt-4 ms-5 p-5 title-header">Graph 2</Card>
        </Col>
        <Col>
          <Row>
            <Col>
              <Card className="mt-4 ms-5 p-5 title-header">Graph 3</Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mt-4 ms-5 p-5 title-header">
            <Row className="text-center">
              <Col>Graph 4</Col>
              <Col>Graph 5</Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
