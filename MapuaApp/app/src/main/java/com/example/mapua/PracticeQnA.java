package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;

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


    }
}