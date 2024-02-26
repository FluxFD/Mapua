package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;

public class PracticeQnA extends AppCompatActivity {

    private FirebaseAuth mAuth;

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_practice_qn);

        reviewerActivities = (ArrayList<ActivitiesReviewerListItem>) getIntent().getSerializableExtra("reviewerActivities");
        mAuth = FirebaseAuth.getInstance();
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            for (String key : extras.keySet()) {
                Object value = extras.get(key);
                Log.d("PracticeQnA", "Key: " + key + ", Value: " + value);
            }
        }

        for (int i = 0; i < reviewerActivities.size(); i++) {
            ActivitiesReviewerListItem activity = reviewerActivities.get(i);
            Log.d("PracticeQnA", "Activity " + i + ":");
            Log.d("PracticeQnA", "  ID: " + activity.getActivityId());
            Log.d("PracticeQnA", "  Question: " + activity.getQuestion());
            Log.d("PracticeQnA", "  Question Type: " + activity.getQuestionType());
            Log.d("PracticeQnA", "  Answer: " + activity.getAnswer());
            Log.d("PracticeQnA", "  Choices: " + activity.getChoices());
        }

        Button noTimerBtn = findViewById(R.id.noTimerBtn);
        noTimerBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startWithoutTimer();
            }
        });

        Button timerBtn = findViewById(R.id.timerBtn);
        timerBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startWithTimer();
            }
        });

    }

    private void startWithoutTimer() {
        Intent intent = new Intent(PracticeQnA.this, PracticeWithoutTime.class);
        intent.putExtra("reviewerActivities", reviewerActivities);
        startActivity(intent);
    }

    private void startWithTimer() {
        Intent intent = new Intent(PracticeQnA.this, PracticeWithTime.class);
        intent.putExtra("reviewerActivities", reviewerActivities);
        startActivity(intent);
    }


}