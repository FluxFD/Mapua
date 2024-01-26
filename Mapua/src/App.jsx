//PACKAGE IMPORTS
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

//PAGE AND COMPONENT IMPORTS
import './App.css'
import Login from "./pages/Login";
import Dashboard from "./pages/moderator/dashboard";
import { UserContextProvider } from "../context/userContext";
import Test from "./pages/test";
import PrivateRoute from "./components/privateRoute";

//AXIOS CONFIG
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Test />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/home" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
