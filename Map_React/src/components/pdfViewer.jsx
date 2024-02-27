import React from 'react'
import { Container, Card, Row, Col, Button, Image, Form } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'
import { useParams, useNavigate } from 'react-router-dom'

const PdfViewer = () => {
    const { url } = useParams()

  return (
    <Container>
      <div className="d-flex justify-content-center">
      <iframe
          className="mt-5"
          src={url}
          width="100%"
          height="800px"
        ></iframe>
      </div>
      <Card className="mt-3 mb-5">
        <Card.Body>
          <Editor
            apiKey="vcsi3l28ns46h3a66o1neo1xe4fd41pwk436gnu11sibhflm"
            init={{
              plugins:
                'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
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
            initialValue=""
          />
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PdfViewer
