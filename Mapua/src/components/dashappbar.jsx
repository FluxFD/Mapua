import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Container, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomTheme from "./customTheme";
import Dashcontent from "./dashcontent";
import Dashtoolbar from "./dashtoolbar";

const drawerWidth = 240;
export default function Dashappbar() {
  return (
    <AppBar
      position="fixed"
      sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      theme={CustomTheme}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div">
          Student/Teacher Profiles
        </Typography>
      </Toolbar>
      <Dashtoolbar />
    </AppBar>
  );
}
