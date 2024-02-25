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
import java.util.List;

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

                        // Retrieve choices
                        DataSnapshot choicesSnapshot = activitySnapshot.child("choices");
                        List<String> choicesList = new ArrayList<>();
                        for (DataSnapshot choiceSnapshot : choicesSnapshot.getChildren()) {
                            String choice = choiceSnapshot.getValue(String.class);
                            choicesList.add(choice);
                        }
                        String choices = TextUtils.join(", ", choicesList);

                        ActivitiesReviewerListItem reviewerActivity = new ActivitiesReviewerListItem(activityId, question, answer);
                        reviewerActivities.add(reviewerActivity);
                        Log.d("Activity", "Question: " + question + ", Answer: " + answer + ", Choices: " + choices);
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
                ActivitiesReviewerListItem activity = reviewerActivities.get(1); // Assuming the second activity
                // Pass activity data here
            }
        });

        identifyBtn.setOnClickListener(view -> {
            // Pass data for identification activity
            if (!reviewerActivities.isEmpty()) {
                ActivitiesReviewerListItem activity = reviewerActivities.get(2); // Assuming the third activity
                // Pass activity data here
            }
        });

        practiceBtn.setOnClickListener(view -> {
            // Pass data for practice question activity
            if (!reviewerActivities.isEmpty()) {
                ActivitiesReviewerListItem activity = reviewerActivities.get(3); // Assuming the fourth activity
                // Pass activity data here
            }
        });

    }
}

