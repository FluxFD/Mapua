import { Box } from "@mui/material"
import CssBaseline from '@mui/material/CssBaseline';

import Sidenav from "../components/sidenav"
import Dashappbar from "../components/dashappbar"
import Dashcontent from "../components/dashcontent";


const dashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
        <Dashappbar/>
        <Sidenav/>
        <Dashcontent/>
    </Box>
  )
}

export default dashboard