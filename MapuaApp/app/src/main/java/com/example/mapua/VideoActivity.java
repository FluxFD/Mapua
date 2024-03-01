package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.MediaController;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

public class VideoActivity extends AppCompatActivity {

    private String videoUrl1 = "https://firebasestorage.googleapis.com/v0/b/mapua-f1526.appspot.com/o/video1.mp4?alt=media&token=ad2cb2d1-8671-431c-9573-61df2a6407f0";
    private MediaController mediaController;
    private Handler h = new Handler();
    private List<ActivityModel> activitiesList = new ArrayList<>();

    Dialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_video);

        VideoView videoView = findViewById(R.id.videoView);
        mediaController = new MediaController(this);
        videoView.setMediaController(mediaController);
        Uri uri = Uri.parse(videoUrl1);
        videoView.setVideoURI(uri);
        videoView.requestFocus();

        dialog = new Dialog(VideoActivity.this);

        videoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
            @Override
            public void onPrepared(MediaPlayer mp) {
                videoView.start();

                if (getIntent().hasExtra("courseId")) {
                    String courseId = getIntent().getStringExtra("courseId");
                    DatabaseReference videoActivityRef = FirebaseDatabase.getInstance().getReference("VideoActivity");
                    Query query = videoActivityRef.orderByChild("Course").equalTo(courseId);

                    query.addListenerForSingleValueEvent(new ValueEventListener() {
                        @Override
                        public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                            // Fetch and process data in a background thread
                            new Thread(new Runnable() {
                                @Override
                                public void run() {
                                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                                        VideoActivityModel videoActivity = snapshot.getValue(VideoActivityModel.class);
                                        if (videoActivity != null) {
                                            Log.d("VideoActivity", "Title: " + videoActivity.getTitle() + ", Date: " + videoActivity.getDate() + ", Video: " + videoActivity.getVideo());
                                        }

                                        for (DataSnapshot activitySnapshot : snapshot.child("activities").getChildren()) {
                                            String answer = activitySnapshot.child("answer").getValue(String.class);
                                            String question = activitySnapshot.child("question").getValue(String.class);
                                            String questionType = activitySnapshot.child("questionType").getValue(String.class);
                                            String time = activitySnapshot.child("time").getValue(String.class);
                                            Map<String, String> choices = new HashMap<>();
                                            for (DataSnapshot choiceSnapshot : activitySnapshot.child("choices").getChildren()) {
                                                choices.put(choiceSnapshot.getKey(), choiceSnapshot.getValue(String.class));
                                            }
                                            activitiesList.add(new ActivityModel(answer, choices, question, questionType, time));
                                        }
                                    }

                                    Collections.sort(activitiesList, Comparator.comparing(ActivityModel::getTimeInSeconds));

                                    h.postDelayed(new Runnable() {
                                        @Override
                                        public void run() {
                                            int duration = videoView.getCurrentPosition() / 1000;
                                            for (ActivityModel activity : activitiesList) {
                                                long activityTime = Long.parseLong(activity.getTimeInSeconds());
                                                if (duration == activityTime) {
                                                    runOnUiThread(new Runnable() {
                                                        @Override
                                                        public void run() {
                                                            showAlert(activity);
                                                        }
                                                    });
                                                    break;
                                                }
                                            }

                                            h.postDelayed(this, 1000);
                                        }
                                    }, 1000); // 1 second delay
                                }
                            }).start();
                        }

                        @Override
                        public void onCancelled(@NonNull DatabaseError databaseError) {
                            // Handle errors
                        }
                    });
                } else {
                    Log.d("VideoActivity", "No courseId found in Intent");
                }
            }
        });
    }

    private void showAlert(ActivityModel activity) {
        VideoView videoView = findViewById(R.id.videoView);
        if (videoView != null && videoView.isPlaying()) {
            videoView.pause();
        }

        dialog.setContentView(R.layout.dialog_video);

        TextView questionTextView = dialog.findViewById(R.id.questionTextView);
        RadioGroup optionsRadioGroup = dialog.findViewById(R.id.optionsRadioGroup);
        Button submitBtn = dialog.findViewById(R.id.submitBtn);

        questionTextView.setText(activity.getQuestion());

        Map<String, String> choices = activity.getChoices();
        for (Map.Entry<String, String> entry : choices.entrySet()) {
            RadioButton radioButton = new RadioButton(this);
            radioButton.setText(entry.getValue());
            radioButton.setTag(entry.getKey());
            optionsRadioGroup.addView(radioButton);
        }

        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        dialog.setCancelable(false);
        dialog.show();

        submitBtn.setOnClickListener(v -> {
            int selectedId = optionsRadioGroup.getCheckedRadioButtonId();
            if (selectedId != -1) {
                RadioButton selectedRadioButton = optionsRadioGroup.findViewById(selectedId);
                if (selectedRadioButton != null) {
                    String selectedAnswer = (String) selectedRadioButton.getTag();
                    String correctAnswer = activity.getAnswer();

                    if (selectedAnswer.equals(correctAnswer)) {
                        // Correct answer
                        Toast.makeText(VideoActivity.this, "Correct!", Toast.LENGTH_SHORT).show();
                        dialog.cancel(); // Dismiss the dialog if the answer is correct
                        if (videoView != null) {
                            videoView.start(); // Resume the video
                        }
                    } else {
                        // Incorrect answer
                        Toast.makeText(VideoActivity.this, "Incorrect. Try again.", Toast.LENGTH_SHORT).show();
                        // Keep the dialog open
                    }
                } else {
                    Toast.makeText(VideoActivity.this, "Selected radio button is null", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(VideoActivity.this, "Please select an answer", Toast.LENGTH_SHORT).show();
            }
        });
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (mediaController != null) {
            mediaController.hide();
        }

        if (h != null) {
            h.removeCallbacksAndMessages(null);
        }
    }
}


