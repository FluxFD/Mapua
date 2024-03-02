import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Modal } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, push } from 'firebase/database';
import useAuth from '../services/Auth';
import { database } from '../services/Firebase'; // Update import
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const PdfViewer = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const { currentUser } = useAuth();
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorContent !== editorRef.current.getContent()) {
      editorRef.current.setContent(editorContent);
    }
  }, [editorContent]);

  const navigateToMain = () => {
    navigate('/main');
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        name: currentUser.displayName,
        uid: currentUser.uid,
        url: url,
        uploadedDate: new Date().toISOString(),
        editorContent: editorContent
      };
  
      const submissionRef = ref(database, 'ReviewerSubmission');
      push(submissionRef, submissionData);
      console.log('Submission successful!');
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setShowModal(false);
      setEditorContent('');
    }
  };
  

  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      // You can also upload the file to the server or perform any other necessary actions here
    }
  };

  return (
    <Container>
      <Button className="mt-5" onClick={navigateToMain}>
        <ArrowCircleLeftIcon />
      </Button>
      <div className="d-flex justify-content-center">
        <iframe className="mt-5" src={url} width="100%" height="800px"></iframe>
      </div>

      <Card className="mt-3 mb-5">
        <Card.Body>
          <Button className="mb-2" onClick={() => setShowModal(true)}>
            File Upload
          </Button>
          {uploadedFileName && (
            <Card className="mb-2">
              <Card.Body>
                <p>
                  <DriveFolderUploadIcon />
                  {uploadedFileName}
                </p>
              </Card.Body>
            </Card>
          )}
          <Editor
            apiKey="vcsi3l28ns46h3a66o1neo1xe4fd41pwk436gnu11sibhflm"
            value={editorContent}
            onEditorChange={handleEditorChange}
            onInit={(evt, editor) => editorRef.current = editor}
            init={{
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough',
              tinycomments_mode: 'embedded',
              tinycomments_author: 'Author name',
              mergetags_list: [
                { value: 'First.Name', title: 'First Name' },
                { value: 'Email', title: 'Email' },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject('See docs to implement AI Assistant')
                ),
            }}
          />
          <Button className="mt-2" onClick={handleSubmit}>
            Submit
          </Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-center">
            <form className="file-upload-form">
              <label htmlFor="fileInput" className="file-upload-label">
                <div className="file-upload-design">
                  <CloudUploadIcon style={{ width: '100%' }} />
                  <p>Drag and Drop</p>
                  <span className="browse-button">Browse file</span>
                </div>
                <input id="fileInput" type="file" onChange={handleFileChange} />
              </label>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default PdfViewer;
