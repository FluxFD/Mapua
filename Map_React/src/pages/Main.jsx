import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Pages
import MiniDrawer from "../components/Drawer";
import HomePage from "../pages/Home";
// import EventPlannerPage from "../pages/EventPlanner";
// import AssignVehiclePage from "./AssignVehicle";
// import Applicants from "../pages/Applicants";
// import DriverLetter from "./LeaveRequest";
// import DriverManagement from "./Drivers";
// import AttendanceRecord from "./Attendance";
// import MaintenanceRecord from "./Maintenance";

// Firebase
import { auth } from "../services/Firebase";

const MainPage = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderPageContent = () => {
    switch (selectedItem) {
      case "Dashboard":
        return <HomePage />;
      // case "Event Planner":
      //   return <EventPlannerPage />;
      // case "Vehicle Management":
      //   return <AssignVehiclePage />;
      // case "Applicants":
      //   return <Applicants />;
      // case "Driver Management":
      //   return <DriverManagement />;
      // case "Attendance Record":
      //   return <AttendanceRecord />;
      // case "Leave Request":
      //   return <DriverLetter />;
      // case "Maintenance Record":
      //   return <MaintenanceRecord />;
      case "Logout":
        handleLogout();
        return null;
      default:
        return null;
    }
  };

  return (
    <div>
      <MiniDrawer onItemClick={handleItemClick} selectedItem={selectedItem} />
      <Container fluid>{renderPageContent()}</Container>
    </div>
  );
};

export default MainPage;
