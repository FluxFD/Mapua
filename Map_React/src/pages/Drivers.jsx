import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Card,
  Table,
  Button,
  Form,
  Toast,
} from "react-bootstrap";
import "../index.css";
import Tooltip from "@mui/material/Tooltip";

// Icons
import AddIcon from "@mui/icons-material/Add";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";

// Firebase
import { database } from "../services/Firebase";
import {
  ref,
  onValue,
  update,
  get,
  remove,
  orderByChild,
} from "firebase/database";
import { toast } from "react-toastify";

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [verifiedDrivers, setVerifiedDrivers] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("fname");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editedDriver, setEditedDriver] = useState({
    fname: "",
    email: "",
    licenseNo: "",
    licenseExpiry: "",
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  useEffect(() => {
    const driverRef = ref(database, "drivers");

    const sortDrivers = (array, column, order) => {
      return array.slice().sort((a, b) => {
        const aValue = a[column].toLowerCase();
        const bValue = b[column].toLowerCase();
        return order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    };

    const fetchDriversData = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const driversArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        const sortedDrivers = sortDrivers(driversArray, sortBy, sortOrder);
        setDrivers(sortedDrivers);

        const verifiedDriversArray = sortedDrivers.filter(
          (driver) => driver.accountVerified === "accepted"
        );
        setVerifiedDrivers(verifiedDriversArray);
      }
    };

    const onError = (error) => {
      console.error("Error fetching data:", error);
    };

    const unsubscribe = onValue(driverRef, fetchDriversData, {
      error: onError,
    });

    return () => {
      unsubscribe();
    };
  }, [sortBy, sortOrder]);

  const handleSort = (column) => {
    if (column === sortBy) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setEditedDriver(driver);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDriver(null);
    setEditedDriver({
      fname: "",
      email: "",
      licenseNo: "",
      licenseExpiry: "",
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");

    const formattedValue = sanitizedValue
      .slice(0, 11)
      .replace(/(\w{3})(\w{2})/, "$1-$2-");

    setEditedDriver((prevDriver) => ({
      ...prevDriver,
      [name]: formattedValue,
    }));
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  const handleSaveEdits = () => {
    const driverId = selectedDriver.id;

    update(ref(database, `drivers/${driverId}`), editedDriver)
      .then(() => {
        console.log("Driver details updated successfully");
        handleCloseEditModal();
      })
      .catch((error) => {
        console.error("Error updating driver details:", error);
      });
  };

  const handleDelete = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    const driverId = driverToDelete.id;

    try {
      const selectedDriverSnapshot = await get(
        ref(database, `drivers/${driverId}`)
      );

      if (selectedDriverSnapshot.exists()) {
        const driverData = selectedDriverSnapshot.val();
        const { fname } = driverData;
        console.log("First Name:", fname);

        // Assuming deployedVehicles is another collection
        const deployedVehiclesSnapshot = await get(
          ref(database, "deployedVehicles")
        );

        if (deployedVehiclesSnapshot.exists()) {
          const deployedVehiclesData = deployedVehiclesSnapshot.val();

          // Log the entire deployedVehiclesData
          // console.log("All deployedVehiclesData:", deployedVehiclesData);

          // Check if fname exists in deployedVehicles
          const matchingPlates = Object.keys(deployedVehiclesData).filter(
            (plateNumber) => {
              const selectedDriverField =
                deployedVehiclesData[plateNumber].selectedDriver;
              return selectedDriverField === fname;
            }
          );

          if (matchingPlates.length > 0) {
            console.log(
              `${fname} exists in deployedVehicles with plate numbers:`,
              matchingPlates
            );

            // Clear selectedDriver field in deployedVehicles
            matchingPlates.forEach(async (plateNumber) => {
              const plateRef = ref(database, `deployedVehicles/${plateNumber}`);
              await update(plateRef, { selectedDriver: null });

              console.log(`Cleared selectedDriver field for ${plateNumber}`);
              // console.log(
              //   "Cleared Field deployedVehiclesData:",
              //   deployedVehiclesData
              // );

              // Assuming availableSeats is another collection
              const availableSeatsSnapshot = await get(
                ref(database, `availableSeats/${plateNumber}`)
              );

              if (availableSeatsSnapshot.exists()) {
                const availableSeatsData = availableSeatsSnapshot.val();
                await remove(ref(database, `availableSeats/${plateNumber}`));

                // Log the entire availableSeatsData
                console.log("All availableSeatsData:", availableSeatsData);

                // Check if plateNumber exists in availableSeats
                matchingPlates.forEach(async (innerPlateNumber) => {
                  if (availableSeatsData[innerPlateNumber]) {
                    console.log(`${innerPlateNumber} exists in availableSeats`);

                    // Delete the collection in availableSeats
                    await remove(
                      ref(database, `availableSeats/${innerPlateNumber}`)
                    );

                    console.log(
                      `Deleted collection in availableSeats for ${innerPlateNumber}`
                    );
                  } else {
                    console.log(
                      `${plateNumber} does not exist in availableSeats`
                    );
                  }
                });
              } else {
                console.log("No availableSeats documents!");
              }
            });

            const vehicleRegFormSnapshot = await get(
              ref(database, "vehicleRegForm")
            );

            if (vehicleRegFormSnapshot.exists()) {
              const vehicleRegFormData = vehicleRegFormSnapshot.val();

              // console.log("Vehicle Reg Form Data:", vehicleRegFormData);

              matchingPlates.forEach(async (plateNumber) => {
                if (vehicleRegFormData[plateNumber]) {
                  console.log(`${plateNumber} exists in vehicleRegForm`);

                  // Update deploymentStatus to "Inactive"
                  const plateRef = ref(
                    database,
                    `vehicleRegForm/${plateNumber}`
                  );
                  await update(plateRef, { deploymentStatus: "Inactive" });

                  console.log(
                    `${plateNumber} deploymentStatus updated to Inactive`
                  );
                } else {
                  console.log(
                    `${plateNumber} does not exist in vehicleRegForm`
                  );
                }
              });
            } else {
              console.log("No vehicleRegForm documents!");
            }
          } else {
            console.log(`${fname} does not exist in deployedVehicles`);
          }
        } else {
          console.log("No deployedVehicles documents!");
        }
        await remove(ref(database, `drivers/${driverId}`));
        toast.success(`${fname} driver is deleted`);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }

    handleCloseDeleteConfirmationModal();
  };

  const handleCloseDeleteConfirmationModal = () => {
    setShowDeleteConfirmation(false);
    setDriverToDelete(null);
  };

  return (
    <Container fluid style={{ paddingLeft: "13%", paddingRight: "1%" }}>
      <Card className="mt-5 ms-5 p-3 title-header">
        <Row className="d-flex justify-content-evenly align-items-center ">
          <Col sm={10}>
            <div className="ms-5">
              <h3>
                <b>Driver Management</b>
              </h3>
              <p className="text-muted">
                Verified driver's credentials are listed below.
              </p>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Card>

      <Card className="mt-4 ms-5 p-5 title-header">
        <Table className="text-center" striped bordered hover>
          <thead style={{ cursor: "pointer" }}>
            <tr>
              <th onClick={() => handleSort("fname")}>
                Name <SwapVertIcon />
              </th>
              <th>Email</th>
              <th>License No.</th>
              <th>License Expiry</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {verifiedDrivers.map((driver) => (
              <tr key={driver.id}>
                <td className="d-flex justify-content-center align-items-center">
                  {driver.fname}
                  <Tooltip title="Verified Driver" arrow>
                    <VerifiedIcon
                      className="ms-1"
                      style={{ fontSize: "16px", color: "#739072" }}
                    />
                  </Tooltip>
                </td>
                <td>{driver.email}</td>
                <td>{driver.licenseNo}</td>
                <td>{driver.licenseExpiry}</td>
                <td>
                  <Tooltip title="Edit" arrow>
                    <EditIcon
                      className="me-2"
                      color="primary"
                      onClick={() => handleEdit(driver)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <DeleteIcon
                      color="error"
                      onClick={() => handleDelete(driver)}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="fname"
                value={editedDriver.fname}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={editedDriver.email}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>License No.</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter license number"
                name="licenseNo"
                value={editedDriver.licenseNo}
                onChange={handleEditFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>License Expiry</Form.Label>
              <Form.Control
                type="date"
                min={getCurrentDate()}
                name="licenseExpiry"
                value={editedDriver.licenseExpiry}
                onChange={handleEditFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdits}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirmation}
        onHide={handleCloseDeleteConfirmationModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Driver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this driver?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleCloseDeleteConfirmationModal}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default DriverManagement;
