import React from 'react';
import { Card } from 'react-bootstrap';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ListAltIcon from '@mui/icons-material/ListAlt';

function FoldersList({ folders, folderedTask, handleToggle, openFolderId }) {
  return (
    <div>
      {folders.map((folder) => (
        <Card
          key={folder.id}
          style={{ cursor: 'pointer' }}
          className="title-header mt-3"
          onClick={() => handleToggle(folder.id)}
        >
          <Card.Header
            style={{
              minHeight: '55px',
              backgroundColor: 'white',
              borderRadius: '10px',
            }}
            className="d-flex align-items-center"
          >
            <FolderOpenIcon /> {folder.id}
          </Card.Header>
          {openFolderId === folder.id && (
            <Card.Body>
              {folderedTask
                .filter((task) => task.FolderName === folder.id)
                .map((task) => (
                  <Card key={task.id} style={{ cursor: 'pointer' }}>
                    <Card.Body>
                      <ListAltIcon /> {''}
                      {task.taskName} - Due Date: {task.dueDate}
                    </Card.Body>
                  </Card>
                ))}
            </Card.Body>
          )}
        </Card>
      ))}
    </div>
  );
}

export default FoldersList;
