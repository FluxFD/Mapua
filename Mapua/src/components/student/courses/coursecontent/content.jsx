import React from "react";
import { Toolbar, Typography, Box } from "@mui/material";
import CourseFolders from "./coursefolders";

const Content = () => {
  const foldersData = [
    { title: "Modules", files: ["module1", "module2", "module3"] },
    { title: "Quizzes", files: ["quiz1", "quiz2", "quiz3"] },
    { title: "Exercises", files: ["exercise1", "exercise2", "exercise3"]  },
    { title: "Assessments" , files: ["assessment1", "assessment2", "assessment3"] },
  ];

  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography id="modal-modal-title" variant="h6">
          Course Content
        </Typography>
      </Toolbar>
      <Box sx={{ p: 1, height: "72vh", overflowY: "auto" }}>
        <CourseFolders folders={foldersData} />
      </Box>
    </>
  );
};

export default Content;
