import React, { useEffect, useState } from "react";
import { Toolbar, Box, AppBar, Typography } from "@mui/material";
import Coursecard from "./courses/coursecard";
import CustomTheme from "../customTheme";
import Test from "./courses/test";

const TeachCourses = () => {
  const drawerWidth = 240;
  const [coursesData, setCoursesData] = useState([]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    fetch("http://localhost/learn/URL_QUIZ.php")
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data from the server has a 'data' property containing an array of courses
        setCoursesData(data.data || []);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
          theme={CustomTheme}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Courses
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />

        {/* {coursesData.map((course, index) => (
          <Coursecard
            key={index}
            title={course.quiz_name}
            color={getRandomColor()}
          />
        ))} */}

        <Test />
      </Box>
    </>
  );
};

export default TeachCourses;
