package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

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
import java.util.Map;

public class Identification extends AppCompatActivity {

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_identification);

        reviewerActivities = (ArrayList<ActivitiesReviewerListItem>) getIntent().getSerializableExtra("reviewerActivities");
        mAuth = FirebaseAuth.getInstance();
        if (reviewerActivities != null) {
            // Log all questions, answers, and choices
            for (ActivitiesReviewerListItem activity : reviewerActivities) {
                Log.d("Identification", "Question: " + activity.getQuestion());
                Log.d("Identification", "Answer: " + activity.getAnswer());
                Log.d("Identification", "Choices:");
                for (Map.Entry<String, String> entry : activity.getChoices().entrySet()) {
                    Log.d("Identification", " - " + entry.getKey() + ": " + entry.getValue());
                }
            }
        } else {
            Log.e("Identification", "No reviewer activities found");
        }

        RecyclerView recyclerView = findViewById(R.id.identificationRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(new IdentificationAdapter(reviewerActivities));

        Button submitButton = findViewById(R.id.identificationSubmitBtn);

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int correctAnswers = 0;
                for (int i = 0; i < reviewerActivities.size(); i++) {
                    ActivitiesReviewerListItem activity = reviewerActivities.get(i);
                    // Retrieve user's answer from the corresponding ActivitiesReviewerListItem
                    String userAnswer = activity.getUserAnswer();
                    if (userAnswer != null && userAnswer.equalsIgnoreCase(activity.getAnswer())) {
                        correctAnswers++;
                    }
                }
                // Display the result to the user
                Toast.makeText(Identification.this, "Correct Answers: " + correctAnswers, Toast.LENGTH_SHORT).show();
                saveScore(correctAnswers);
            }
        });
    }

    private void saveScore(int correctAnswers) {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            Log.e("Identification", "User is not logged in");
            return;
        }

        String title = getIntent().getStringExtra("title");
        String taskName = title; // Set the taskName to the title

        DatabaseReference studentRef = FirebaseDatabase.getInstance().getReference("students").child(currentUser.getUid());
        DatabaseReference scoresRef = FirebaseDatabase.getInstance().getReference("Score"); // Move this outside the ValueEventListener
        String key = scoresRef.push().getKey();
        int finalScore = (int) (((double) correctAnswers / reviewerActivities.size()) * 100);
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
                                scoreItem.put("userAnswer", item.getUserAnswer());
                                scoreItem.put("isCorrect", item.getAnswer().equals(item.getUserAnswer()));
                                scoreItem.put("question", item.getQuestion());
                                scores.add(scoreItem);
                            }

                            Map<String, Object> scoreData = new HashMap<>();
                            scoreData.put("studentId", currentUser.getUid());
                            scoreData.put("score", finalScore);
                            scoreData.put("studentName", studentName);
                            scoreData.put("taskName", title);
                            scoreData.put("scores", scores);

                            scoresRef.child(key).setValue(scoreData);
                        } else {
                            Log.e("Identification", "taskName or key is null");
                        }
                    } else {
                        Log.e("Identification", "Failed to retrieve student name");
                    }
                } else {
                    Log.e("Identification", "Name field does not exist in database");
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("Identification", "Database Error: " + databaseError.getMessage());
            }
        });
    }
}