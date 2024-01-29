import {
  Toolbar,
  Box,
  Paper,
  Grid,
  Stack,
  Typography,
  AppBar,
} from "@mui/material";
import Coursecard from "./courses/coursecard";
import Sidenav from "../../components/student/sidenav";
import CustomTheme from "../customTheme";
// import CourseTable from "./courses/coursetable";

const Courses = () => {
  const drawerWidth = 240;
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
        <Toolbar/>
        <Coursecard/>
        <Coursecard/>
        <Coursecard/>
      </Box>
    </>
  );
};

export default Courses;
