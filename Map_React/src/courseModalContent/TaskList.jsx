import React from 'react';
import { Card } from 'react-bootstrap';
import ListAltIcon from '@mui/icons-material/ListAlt';

function TaskList({ tasks, handleClick }) {
  return (
    <div>
      {tasks.map((task) => (
        <Card
          style={{ cursor: 'pointer' }}
          key={task.id}
          className="title-header mt-3"
          onClick={() => handleClick(task, task.id, task.taskName)}
        >
          <Card.Body>
            <ListAltIcon />
            {task.taskName} - Due Date: {task.dueDate}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default TaskList;
