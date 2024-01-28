//PACKAGE IMPORTS
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import axios from "axios";

//PAGE AND COMPONENT IMPORTS
import "./App.css";
import Login from "./pages/login";
import Moderator from "./pages/moderator/moderator";
import Student from "./pages/student/student";
import { UserContextProvider } from "../context/userContext";
import Test from "./pages/test";
import PrivateRoute from "./components/privateRoute";
import ModDash from "./components/moderator/moddash";
import StudDash from "./components/student/studdash";
import Courses from "./components/student/courses";

//AXIOS CONFIG
axios.defaults.baseURL = "http://localhost:3306";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      {/* <UserContextProvider> */}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="moderator" element={<Moderator />}>
            <Route path="dashboard" element={<ModDash/>}/>
          </Route>
          <Route path="student" element={<Student />}>
            <Route path='dashboard' element={<StudDash/>}/>
            <Route path='courses' element={<Courses/>}/>
          </Route>
          <Route path="/" element={<Test />} />
        </Routes>
      {/* </UserContextProvider> */}
    </>
  );
}

export default App;
