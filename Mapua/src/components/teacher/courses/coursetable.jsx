import React from 'react';
import { Tabs, Tab, Paper, ThemeProvider, Toolbar, Typography } from '@mui/material';
import Theme from '../../customTheme';
import Content from './coursecontent/content';

const CourseTable = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={Theme}>
    <Paper sx={{p: 1}}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="primary"
      >
        <Tab label="Content" />
        <Tab label="Announcements" />
        <Tab label="Calendar" />
        <Tab label="Gradebook" />
      </Tabs>
      {/* Render content based on the selected tab */}
      {value === 0 && <Content/>}
      {value === 1 && <div>Course 2 Content</div>}
      {value === 2 && <div>Course 3 Content</div>}
      {value === 3 && <div>Course 4 Content</div>}
    </Paper>
    </ThemeProvider>
  );
};

export default CourseTable;