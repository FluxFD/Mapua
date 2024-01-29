import React from "react";
import {
  Toolbar,
  Box,
  AppBar,
  Typography,
} from "@mui/material";
import Coursecard from "./courses/coursecard";
import CustomTheme from "../customTheme";

const Courses = () => {

  const drawerWidth = 240;

  // Function to generate a random color
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Mock data for courses (replace it with your actual data or fetch from an API)
  const coursesData = [
    { title: "Course 1" },
    { title: "Course 2" },
    { title: "Course 3" },
    // Add more courses as needed
  ];

  return (
    <>
      <Box
        component="main"
        sx={{ flexGrow: 300, p: 1 }}
        backgroundColor="#D9D9D9"
        height="98vh"
      >
        <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        theme={CustomTheme}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Courses
          </Typography>
        </Toolbar>
      </AppBar>
        <Toolbar />
        
        {/* Map over the coursesData array and render Coursecard for each course */}
        {coursesData.map((course, index) => (
          <Coursecard key={index} title={course.title} color={getRandomColor()} />
        ))}
      </Box>
    </>
  );
};

export default Courses;
