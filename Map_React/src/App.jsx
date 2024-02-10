import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Declaration of components
import Toastify from "./components/Toastify";

// Declaration of pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Main from "./pages/Main";
import Courses from "./pages/Courses";

function App() {
  return (
    <>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          fontFamily: "Colon Mono, monospace",
          backgroundColor: "#ECE3CE",
        }}
      >
        <Router>
          <Toastify />
          {/* <MiniDrawer /> */}
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/Main" element={<Main />}></Route>
            <Route path="/Home" element={<Home />}></Route>
            <Route path="/Courses" element={<Courses />}></Route>
             {/* <Route path="/EventPlanning" element={<EventPlanner />}></Route>
            <Route path="/Applicants" element={<Applicants />}></Route>
            <Route path="/Letters" element={<DriverLetter />}></Route>
            <Route path="/Driver" element={<DriverManagement />}></Route>
            <Route path="/Attendance" element={<AttendanceRecord />}></Route>
            <Route path="/Maintenance" element={<MaintenanceRecord />}></Route> */}
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
