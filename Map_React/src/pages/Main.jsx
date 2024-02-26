import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Pages
import MiniDrawer from "../components/Drawer";
import HomePage from "../pages/Home";
import Courses from "../pages/Courses";
import Profile from "../pages/Profile";

// Firebase
import { auth } from "../services/Firebase";

const MainPage = () => {
  const [selectedItem, setSelectedItem] = useState("Dashboard");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem(
        "firebase:host:mapua-f1526-default-rtdb.firebaseio.com"
      );
      localStorage.removeItem("credentials");
      localStorage.removeItem("studentNo");
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
      case "Courses":
        return <Courses />;
      case "Profile":
        return <Profile />;
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
      <iframe
        src="http://localhost/fingerprint/logout"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default MainPage;
