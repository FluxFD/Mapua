import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Pages
import ModeratorMiniDrawer from "../../components/ModeratorDrawer";
import ModeratorDashboard from "./ModeratorDash";
// import Courses from "../pages/Courses";

// Firebase
import { auth } from "../../services/Firebase";

const ModeratorMainPage = () => {
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
        return <ModeratorDashboard />;
      case "Courses":
        return "<Courses />";
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
      <ModeratorMiniDrawer
        onItemClick={handleItemClick}
        selectedItem={selectedItem}
      />
      <Container fluid>{renderPageContent()}</Container>
    </div>
  );
};

export default ModeratorMainPage;