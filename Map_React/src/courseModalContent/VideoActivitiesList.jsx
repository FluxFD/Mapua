import React from 'react';
import { Card } from 'react-bootstrap';
import SlideshowIcon from '@mui/icons-material/Slideshow';

function VideoActivitiesList({ videoActivities, handleVideoClick }) {
  return (
    <div>
      {videoActivities.map((videoActivity) => (
        <Card
          style={{ cursor: 'pointer' }}
          key={videoActivity.id}
          className="title-header mt-3"
          onClick={() => handleVideoClick(videoActivity)}
        >
          <Card.Body>
            <SlideshowIcon />
            {videoActivity.title} - Date: {videoActivity.date}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default VideoActivitiesList;
