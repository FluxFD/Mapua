import React from "react";
import { Container, Card, Col, Row, Tab, Tabs, Button } from "react-bootstrap";

// icons
import AddIcon from "@mui/icons-material/Add";

function MaintenanceRecord() {
  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Maintenance Record</b>
              </h3>
              <p className="text-muted">
                Explore and manage a comprehensive log of maintenance records
                with ease
              </p>
            </div>
          </Col>
          <Col>
            <Button variant="primary">
              <AddIcon className="" /> Add Record
            </Button>
          </Col>
        </Row>
      </Card>
      <Card className="mt-4 ms-5 p-5 title-header">
        <Tabs
          defaultActiveKey="preventive"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="preventive" title="Preventive Record">
            Preventive Record
          </Tab>
          <Tab eventKey="corrective" title="Corrective Record">
            Corrective Record
          </Tab>
          <Tab eventKey="exception" title="Exception Record">
            Exception Record
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
}

export default MaintenanceRecord;
