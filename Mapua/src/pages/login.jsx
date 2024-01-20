import SignIn from "../components/signinCard";
import { Paper, Box } from "@mui/material";

const Login = () => {
  return (
    <Box
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        height: "98vh",
      }}
    >
      <Paper sx={{ height: "50vh", width: "25vw" }}>
        <SignIn />
      </Paper>
    </Box>
  );
};

export default Login;
