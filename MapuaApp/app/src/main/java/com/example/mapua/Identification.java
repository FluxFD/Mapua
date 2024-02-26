package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;

import java.util.ArrayList;
import java.util.Map;

public class Identification extends AppCompatActivity {

    private ArrayList<ActivitiesReviewerListItem> reviewerActivities;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_identification);

        reviewerActivities = (ArrayList<ActivitiesReviewerListItem>) getIntent().getSerializableExtra("reviewerActivities");

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

    }


}