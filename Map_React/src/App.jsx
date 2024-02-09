import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Declaration of components
import Toastify from "./components/Toastify";
import MiniDrawer from "./components/Drawer";

// Declaration of pages
import Login from "./pages/Login";
import Home from "./pages/Home";

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
          <MiniDrawer />
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/Home" element={<Home />}></Route>
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
