package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

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

public class MultipleChoice extends AppCompatActivity {
    private FirebaseAuth mAuth;

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;
    Button submitMultipleChoice;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_multiple_choice);


        // Get the reviewerActivities from the intent
        reviewerActivities = (ArrayList<ActivitiesReviewerListItem>) getIntent().getSerializableExtra("reviewerActivities");
        mAuth = FirebaseAuth.getInstance();
        submitMultipleChoice = findViewById(R.id.multipleChoiceSubmit);


        // Log all questions, answers, and choices
        for (ActivitiesReviewerListItem activity : reviewerActivities) {
            Log.d("MultipleChoice", "Question: " + activity.getQuestion());
            Log.d("MultipleChoice", "Answer: " + activity.getAnswer());
            Log.d("MultipleChoice", "Choices:");
            for (Map.Entry<String, String> entry : activity.getChoices().entrySet()) {
                Log.d("MultipleChoice", " - " + entry.getKey() + ": " + entry.getValue());
            }
        }

        RecyclerView recyclerView = findViewById(R.id.multipleChoiceRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        MultipleChoiceAdapter adapter = new MultipleChoiceAdapter(reviewerActivities);
        recyclerView.setAdapter(adapter);

        submitMultipleChoice.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                saveScore();
                finish();
            }
        });

    }

    private String studentName; // Declare studentName as a class-level variable

    private void saveScore() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            Log.e("MultipleChoice", "User is not logged in");
            return;
        }

        int score = 0;
        List<Map<String, Object>> scores = new ArrayList<>();

        for (ActivitiesReviewerListItem item : reviewerActivities) {
            if (item.getAnswer().equals(item.getUserAnswer())) { // Compare with user's selected answer
                score++;
            }

            Map<String, Object> scoreItem = new HashMap<>();
            scoreItem.put("correctAnswer", item.getAnswer());
            scoreItem.put("isCorrect", item.getAnswer().equals(item.getUserAnswer()));
            scoreItem.put("question", item.getQuestion());
            scoreItem.put("userAnswer", item.getUserAnswer()); // Use user's selected answer

            scores.add(scoreItem);
        }
        String title = getIntent().getStringExtra("title");
        String taskName = title; // Set the taskName to the title

        DatabaseReference studentRef = FirebaseDatabase.getInstance().getReference("students").child(currentUser.getUid());
        DatabaseReference scoresRef = FirebaseDatabase.getInstance().getReference("Score"); // Move this outside the ValueEventListener
        String key = scoresRef.push().getKey();
        int finalScore = (int) (((double) score / reviewerActivities.size()) * 100);
        studentRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                if (dataSnapshot.exists() && dataSnapshot.hasChild("name")) {
                    studentName = dataSnapshot.child("name").getValue(String.class);
                    if (studentName != null) {
                        if (taskName != null) {
                            if (key != null) {
                                scoresRef.child(key).child("studentId").setValue(currentUser.getUid());
                                scoresRef.child(key).child("score").setValue(finalScore);
                                scoresRef.child(key).child("studentName").setValue(studentName);
                                scoresRef.child(key).child("taskName").setValue(title);
                                scoresRef.child(key).child("scores").setValue(scores);
                            }
                        } else {
                            Log.e("MultipleChoice", "taskName is null");
                        }
                    } else {
                        Log.e("MultipleChoice", "Failed to retrieve student name");
                    }
                } else {
                    Log.e("MultipleChoice", "Name field does not exist in database");
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("MultipleChoice", "Database Error: " + databaseError.getMessage());
            }
        });

        if (taskName != null) {
            if (key != null) {
                scoresRef.child(key).child("studentId").setValue(currentUser.getUid());
                scoresRef.child(key).child("score").setValue(score);
                scoresRef.child(key).child("studentName").setValue(studentName);
                scoresRef.child(key).child("taskName").setValue(title);
                scoresRef.child(key).child("scores").setValue(scores);
            }
        } else {
            Log.e("MultipleChoice", "taskName is null");
        }
    }

}
