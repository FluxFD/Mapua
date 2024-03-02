import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Pages
import ProfessorMiniDrawer from "../../components/ProfessorDrawer";
import ProfessorDashboard from "./ProfessorDash";
import ProfessorCourse from "./ProfessorCourses";
import Message from "../Message";
import ProfessorCalander from "./ProfessorCalendar";
import ProfessorProfile from "./ProfessorProfile";

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
      case "Calendar":
        return <ProfessorCalander />;
      case "Message":
        return <Message />;
      case "Settings":
        return <ProfessorProfile />;
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
