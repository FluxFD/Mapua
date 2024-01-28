import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import ModDash from "../../components/moderator/moddash";
import SideNav from "../../components/moderator/sidenav";

const Moderator = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SideNav />
      <Box
        component="main"
        sx={{ flexGrow: 300, p: 1 }}
        backgroundColor="#D9D9D9"
        height="100vh"
      >
        <ModDash />
      </Box>
    </Box>
  );
};

export default Moderator;
