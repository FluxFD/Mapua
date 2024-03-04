package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.NumberPicker;
import android.widget.RadioButton;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class PracticeWithTime extends AppCompatActivity {

    private FirebaseAuth mAuth;

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;

    private RecyclerView recyclerView;
    private QuestionAdapter adapter;
    private List<ActivitiesReviewerListItem> questions;

    private CountDownTimer timer;
    private TextView timerTextView;
    private NumberPicker timePicker;
    private boolean timerStarted = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_practice_with_time);

        reviewerActivities = (ArrayList<ActivitiesReviewerListItem>) getIntent().getSerializableExtra("reviewerActivities");
        mAuth = FirebaseAuth.getInstance();
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            String title = extras.getString("title");
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                Log.d("PracticeQnA", "Key: " + key + ", Value: " + value);
            }
        }

        for (int i = 0; i < reviewerActivities.size(); i++) {
            ActivitiesReviewerListItem activity = reviewerActivities.get(i);
            Log.d("PracticeWithoutTime", "Activity " + i + ":");
            Log.d("PracticeWithoutTime", "  ID: " + activity.getActivityId());
            Log.d("PracticeWithoutTime", "  Question: " + activity.getQuestion());
            Log.d("PracticeWithoutTime", "  Question Type: " + activity.getQuestionType());
            Log.d("PracticeWithoutTime", "  Answer: " + activity.getAnswer());
            Log.d("PracticeWithoutTime", "  Choices: " + activity.getChoices());
        }

        recyclerView = findViewById(R.id.recyclerViewPracticeWithTimer);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Populate questions list based on questionType
        questions = new ArrayList<>();
        for (ActivitiesReviewerListItem activity : reviewerActivities) {
            switch (activity.getQuestionType()) {
                case "MultipleChoice":
                case "Identification":

                    questions.add(activity);
                    break;

            }
        }
        adapter = new QuestionAdapter(questions);
        recyclerView.setAdapter(adapter);   Button submitBtn = findViewById(R.id.practiceWithTimeSubmit);

        timerTextView = findViewById(R.id.timerTextView);
        timePicker = findViewById(R.id.timePicker);
        timePicker.setMinValue(1);
        timePicker.setMaxValue(60);
        timePicker.setValue(5); // Default value
        // Set initial timer text
        timerTextView.setText(String.format(Locale.getDefault(), "Time remaining: %02d:%02d", timePicker.getValue(), 0));


        Button startTimerButton = findViewById(R.id.startTimerButton);
        startTimerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!timerStarted) {
                    int selectedMinutes = timePicker.getValue();
                    timer = new CountDownTimer(selectedMinutes * 60000, 1000) { // Convert minutes to milliseconds
                        public void onTick(long millisUntilFinished) {
                            int minutes = (int) (millisUntilFinished / 60000);
                            int seconds = (int) ((millisUntilFinished % 60000) / 1000);
                            timerTextView.setText(String.format(Locale.getDefault(), "Time remaining: %02d:%02d", minutes, seconds));
                        }

                        public void onFinish() {
                            timerTextView.setText("Time's up!");
                            timerStarted = false;
                            submitBtn.performClick();
                        }
                    };
                    timer.start(); // Start the timer
                    timerStarted = true;
                }
            }
        });

        submitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int score = 0;
                for (int i = 0; i < adapter.getItemCount(); i++) {
                    ActivitiesReviewerListItem question = questions.get(i);
                    switch (question.getQuestionType()) {
                        case "MultipleChoice":
                            // Code for multiple choice questions
                            break;
                        case "Identification":
                            // Check if the ViewHolder is not null
                            RecyclerView.ViewHolder viewHolder = recyclerView.findViewHolderForAdapterPosition(i);
                            if (viewHolder != null && viewHolder instanceof QuestionAdapter.IdentificationViewHolder) {
                                // Access the answerEditText if viewHolder is not null
                                String enteredAnswer = ((QuestionAdapter.IdentificationViewHolder) viewHolder).answerEditText.getText().toString().trim();
                                if (!enteredAnswer.isEmpty() && enteredAnswer.equalsIgnoreCase(question.getAnswer())) {
                                    score++;
                                }
                            }
                            break;
                    }
                }
                Log.d("PracticeWithTime", "Score: " + score);
                saveScore(score);
            }
        });

    }
    @Override
    protected void onDestroy() {
        super.onDestroy();
        timer.cancel(); // Stop the timer to prevent memory leaks
    }

    private void saveScore(int correctAnswers) {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            Log.e("PracticeWithTime", "User is not logged in");
            return;
        }

        String title = getIntent().getStringExtra("title");
        String taskName = title; // Set the taskName to the title

        Log.d("PracticeWithTime","Task Name is" + taskName);

        DatabaseReference studentRef = FirebaseDatabase.getInstance().getReference("students").child(currentUser.getUid());
        DatabaseReference scoresRef = FirebaseDatabase.getInstance().getReference("Score"); // Move this outside the ValueEventListener
        String key = scoresRef.push().getKey();

        studentRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists() && dataSnapshot.hasChild("name")) {
                    String studentName = dataSnapshot.child("name").getValue(String.class);
                    if (studentName != null) {
                        if (taskName != null && key != null) {
                            List<Map<String, Object>> scores = new ArrayList<>();
                            for (ActivitiesReviewerListItem item : reviewerActivities) {
                                Map<String, Object> scoreItem = new HashMap<>();
                                scoreItem.put("correctAnswer", item.getAnswer());
                                scoreItem.put("userAnswer", item.getAnswer());
                                scoreItem.put("isCorrect", item.getAnswer().equals(item.getAnswer()));
                                scoreItem.put("question", item.getQuestion());
                                scores.add(scoreItem);
                            }

                            Map<String, Object> scoreData = new HashMap<>();
                            scoreData.put("studentId", currentUser.getUid());
                            scoreData.put("score", correctAnswers);
                            scoreData.put("studentName", studentName);
                            scoreData.put("taskName", title);
                            scoreData.put("scores", scores);

                            scoresRef.child(key).setValue(scoreData);
                        } else {
                            Log.e("PracticeWithTime", "taskName or key is null");
                        }
                    } else {
                        Log.e("PracticeWithTime", "Failed to retrieve student name");
                    }
                } else {
                    Log.e("PracticeWithTime", "Name field does not exist in database");
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("PracticeWithTime", "Database Error: " + databaseError.getMessage());
            }
        });
    }
}