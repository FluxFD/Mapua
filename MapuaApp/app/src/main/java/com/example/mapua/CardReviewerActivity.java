package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Button;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CardReviewerActivity extends AppCompatActivity {

    private String reviewerId;
    private String course;
    private String date;
    private String title;

    private List<ActivitiesReviewerListItem> reviewerActivities = new ArrayList<>();

    TextView titleOfReviewActivity;

    Button flashCardBtn, multiChoiceBtn, identifyBtn, practiceBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_card_reviewer);

        titleOfReviewActivity = findViewById(R.id.activityTitleTextview);

        flashCardBtn = findViewById(R.id.flashCard);
        multiChoiceBtn = findViewById(R.id.multipleChoice);
        identifyBtn = findViewById(R.id.identification);
        practiceBtn = findViewById(R.id.practiceQuestion);

        // Retrieve intent data
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            reviewerId = extras.getString("reviewerId");
            course = extras.getString("course");
            date = extras.getString("date");
            title = extras.getString("title");
            Log.d("CardReviewerActivity", "Reviewer ID: " + reviewerId);
            Log.d("CardReviewerActivity", "Course: " + course);
            Log.d("CardReviewerActivity", "Date: " + date);
            Log.d("CardReviewerActivity", "Title: " + title);
        }

        titleOfReviewActivity.setText(title);

        DatabaseReference activitiesRef = FirebaseDatabase.getInstance().getReference("ReviewerActivity");
        activitiesRef.orderByChild("Course").equalTo(course).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot reviewerActivitySnapshot : dataSnapshot.getChildren()) {
                    DataSnapshot activitiesSnapshot = reviewerActivitySnapshot.child("activities");
                    for (DataSnapshot activitySnapshot : activitiesSnapshot.getChildren()) {
                        String activityId = activitySnapshot.getKey();
                        String question = activitySnapshot.child("question").getValue(String.class);
                        String answer = activitySnapshot.child("answer").getValue(String.class);
                        String questionType = activitySnapshot.child("questionType").getValue(String.class);
                        Log.d("CardReviewerActivity", "Question Type: " + questionType);

                        // Retrieve choices
                        DataSnapshot choicesSnapshot = activitySnapshot.child("choices");
                        Map<String, String> choicesMap = new HashMap<>();
                        for (DataSnapshot choiceSnapshot : choicesSnapshot.getChildren()) {
                            String choiceKey = choiceSnapshot.getKey();
                            String choiceValue = choiceSnapshot.getValue(String.class);
                            choicesMap.put(choiceKey, choiceValue);
                        }

                        ActivitiesReviewerListItem reviewerActivity = new ActivitiesReviewerListItem(activityId, question, questionType, answer, choicesMap);

                        reviewerActivities.add(reviewerActivity);
                        Log.d("Activity", "Question: " + question + ", Answer: " + answer + ", Choices: " + choicesMap + ", Question Type: " + questionType);
                    }
                }
            }
            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("FetchActivities", "Error fetching activities: " + databaseError.getMessage());
            }
        });

        // Set click listeners for buttons
        flashCardBtn.setOnClickListener(view -> {
            // Pass all activities to flash card activity
            if (!reviewerActivities.isEmpty()) {
                Intent intent = new Intent(CardReviewerActivity.this, FlashCard.class);
                intent.putExtra("reviewerActivities", new ArrayList<>(reviewerActivities));
                startActivity(intent);
            }
        });

        multiChoiceBtn.setOnClickListener(view -> {
            // Pass data for multiple choice activity
            if (!reviewerActivities.isEmpty()) {
                Intent intent = new Intent(CardReviewerActivity.this, MultipleChoice.class);
                intent.putExtra("reviewerActivities", new ArrayList<>(reviewerActivities));
                intent.putExtra("title", title);
                startActivity(intent);
            }
        });

        identifyBtn.setOnClickListener(view -> {
            // Pass data for identification activity
            if (!reviewerActivities.isEmpty()) {
                Intent intent = new Intent(CardReviewerActivity.this, Identification.class);
                intent.putExtra("reviewerActivities", new ArrayList<>(reviewerActivities));
                intent.putExtra("title", title);
                startActivity(intent);
            }
        });

        practiceBtn.setOnClickListener(view -> {
            // Pass data for practice question activity
            if (!reviewerActivities.isEmpty()) {
                Intent intent = new Intent(CardReviewerActivity.this, PracticeQnA.class);
                intent.putExtra("reviewerActivities", new ArrayList<>(reviewerActivities));
                intent.putExtra("title", title);
                startActivity(intent);
            }
        });

    }
}

