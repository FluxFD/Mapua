import React from 'react';

const TaskDetailsPage = ({ match }) => {
  const taskId = match.params.taskId; // Get the taskId from URL params

  return (
    <div>
      <h2>Task Details</h2>
      <p>Task ID: {taskId}</p>
      {/* You can fetch and display more details about the task here */}
    </div>
  );
}

export default TaskDetailsPage;
