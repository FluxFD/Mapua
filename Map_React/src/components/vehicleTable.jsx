import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Dropdown,
  Modal,
  Form,
  Col,
  Row,
} from "react-bootstrap";
import { database } from "../services/Firebase";
import { ref, onValue, set, update } from "firebase/database";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";

// icons
import IconButton from "@mui/material/IconButton";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function VehicleTable() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [deployedVehicleData, setDeployedVehicleData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePlateNumber, setDeletePlateNumber] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);

  const [editedData, setEditedData] = useState({
    deploymentStatus: "",
    model: "",
    plateNumber: "",
    scheduledTimes: [],
    scheduledDay: "",
    seatsAvailable: 0,
    status: "",
  });

  const handleShowEditModal = (vehicle) => {
    setEditedData({
      deploymentStatus: vehicle.deploymentStatus,
      model: vehicle.model,
      plateNumber: vehicle.plateNumber,
      scheduledTimes: vehicle.scheduledTimes || [],
      scheduledDay: vehicle.scheduledDay,
      seatsAvailable: vehicle.seatsAvailable || 0,
      status: vehicle.status,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditedData({
      deploymentStatus: "",
      model: "",
      plateNumber: "",
      scheduledTimes: [],
      scheduledDay: "",
      seatsAvailable: 0,
      status: "",
    });
  };

  const handleEditChanges = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleEdit = async () => {
    try {
      const plateNumberToDelete = editedData.plateNumber;
      await set(ref(database, `vehicleRegForm/${plateNumberToDelete}`), null);
      if (deployedVehicleData[plateNumberToDelete]) {
        await set(
          ref(database, `deployedVehicles/${plateNumberToDelete}`),
          null
        );
      }

      await set(ref(database, `availableSeats/${plateNumberToDelete}`), null);

      setVehicles((prevVehicles) =>
        prevVehicles.filter(
          (vehicle) => vehicle.plateNumber !== plateNumberToDelete
        )
      );
      const {
        plateNumber,
        model,
        seatsAvailable,
        scheduledTimes,
        scheduledDay,
        status,
        deploymentStatus,
      } = editedData;

      await set(ref(database, `vehicleRegForm/${plateNumber}`), {
        plateNumber,
        model,
        seatsAvailable,
        scheduledTimes,
        scheduledDay,
        status,
        deploymentStatus: deploymentStatus || "Inactive",
      });

      toast.success("Vehicle edited successfully");
    } catch (error) {
      console.error("Error editing vehicle:", error);
      toast.error("Error editing vehicle");
    } finally {
      handleCloseEditModal();
    }
  };

  const handleShowDeleteModal = (plateNumber) => {
    setDeletePlateNumber(plateNumber);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePlateNumber(null);
  };

  const handleDelete = async () => {
    try {
      const plateNumberToDelete = deletePlateNumber;
      await set(ref(database, `vehicleRegForm/${plateNumberToDelete}`), null);

      if (deployedVehicleData[plateNumberToDelete]) {
        await set(
          ref(database, `deployedVehicles/${plateNumberToDelete}`),
          null
        );
      }

      await set(ref(database, `availableSeats/${plateNumberToDelete}`), null);

      setVehicles((prevVehicles) =>
        prevVehicles.filter(
          (vehicle) => vehicle.plateNumber !== plateNumberToDelete
        )
      );

      toast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Error deleting vehicle");
    } finally {
      handleCloseDeleteModal();
    }
  };

  useEffect(() => {
    const deployedVehiclesRef = ref(database, "deployedVehicles");

    onValue(deployedVehiclesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDeployedVehicleData(data);
      } else {
        setDeployedVehicleData({});
      }
    });
  }, []);

  const handleDeploy = (plateNumber, deploymentStatus) => {
    if (deploymentStatus === "Inactive") {
      const selectedVehicle = vehicles.find(
        (vehicle) => vehicle.plateNumber === plateNumber
      );

      if (selectedVehicle) {
        const {
          plateNumber,
          model,
          seatsAvailable,
          selectedDriver,
          selectedRoute,
          selectedTime,
        } = selectedVehicle;

        if (!selectedTime || !selectedDriver || !selectedRoute) {
          toast.error("Fill all the fields to deploy vehicle");
          return;
        }

        if (isDriverLicenseExpired(selectedDriver)) {
          const driver = drivers.find(
            (driver) => driver.fname === selectedDriver
          );
          toast.error(`${driver.fname}'s license has expired`);
          return;
        }

        const deployedVehicleData = {
          plateNumber,
          model,
          seatsAvailable,
          selectedDriver,
          selectedRoute,
          selectedTime,
        };

        set(
          ref(database, `deployedVehicles/${plateNumber}`),
          deployedVehicleData
        )
          .then(() => {
            return update(ref(database, `vehicleRegForm/${plateNumber}`), {
              deploymentStatus: "Deployed",
            });
          })
          .then(() => {
            setVehicles((prevVehicles) =>
              prevVehicles.map((vehicle) =>
                vehicle.plateNumber === plateNumber
                  ? { ...vehicle, deploymentStatus: "Deployed" }
                  : vehicle
              )
            );

            const seatsCollectionRef = ref(
              database,
              `availableSeats/${plateNumber}/seats`
            );
            const seatsData = Array.from(
              { length: seatsAvailable },
              (_, index) => ({
                status: "Available",
              })
            );

            const seatsUpdate = Object.fromEntries(
              seatsData.map((s, index) => {
                return [`seat-${index}`, s];
              })
            );

            console.table(seatsUpdate);
            toast.success("Vehicle is now Deployed");
            return set(seatsCollectionRef, seatsUpdate);
          })
          .catch((error) => {
            console.error("Error deploying vehicle:", error);
          });
      }
    }
  };

  useEffect(() => {
    const driversRef = ref(database, "drivers");

    onValue(driversRef, (snapshot) => {
      const driverData = snapshot.val();

      if (driverData) {
        const driverArray = Object.values(driverData).map((driver) => {
          return {
            ...driver,
            licenseExpiryDate: driver.licenseExpiry || "",
          };
        });
        setDrivers(driverArray);
      } else {
        setDrivers([]);
      }
    });
  }, []);

  const isDriverLicenseExpired = (selectedDriver) => {
    const driver = drivers.find((driver) => driver.fname === selectedDriver);
    if (driver && driver.licenseExpiry) {
      const currentDate = new Date();
      const expiryDate = new Date(driver.licenseExpiry);

      return expiryDate < currentDate;
    }
    return false;
  };

  useEffect(() => {
    const vehiclesRef = ref(database, "vehicleRegForm");

    onValue(vehiclesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const vehicleArray = Object.entries(data).map(
          ([plateNumber, vehicleData]) => ({
            plateNumber,
            ...vehicleData,
            selectedRoute: "",
            selectedTime: "",
          })
        );

        setVehicles(vehicleArray);
      } else {
        setVehicles([]);
      }
    });

    return () => {};
  }, []);

  const handleRouteSelect = (plateNumber, selectedRoute) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.plateNumber === plateNumber
          ? { ...vehicle, selectedRoute }
          : vehicle
      )
    );
  };

  const handleTimeSelect = (plateNumber, selectedTime) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.plateNumber === plateNumber
          ? { ...vehicle, selectedTime }
          : vehicle
      )
    );
  };

  const handleDriverSelect = (plateNumber, selectedDriver) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((vehicle) =>
        vehicle.plateNumber === plateNumber
          ? { ...vehicle, selectedDriver }
          : vehicle
      )
    );
  };

  return (
    <>
      <Table className="mt-3" striped bordered hover>
        <thead className="text-center">
          <tr>
            <th>Vehicle Model</th>
            <th>Vehicle Plate No.</th>
            <th>Seats Available</th>
            <th>
              <Row xs={2} md={8} lg={2} className="d-flex align-items-center">
                <Col>Status</Col>
                <Col>
                  <Dropdown onSelect={(eventKey) => setStatusFilter(eventKey)}>
                    <Dropdown.Toggle
                      variant="outline-secondary"
                      size="sm"
                      id="dropdown-basic"
                    >
                      {statusFilter}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="All">All</Dropdown.Item>
                      <Dropdown.Item eventKey="Available">
                        Available
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Deployed">
                        Deployed
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Enroute">Enroute</Dropdown.Item>
                      <Dropdown.Item eventKey="Unavailable">
                        Unavailable
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Under Maintenance">
                        Under Maintenance
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Coding">Coding</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </th>
            <th>Scheduled Day</th>
            <th>Scheduled Time</th>
            <th>Driver</th>
            <th>Route</th>
            <th>Deployment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles
            .filter((vehicle) =>
              statusFilter === "All" ? true : vehicle.status === statusFilter
            )
            .map((vehicle) => (
              <tr key={vehicle.plateNumber}>
                <td>{vehicle.model}</td>
                <td>{vehicle.plateNumber}</td>
                <td>{vehicle.seatsAvailable}</td>
                <td>{vehicle.status}</td>
                <td>{vehicle.scheduledDay}</td>
                <td>
                  {vehicle.scheduledTimes &&
                  vehicle.scheduledTimes.length > 0 ? (
                    <Dropdown
                      size="sm"
                      onSelect={(eventKey) =>
                        handleTimeSelect(vehicle.plateNumber, eventKey)
                      }
                    >
                      <Dropdown.Toggle
                        size="sm"
                        variant="outline-secondary"
                        id="dropdown-basic"
                        disabled={vehicle.deploymentStatus === "Deployed"}
                      >
                        {vehicle.deploymentStatus === "Deployed"
                          ? deployedVehicleData[vehicle.plateNumber]
                              ?.selectedTime || "Select Time"
                          : vehicle.selectedTime || "Select Time"}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {vehicle.scheduledTimes.map((time) => (
                          <Dropdown.Item key={time} eventKey={time}>
                            {time}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    "No Scheduled Time"
                  )}
                </td>
                <td>
                  <Dropdown
                    onSelect={(eventKey) =>
                      handleDriverSelect(vehicle.plateNumber, eventKey)
                    }
                  >
                    <Dropdown.Toggle
                      size="sm"
                      variant="outline-secondary"
                      id="dropdown-basic"
                      disabled={vehicle.deploymentStatus === "Deployed"}
                    >
                      {vehicle.deploymentStatus === "Deployed"
                        ? deployedVehicleData[vehicle.plateNumber]
                            ?.selectedDriver || "Select Driver"
                        : vehicle.selectedDriver || "Select Driver"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {drivers.map((driver) => (
                        <Dropdown.Item
                          key={driver.fname}
                          eventKey={driver.fname}
                        >
                          {driver.fname}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Dropdown
                    onSelect={(eventKey) =>
                      handleRouteSelect(vehicle.plateNumber, eventKey)
                    }
                  >
                    <Dropdown.Toggle
                      size="sm"
                      variant="outline-secondary"
                      id="dropdown-basic"
                      disabled={vehicle.deploymentStatus === "Deployed"}
                    >
                      {vehicle.deploymentStatus === "Deployed"
                        ? deployedVehicleData[vehicle.plateNumber]
                            ?.selectedRoute || "Select Route"
                        : vehicle.selectedRoute || "Select Route"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item eventKey="Rosario">Rosario</Dropdown.Item>
                      <Dropdown.Item eventKey="Pasig">Pasig</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>{vehicle.deploymentStatus}</td>
                <td className="text-center">
                  <Tooltip
                    arrow
                    title={
                      vehicle.deploymentStatus === "Deployed"
                        ? "Deployed"
                        : "Deploy"
                    }
                  >
                    <span>
                      <IconButton
                        size="sm"
                        variant="success"
                        onClick={() => {
                          if (!isDriverLicenseExpired(vehicle.selectedDriver)) {
                            handleDeploy(
                              vehicle.plateNumber,
                              vehicle.deploymentStatus
                            );
                          } else {
                            const driver = drivers.find(
                              (driver) =>
                                driver.fname === vehicle.selectedDriver
                            );
                            toast.error(
                              `${driver.fname}'s license has expired`
                            );
                          }
                        }}
                        disabled={vehicle.deploymentStatus === "Deployed"}
                      >
                        <TimeToLeaveIcon color="success" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <EditIcon
                      className="me-2"
                      color="primary"
                      onClick={() => handleShowEditModal(vehicle)}
                    />
                  </Tooltip>

                  <Tooltip title="Delete" arrow>
                    <DeleteIcon
                      className="me-2"
                      color="error"
                      onClick={() => handleShowDeleteModal(vehicle.plateNumber)}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to permanently delete this vehicle?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Vehicle Model</Form.Label>
            <Form.Control
              type="text"
              value={editedData.model}
              onChange={(e) => handleEditChanges("model", e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Vehicle Plate Number</Form.Label>
            <Form.Control
              type="text"
              value={editedData.plateNumber}
              onChange={(e) => handleEditChanges("plateNumber", e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Seats Available:</Form.Label>
            <Form.Control
              type="number"
              value={editedData.seatsAvailable}
              onChange={(e) =>
                handleEditChanges(
                  "seatsAvailable",
                  parseInt(e.target.value, 10)
                )
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Scheduled Times:</Form.Label>
            <Form.Control
              type="time"
              value={editedData.scheduledTimes.join(", ")}
              onChange={(e) =>
                handleEditChanges("scheduledTimes", e.target.value.split(", "))
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Scheduled Day</Form.Label>
            <Form.Control
              as="select"
              value={editedData.scheduledDay}
              onChange={(e) =>
                handleEditChanges("scheduledDay", e.target.value)
              }
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
            <Form.Label>Status:</Form.Label>
            <Form.Control
              as="select"
              value={editedData.status}
              onChange={(e) => handleEditChanges("status", e.target.value)}
            >
              <option>Available</option>
              <option>Deployed</option>
              <option>Enroute</option>
              <option>Unavailable</option>
              <option>Under Maintenance</option>
              <option>Coding</option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Deployment Status:</Form.Label>
            <Form.Control
              as="select"
              value={editedData.deploymentStatus}
              onChange={(e) =>
                handleEditChanges("deploymentStatus", e.target.value)
              }
            >
              <option>Deployed</option>
              <option>Inactive</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default VehicleTable;
