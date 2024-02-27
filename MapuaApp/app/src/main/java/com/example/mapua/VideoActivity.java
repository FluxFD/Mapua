package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.widget.MediaController;
import android.widget.VideoView;

public class VideoActivity extends AppCompatActivity {

    String videoUrl = "https://firebasestorage.googleapis.com/v0/b/mapua-f1526.appspot.com/o/video1.mp4?alt=media&token=ad2cb2d1-8671-431c-9573-61df2a6407f0";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_video);


        VideoView videoView = findViewById(R.id.videoView);
        videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mp) {
                float videoRatio = mp.getVideoWidth() / (float) mp.getVideoHeight();
                float screenRatio = videoView.getWidth() / (float)
                        videoView.getHeight();
                float scaleX = videoRatio / screenRatio;
                if (scaleX >= 1f) {
                    videoView.setScaleX(scaleX);
                } else {
                    videoView.setScaleY(1f / scaleX);
                }
            }
        });


        Uri uri = Uri.parse(videoUrl);

        videoView.setVideoURI(uri);

        MediaController mediaController = new MediaController(this);

        mediaController.setAnchorView(videoView);

        mediaController.setMediaPlayer(videoView);

        videoView.setMediaController(mediaController);

        videoView.start();

    }
}