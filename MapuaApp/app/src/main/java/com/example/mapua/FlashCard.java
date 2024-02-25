package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class FlashCard extends AppCompatActivity {

    private TextView questionTextView, answerTextView;
    private List<ActivitiesReviewerListItem> activitiesList;
    private int currentActivityIndex = 0;
    private boolean showingQuestion = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_flash_card);

        // Get the activities list from the intent
        Intent intent = getIntent();
        if (intent != null) {
            activitiesList = intent.getParcelableArrayListExtra("reviewerActivities");
        }

        // Initialize UI elements
        questionTextView = findViewById(R.id.questionTextView);
        answerTextView = findViewById(R.id.answerTextView);
        Button nextButton = findViewById(R.id.nextButton);
        Button previousButton = findViewById(R.id.previousButton);

        // Display the first question
        showQuestion();

        // Set click listener for the question TextView to show the answer
        questionTextView.setOnClickListener(view -> showAnswer());

        // Set click listener for the answer TextView to show the question
        answerTextView.setOnClickListener(view -> showQuestion());

        // Set click listener for the next button to load the next set of question and answer
        nextButton.setOnClickListener(view -> {
            currentActivityIndex++;
            if (currentActivityIndex < activitiesList.size()) {
                showQuestion();
            } else {
                // End of activities list, show a message or handle as needed
                Toast.makeText(this, "End of flashcards", Toast.LENGTH_SHORT).show();
            }
        });

        previousButton.setOnClickListener(view -> {
            currentActivityIndex--;
            if (currentActivityIndex >= 0) {
                showQuestion();
            } else {
                // Beginning of activities list, show a message or handle as needed
                Toast.makeText(this, "Beginning of flashcards", Toast.LENGTH_SHORT).show();
                currentActivityIndex = 0; // Reset to prevent going below 0
            }
        });
    }

    private void showQuestion() {
        ActivitiesReviewerListItem activity = activitiesList.get(currentActivityIndex);
        questionTextView.setText(activity.getQuestion());
        answerTextView.setVisibility(View.GONE);
        showingQuestion = true;
    }

    private void showAnswer() {
        if (currentActivityIndex < activitiesList.size()) {
            ActivitiesReviewerListItem activity = activitiesList.get(currentActivityIndex);
            answerTextView.setText(activity.getAnswer());
            answerTextView.setVisibility(View.VISIBLE);
            showingQuestion = false;
        }
    }


}