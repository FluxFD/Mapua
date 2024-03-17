import React from 'react';
import { Card } from 'react-bootstrap';
import ArticleIcon from '@mui/icons-material/Article';

function ReviewersList({ reviewers, handleReviewerClick }) {
  return (
    <div>
      {reviewers.map((reviewer) => (
        <Card
          style={{ cursor: 'pointer' }}
          key={reviewer.id}
          className="title-header mt-3"
          onClick={() => handleReviewerClick(reviewer.file)}
        >
          <Card.Body>
            <ArticleIcon />
            {reviewer.title}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default ReviewersList;
