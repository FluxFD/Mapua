package com.example.mapua;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

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

public class QuizActivity extends AppCompatActivity {

    private List<Quiz> quizList;
    private RecyclerView quizRecyclerView;
    private QuizQuestionAdapter quizAdapter;
    private Button submitBtn;
    private int score;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        quizRecyclerView = findViewById(R.id.quizRecyclerView);
        submitBtn = findViewById(R.id.submitBtn);

        quizList = new ArrayList<>();
        score = 0;

        // Get the taskName from the intent
        String taskName = getIntent().getStringExtra("taskName");

        // Use the taskName to fetch the quiz from Firebase
        DatabaseReference quizRef = FirebaseDatabase.getInstance().getReference("Quiz").child(taskName);
        quizRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot questionSnapshot : dataSnapshot.getChildren()) {
                    String question = (String) questionSnapshot.child("question").getValue();
                    String answer = (String) questionSnapshot.child("answer").getValue();

                    Map<String, String> choicesMap = new HashMap<>();
                    for (DataSnapshot choiceSnapshot : questionSnapshot.child("choices").getChildren()) {
                        String choiceKey = choiceSnapshot.getKey();
                        String choiceValue = (String) choiceSnapshot.getValue();
                        choicesMap.put(choiceKey, choiceValue);
                    }

                    Quiz quiz = new Quiz(question, choicesMap, answer);
                    quizList.add(quiz);
                }

                // Initialize RecyclerView and adapter
                quizAdapter = new QuizQuestionAdapter(quizList);
                quizRecyclerView.setAdapter(quizAdapter);
                quizRecyclerView.setLayoutManager(new LinearLayoutManager(QuizActivity.this));
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e(TAG, "Error fetching quiz data", databaseError.toException());
            }
        });

        // Set click listener for submit button
        submitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Calculate the score
                score = calculateScore();
                // Display the score (you can show it in a Toast or a dialog)
                Toast.makeText(QuizActivity.this, "Your score is: " + score, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private int calculateScore() {
        int score = 0;
        for (Quiz quiz : quizList) {
            if (quiz.getSelectedAnswer() != null && quiz.getSelectedAnswer().equals(quiz.getAnswer())) {
                score++;
            }
        }
        return score;
    }
}


class Quiz {

    private String question;
    private Map<String, String> choices;
    private String answer;
    private String selectedAnswer; // New field for the selected answer

    public Quiz() {
        // Default constructor required for calls to DataSnapshot.getValue(Quiz.class)
    }

    public Quiz(String question, Map<String, String> choices, String answer) {
        this.question = question;
        this.choices = choices;
        this.answer = answer;
    }

    public String getQuestion() {
        return question;
    }

    public Map<String, String> getChoices() {
        return choices;
    }

    public String getAnswer() {
        return answer;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}