package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.MediaController;
import android.widget.VideoView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.HashMap;
import java.util.Map;

public class VideoActivity extends AppCompatActivity {

    String videoUrl = "https://firebasestorage.googleapis.com/v0/b/mapua-f1526.appspot.com/o/video1.mp4?alt=media&token=ad2cb2d1-8671-431c-9573-61df2a6407f0";
    private MediaController mediaController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_video);

        VideoView videoView = findViewById(R.id.videoView);
        mediaController = new MediaController(this);
        videoView.setMediaController(mediaController);
        playVideo(videoView, videoUrl);

        // Check if the Intent contains the courseId key
        if (getIntent().hasExtra("courseId")) {
            String courseId = getIntent().getStringExtra("courseId");
            Log.d("VideoActivity", "Course ID from Intent: " + courseId);

            DatabaseReference videoActivityRef = FirebaseDatabase.getInstance().getReference("VideoActivity");
            Query query = videoActivityRef.orderByChild("Course").equalTo(courseId);

            query.addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        // Parse the snapshot data into your model class
                        VideoActivityModel videoActivity = snapshot.getValue(VideoActivityModel.class);
                        if (videoActivity != null) {
                            // Log the fetched data
                            Log.d("VideoActivity", "Title: " + videoActivity.getTitle() + ", Date: " + videoActivity.getDate() + ", Video: " + videoActivity.getVideo());
                            // You can log other properties as needed
                        }

                        for (DataSnapshot activitySnapshot : snapshot.child("activities").getChildren()) {
                            // Parse the activity data
                            String answer = activitySnapshot.child("answer").getValue(String.class);
                            String question = activitySnapshot.child("question").getValue(String.class);
                            String questionType = activitySnapshot.child("questionType").getValue(String.class);
                            String time = activitySnapshot.child("time").getValue(String.class);
                            Map<String, String> choices = new HashMap<>();
                            for (DataSnapshot choiceSnapshot : activitySnapshot.child("choices").getChildren()) {
                                choices.put(choiceSnapshot.getKey(), choiceSnapshot.getValue(String.class));
                            }

                            // Create ActivityModel object
                            ActivityModel activityModel = new ActivityModel(answer, choices, question, questionType, time);

                            // Log the fetched activity data
                            Log.d("VideoActivity", "Answer: " + activityModel.getAnswer() + ", Question: " + activityModel.getQuestion() + ", Type: " + activityModel.getQuestionType() + ", Time: " + activityModel.getTime() + ", Choices: " + activityModel.getChoices());
                        }
                    }
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {
                    // Handle any errors
                }
            });
        } else {
            Log.d("VideoActivity", "No courseId found in Intent");
        }
    }


    private void playVideo(VideoView videoView, String videoUrl) {
        try {
            Uri uri = Uri.parse(videoUrl);
            videoView.setVideoURI(uri);
            videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    float videoRatio = mp.getVideoWidth() / (float) mp.getVideoHeight();
                    float screenRatio = videoView.getWidth() / (float) videoView.getHeight();
                    float scaleX = videoRatio / screenRatio;
                    if (scaleX >= 1f) {
                        videoView.setScaleX(scaleX);
                    } else {
                        videoView.setScaleY(1f / scaleX);
                    }
                    videoView.start();
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mediaController != null) {
            mediaController.hide();
        }
    }


}
