import React, { useState } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { database } from "../services/Firebase";
import { ref, set } from "firebase/database";
import VehicleTable from "../components/vehicleTable";
import { toast } from "react-toastify";

// icon
import AddIcon from "@mui/icons-material/Add";

function AssignVehiclePage() {
  const [showModal, setShowModal] = useState(false);
  const [additionalTimes, setAdditionalTimes] = useState([]);
  const [formData, setFormData] = useState({
    model: "",
    plateNumber: "",
    seatsAvailable: "",
    scheduledTimes: [],
    scheduledDay: "",
    deploymentStatus: "Inactive",
    status: "Available",
  });

  const handleAddVehicleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAdditionalTimes([]);
    setFormData({
      model: "",
      plateNumber: "",
      seatsAvailable: "",
      scheduledTimes: [],
      scheduledDay: "",
      deploymentStatus: "Inactive",
      status: "Available",
    });
  };

  const handleAddTime = () => {
    setAdditionalTimes([...additionalTimes, "00:00"]);
  };

  const handleRemoveTime = (index) => {
    const updatedTimes = [...additionalTimes];
    updatedTimes.splice(index, 1);
    setAdditionalTimes(updatedTimes);
  };

  const handleAdditionalTimeChange = (e, index) => {
    const updatedTimes = [...additionalTimes];
    updatedTimes[index] = e.target.value;
    setAdditionalTimes(updatedTimes);
  };

  const handleSave = async () => {
    try {
      const vehicleRef = ref(
        database,
        "vehicleRegForm/" + formData.plateNumber
      );
      const allTimes = [formData.scheduledTimes[0], ...additionalTimes];
      await set(vehicleRef, { ...formData, scheduledTimes: allTimes });

      setFormData({
        model: "",
        plateNumber: "",
        seatsAvailable: "",
        scheduledTimes: [],
        scheduledDay: "",
        deploymentStatus: "Inactive",
        status: "Available",
      });
      toast.success("Vehicle Created Successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
    }
  };

  const handleFormChange = (event) => {
    const { id, value } = event.target;

    if (id === "formTime") {
      setFormData((prevData) => ({
        ...prevData,
        scheduledTimes: [value, ...additionalTimes],
      }));
    } else if (id === "scheduledDay") {
      setFormData((prevData) => ({
        ...prevData,
        scheduledDay: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Vehicle Management</b>
              </h3>
              <p className="text-muted">
                Registered vehicle credentials are listed below.
              </p>
            </div>
          </Col>
          <Col>
            <Button variant="primary" onClick={handleAddVehicleClick}>
              <AddIcon className="" /> Add Vehicles
            </Button>
          </Col>
        </Row>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vehicle Model</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Vehicle Model</Form.Label>
              <Form.Control
                type="text"
                id="model"
                value={formData.model}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Vehicle Plate Number</Form.Label>
              <Form.Control
                type="text"
                id="plateNumber"
                value={formData.plateNumber}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Seats Available</Form.Label>
              <Form.Control
                type="number"
                id="seatsAvailable"
                value={formData.seatsAvailable}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Button
              className="mt-2"
              variant="outline-secondary"
              onClick={handleAddTime}
            >
              Add More Time
            </Button>

            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" onChange={(e) => handleFormChange(e)} />
            </Form.Group>

            {additionalTimes.map((time, index) => (
              <Form.Group key={index} controlId={`formAdditionalTime${index}`}>
                <Form.Label>Additional Time</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="time"
                    value={time}
                    onChange={(e) => handleAdditionalTimeChange(e, index)}
                  />
                  <Button
                    variant="outline-danger"
                    onClick={() => handleRemoveTime(index)}
                  >
                    Remove
                  </Button>
                </div>
              </Form.Group>
            ))}

            <Form.Group>
              <Form.Label>Scheduled Day</Form.Label>
              <Form.Control
                as="select"
                id="scheduledDay"
                value={formData.scheduledDay}
                onChange={handleFormChange}
              >
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                id="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option>Available</option>
                <option>Deployed</option>
                <option>Enroute</option>
                <option>Unavailable</option>
                <option>Under Maintenance</option>
                <option>Coding</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Card className="mt-4 ms-5 p-4 title-header">
        <VehicleTable />
      </Card>
    </Container>
  );
}

export default AssignVehiclePage;
