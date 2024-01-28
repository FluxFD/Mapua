import { Toolbar, Box, Paper, Grid, Stack, Typography } from "@mui/material";
import ProfileCard from "./profileCard";
import Sidenav from "./sidenav";

export const StudDash = () => {
  return (
    <>
      <Stack spacing={1} direction="row">
        <Paper sx={{ height: "98vh", width: "50vw" }}>
          <ProfileCard />
        </Paper>
        <Paper sx={{ height: "98vh", width: "35vw", p: 1 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Progress Report:</Typography>
          </Toolbar>
          <Paper></Paper>
        </Paper>
      </Stack>
    </>
  );
};

export default StudDash;
