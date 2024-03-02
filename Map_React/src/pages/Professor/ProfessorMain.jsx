import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Pages
import ProfessorMiniDrawer from "../../components/ProfessorDrawer";
import ProfessorDashboard from "./ProfessorDash";
import ProfessorCourse from "./ProfessorCourses";
import Message from "../Message";

// Firebase
import { auth } from "../../services/Firebase";

const ProfessorMainPage = () => {
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
        return <ProfessorDashboard />;
      case "Courses":
        return <ProfessorCourse />;
      case "Message":
        return <Message />;
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
      <ProfessorMiniDrawer
        onItemClick={handleItemClick}
        selectedItem={selectedItem}
      />
      <Container fluid>{renderPageContent()}</Container>
    </div>
  );
};

export default ProfessorMainPage;
