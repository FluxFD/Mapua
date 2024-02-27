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
import Profile from "./pages/Profile";
import Calendar from "./pages/Calendar";
import CourseContent from "./pages/courseContent";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import FlashcardsPage from "./pages/FlashCardsPage";
import MultipleChoice from "./pages/MultipleChoice";
import Identification from "./pages/Identification";
import PracticeQuestion from "./pages/PracticeQuestion";
import Message from "./pages/Message";
import PdfViewer from "./components/pdfViewer";
import VideoActivity from "./pages/VideoActivity";


// Moderator
import ModeratorDashboard from "./pages/Moderator/ModeratorDash";
import ModeratorMainPage from "./pages/Moderator/ModeratorMain";

//Professor
import ProfessorMainPage from "./pages/Professor/ProfessorMain";
import ProfessorDashboard from "./pages/Professor/ProfessorDash";
import ProfessorCourse from "./pages/Professor/ProfessorCourses";

function App() {
  return (
    <>
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          fontFamily: "roboto-light",
          backgroundColor: "#1B365B",
        }}
      >
        <Router>
          <Toastify />
          {/* <MiniDrawer /> */}
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/Main" element={<Main />}></Route>
            <Route path="/Home" element={<Home />}></Route>
            <Route path="/Profile" element={<Profile />}></Route>
            <Route path="/Calendar" element={<Calendar />}></Route>
            <Route path="/Courses" element={<Courses />}></Route>
            <Route path="/CourseContent" element={<CourseContent />}></Route>
            <Route path="/Message" element={<Message />}></Route>
            <Route path="/preview/:url" element= {<PdfViewer />}></Route>
            <Route path="/video/:title" element= {<VideoActivity />}></Route>
            <Route
              path="/task/:taskId/:taskName"
              element={<TaskDetailsPage />}
            />
            <Route
              path="/flashcards/:activityId"
              element={<FlashcardsPage />}
            />

            <Route
              path="/multiplechoice/:activityId"
              element={<MultipleChoice />}
            />

            <Route
              path="/identification/:activityId"
              element={<Identification />}
            />
            <Route
              path="/practiceQuestion/:activityId"
              element={<PracticeQuestion />}
            />

            <Route
              path="/ModeratorDashboard"
              element={<ModeratorDashboard />}
            ></Route>
            <Route
              path="/ModeratorMain"
              element={<ModeratorMainPage />}
            ></Route>

            <Route
              path="/ProfessorMain"
              element={<ProfessorMainPage />}
            ></Route>
            <Route
              path="/ProfessorDashboard"
              element={<ProfessorDashboard />}
            ></Route>
            <Route
              path="/ProfessorCourse"
              element={<ProfessorCourse />}
            ></Route>
          </Routes>
        </Router>
      </main>
    </>
  );
}

export default App;
