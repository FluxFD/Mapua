import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

import { ref, remove } from "firebase/database";
import { database, auth } from "../../../services/Firebase";

function FolderProf({ folders, selectedCourse, tasks, deleteFolder }) {
  const filteredFolders = folders.filter(
    (folder) => folder.Course === selectedCourse.uid
  );

  const foldersWithTasks = filteredFolders.filter((folder) =>
    tasks.some((task) => task.FolderName === folder.id)
  );

  const [expandedFolder, setExpandedFolder] = useState(null);

  const toggleFolder = (folderId) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
    } else {
      setExpandedFolder(folderId);
    }
  };

  const handleDeleteFolder = (folderId) => {
    deleteFolder(folderId);
  };

  const handleDeleteTask = (taskId) => {
    const taskRef = ref(database, `Tasks/${taskId}`);
    remove(taskRef)
      .then(() => {
        console.log(`Task ${taskId} deleted successfully`);
      })
      .catch((error) => {
        console.error(`Error deleting task ${taskId}:`, error);
      });
  };

  return (
    <div>
      {filteredFolders.map((folder, index) => {
        const folderHasTasks = foldersWithTasks.some((f) => f.id === folder.id);

        return (
          <Card key={index} className="title-header mt-3">
            <Card.Header
              className="d-flex align-items-center justify-content-between p-3"
              onClick={() => toggleFolder(folder.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <FolderOpenIcon className="me-2" />
                {folder.id}
              </div>
              <DeleteIcon
                color="error"
                className="cursor-pointer"
                onClick={() => handleDeleteFolder(folder.id)}
              />
            </Card.Header>
            {expandedFolder === folder.id && (
              <Card.Body>
                <div
                  className="d-flex justify-content-end align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <Form.Label className="mb-0">
                    <div
                      className="text-muted d-flex align-items-center"
                      style={{ cursor: "pointer" }}
                    >
                      <AddCircleOutlineIcon
                        color="primary"
                        className="me-1"
                        style={{ fontSize: "18px" }}
                      />
                      Create Task
                    </div>
                  </Form.Label>
                </div>

                {folderHasTasks && (
                  <div className="ms-3">
                    {tasks
                      .filter((task) => task.FolderName === folder.id)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="d-flex align-items-center justify-content-between mt-2"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex align-items-center">
                            <ListAltIcon className="me-2" />
                            {task.taskName} - {task.dueDate}
                          </div>
                          <CloseIcon
                            color="error"
                            className="cursor-pointer"
                            onClick={() => handleDeleteTask(task.id)}
                            style={{ fontSize: "18px" }}
                          />
                        </div>
                      ))}
                  </div>
                )}

                {!folderHasTasks && (
                  <div
                    className="ms-3 text-muted"
                    style={{ cursor: "pointer" }}
                  >
                    No tasks available
                  </div>
                )}
              </Card.Body>
            )}
          </Card>
        );
      })}

      {tasks
        .filter(
          (task) => !task.FolderName && task.Course === selectedCourse.uid
        )
        .map((task) => (
          <Card className="title-header mt-3">
            <Card.Header className="d-flex justify-content-between align-items-center p-3">
              <div className="d-flex align-items-center">
                <ListAltIcon className="me-2" />
                {task.taskName} - {task.dueDate}
              </div>
              <DeleteIcon
                color="error"
                className="cursor-pointer"
                onClick={() => handleDeleteTask(task.id)}
              />
            </Card.Header>
          </Card>
        ))}
    </div>
  );
}

export default FolderProf;
