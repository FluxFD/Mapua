package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;

import com.google.firebase.auth.FirebaseAuth;

import java.util.ArrayList;
import java.util.List;

public class PracticeWithoutTime extends AppCompatActivity {

    private FirebaseAuth mAuth;

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;

    private RecyclerView recyclerView;
    private QuestionAdapter adapter;
    private List<ActivitiesReviewerListItem> questions;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_practice_without_time);

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
            Log.d("PracticeWithoutTime", "Activity " + i + ":");
            Log.d("PracticeWithoutTime", "  ID: " + activity.getActivityId());
            Log.d("PracticeWithoutTime", "  Question: " + activity.getQuestion());
            Log.d("PracticeWithoutTime", "  Question Type: " + activity.getQuestionType());
            Log.d("PracticeWithoutTime", "  Answer: " + activity.getAnswer());
            Log.d("PracticeWithoutTime", "  Choices: " + activity.getChoices());
        }

        recyclerView = findViewById(R.id.recyclerViewPracticeNoTimer);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Populate questions list based on questionType
        questions = new ArrayList<>();
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
        recyclerView.setAdapter(adapter);

    }
}