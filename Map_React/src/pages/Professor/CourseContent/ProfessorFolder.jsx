import React, { useState } from "react";
import { Card, Form } from "react-bootstrap";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function FolderProf({ folders, selectedCourse }) {
  const filteredFolders = folders.filter(
    (folder) => folder.Course === selectedCourse.uid
  );

  const [expandedFolder, setExpandedFolder] = useState(null);

  const toggleFolder = (folderId) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
    } else {
      setExpandedFolder(folderId);
    }
  };

  return (
    <div>
      {filteredFolders.map((folder, index) => (
        <Card key={index} className="title-header mt-3">
          <Card.Header
            onClick={() => toggleFolder(folder.id)}
            style={{ cursor: "pointer" }}
          >
            <FolderOpenIcon className="me-2" />
            {folder.id}
          </Card.Header>
          {expandedFolder === folder.id && (
            <Card.Body>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
              >
                <Form.Label className="mb-0">
                  <p className="text-muted">Create Task</p>
                </Form.Label>
                <p className="d-flex align-items-center">
                  <AddCircleOutlineIcon color="primary" className="me-2" />
                </p>
              </div>
            </Card.Body>
          )}
        </Card>
      ))}
    </div>
  );
}

export default FolderProf;
