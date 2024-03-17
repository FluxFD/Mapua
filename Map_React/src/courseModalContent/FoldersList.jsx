import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ActivityOptionsOffcanvas from '../components/ActivityOptionOffCanvas'

function FoldersList({ folders, folderedTask, handleToggle, openFolderId }) {
  const [selectedActivity, setSelectedActivity] = useState(null)

  const handleActivityClick = (taskId, taskName) => {
    setSelectedActivity({ taskId, taskName })
    console.log('Selected Activity:', { taskId, taskName }) // Log selected activity
  }

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
                  <Card
                    key={task.id}
                    style={{ cursor: 'pointer' }}
                    onClick={(event) => {
                      event.stopPropagation(); // Stop event propagation here
                      handleActivityClick(task.id, task.taskName);
                    }}
                  
                  >
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
      <ActivityOptionsOffcanvas
        show={selectedActivity !== null}
        handleClose={() => {
          console.log('Closing Activity Options Offcanvas')
          setSelectedActivity(null)
        }}
        selectedActivity={selectedActivity}
      />
    </div>
  )
}

export default FoldersList
