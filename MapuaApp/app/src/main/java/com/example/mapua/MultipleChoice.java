package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;

import java.util.ArrayList;
import java.util.Map;

public class MultipleChoice extends AppCompatActivity {

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_multiple_choice);

        // Get the reviewerActivities from the intent
        reviewerActivities = (ArrayList<ActivitiesReviewerListItem>) getIntent().getSerializableExtra("reviewerActivities");

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
    }
}
