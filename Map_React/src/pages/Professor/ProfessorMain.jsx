// ProfessorMainPage.js
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Pages
import ProfessorMiniDrawer from "../../components/ProfessorDrawer";
import ProfessorDashboard from "./ProfessorDash";
import ProfessorCourse from "./ProfessorCourses";
import Message from "./ProfMessage";
import ProfessorCalander from "./ProfessorCalendar";
import ProfessorProfile from "./ProfessorProfile";

// Firebase
import { auth } from "../../services/Firebase";
import { ref, get, update } from "firebase/database";
import { database } from "../../services/Firebase";

const ProfessorMainPage = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Get the current user
      const user = auth.currentUser;

      // Update isActive field to false if user exists
      if (user) {
        const activeRef = ref(database, `students/${user.uid}`);
        await update(activeRef, {
          isActive: false,
        });
      }

      // Sign out the user
      await auth.signOut();

      // Remove stored credentials and other data
      localStorage.removeItem("credentials");
      localStorage.removeItem("studentNo");
      localStorage.removeItem("studentData");

      // Navigate to home page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleNavigateToMessage = (messageId) => {
    setSelectedMessageId(messageId);
    setSelectedItem("Message");
  };

  const renderPageContent = () => {
    switch (selectedItem) {
      case "Dashboard":
        return <ProfessorDashboard onMessageClick={handleNavigateToMessage} />;
      case "Courses":
        return <ProfessorCourse />;
      case "Calendar":
        return <ProfessorCalander />;
      case "Message":
        return <Message messageId={selectedMessageId} />;
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
