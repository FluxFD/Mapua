import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "../../components/student/sidenav";

const Teacher = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidenav />
      <Box
        component="main"
        sx={{ flexGrow: 300, p: 1 }}
        backgroundColor="#D9D9D9"
        height="100vh"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Teacher;