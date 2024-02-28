package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
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
import java.util.Timer;
import java.util.TimerTask;

public class VideoActivity extends AppCompatActivity {

    String videoUrl1 = "https://firebasestorage.googleapis.com/v0/b/mapua-f1526.appspot.com/o/video1.mp4?alt=media&token=ad2cb2d1-8671-431c-9573-61df2a6407f0";
    private MediaController mediaController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_video);

        VideoView videoView = findViewById(R.id.videoView);
        mediaController = new MediaController(this);
        videoView.setMediaController(mediaController);

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
                            playVideo(videoView, videoUrl1, activityModel);

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


    private void playVideo(VideoView videoView, String videoUrl, ActivityModel activityModel) {
        try {
            Uri uri = Uri.parse(videoUrl);
            videoView.setVideoURI(uri);
            videoView.setMediaController(mediaController);
            videoView.requestFocus();
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

                    // Log video duration in seconds
                    int durationSeconds = videoView.getDuration() / 1000;
                    Log.d("VideoActivity", "Video duration: " + durationSeconds + " seconds");

                    // Schedule the pop-up dialogs at the specified times
                    new Handler().postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            // Determine which question to display based on the current time
                            int currentTimeSeconds = videoView.getCurrentPosition() / 1000;
                            int timeDifferenceFirst = Math.abs(currentTimeSeconds - 54);
                            int timeDifferenceSecond = Math.abs(currentTimeSeconds - 60);
                            String question;

                            if (timeDifferenceFirst < timeDifferenceSecond) {
                                question = "What is the symbol?";
                            } else {
                                question = "What does the symbol represent?";
                            }

                            // Display the pop-up dialog with the question
                            Log.d("VideoActivity", "Pop-up dialog at " + currentTimeSeconds + " seconds: " + question);
                            showQuestionAndAnswer(activityModel.getAnswer(), question, activityModel.getQuestionType(), activityModel.getChoices());
                        }
                    }, 54000); // 54 seconds
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    private void showQuestionAndAnswer(String answer, String question, String questionType, Map<String, String> choices) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Question: " + question)
                .setMessage("Type: " + questionType + "\n\nChoices:\n" + choicesToString(choices))
                .setPositiveButton("Submit", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        // Handle answer submission
                        // For example, compare the selected answer with the correct answer (answer) and log the result
                        Log.d("VideoActivity", "Answer submitted");
                    }
                });
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private String choicesToString(Map<String, String> choices) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : choices.entrySet()) {
            sb.append(entry.getKey()).append(": ").append(entry.getValue()).append("\n");
        }
        return sb.toString();
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mediaController != null) {
            mediaController.hide();
        }
    }


}
