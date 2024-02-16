package com.example.mapua;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class QuizActivity extends AppCompatActivity {


    private TextView questionTextView;
    private RadioButton optionARadioButton, optionBRadioButton, optionCRadioButton, optionDRadioButton;
    private Button actionButton;
    private List<Quiz> quizList;
    private int currentQuestionIndex;
    private int score;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        questionTextView = findViewById(R.id.questionTextView);
        optionARadioButton = findViewById(R.id.optionARadioButton);
        optionBRadioButton = findViewById(R.id.optionBRadioButton);
        optionCRadioButton = findViewById(R.id.optionCRadioButton);
        optionDRadioButton = findViewById(R.id.optionDRadioButton);
        actionButton = findViewById(R.id.submitButton);

        quizList = new ArrayList<>();
        currentQuestionIndex = 0;
        score = 0;

        // Get the taskName from the intent
        String taskName = getIntent().getStringExtra("taskName");

        // Use the taskName to fetch the quiz from Firebase
        DatabaseReference quizRef = FirebaseDatabase.getInstance().getReference("Quiz");
        quizRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot categorySnapshot : dataSnapshot.getChildren()) {
                    for (DataSnapshot questionSnapshot : categorySnapshot.getChildren()) {
                        Quiz quiz = new Quiz();
                        for (DataSnapshot answerSnapshot : questionSnapshot.getChildren()) {
                            String answerKey = answerSnapshot.getKey();
                            String value = answerSnapshot.getValue(String.class);

                            switch (answerKey) {
                                case "question":
                                    quiz.setQuestion(value);
                                    break;
                                case "choiceA":
                                    quiz.setChoiceA(value);
                                    break;
                                case "choiceB":
                                    quiz.setChoiceB(value);
                                    break;
                                case "choiceC":
                                    quiz.setChoiceC(value);
                                    break;
                                case "choiceD":
                                    quiz.setChoiceD(value);
                                    break;
                                case "answer":
                                    quiz.setAnswer(value);
                                    break;
                            }
                        }
                        quizList.add(quiz);
                    }
                }
                // Display the first question
                displayQuestion();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Error fetching quizzes
            }
        });

        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (currentQuestionIndex < quizList.size()) {
                    // Display the next question
                    displayQuestion();
                    if (currentQuestionIndex == quizList.size() - 1) {
                        actionButton.setText("Submit");
                    } else {
                        actionButton.setText("Next");
                    }
                } else {
                    // End of quiz, calculate and log the score
                    logScore();
                }
            }
        });
    }

    private void displayQuestion() {
        Quiz currentQuiz = quizList.get(currentQuestionIndex);
        questionTextView.setText(currentQuiz.getQuestion());
        optionARadioButton.setText(currentQuiz.getChoiceA());
        optionBRadioButton.setText(currentQuiz.getChoiceB());
        optionCRadioButton.setText(currentQuiz.getChoiceC());
        optionDRadioButton.setText(currentQuiz.getChoiceD());
        currentQuestionIndex++;
    }

    private void logScore() {
        Log.d(TAG, "Score: " + score);
        // You can also save the score to Firebase or perform other actions
    }
}

class Quiz {
    private String question;
    private String choiceA;
    private String choiceB;
    private String choiceC;
    private String choiceD;
    private String answer;
    private Map<String, Object> nestedData; // Map to hold nested data

    public Quiz() {
        // Default constructor required for calls to DataSnapshot.getValue(Quiz.class)
    }

    public Quiz(String question, String choiceA, String choiceB, String choiceC, String choiceD, String answer) {
        this.question = question;
        this.choiceA = choiceA;
        this.choiceB = choiceB;
        this.choiceC = choiceC;
        this.choiceD = choiceD;
        this.answer = answer;
    }

    public Map<String, Object> getNestedData() {
        return nestedData;
    }

    public void setNestedData(Map<String, Object> nestedData) {
        this.nestedData = nestedData;
        // Set other fields based on nestedData if needed
        if (nestedData != null) {
            this.question = (String) nestedData.get("question");
            this.choiceA = (String) nestedData.get("choiceA");
            this.choiceB = (String) nestedData.get("choiceB");
            this.choiceC = (String) nestedData.get("choiceC");
            this.choiceD = (String) nestedData.get("choiceD");
            this.answer = (String) nestedData.get("answer");
        }
    }

    // Getters and setters
    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getChoiceA() {
        return choiceA;
    }

    public void setChoiceA(String choiceA) {
        this.choiceA = choiceA;
    }

    public String getChoiceB() {
        return choiceB;
    }

    public void setChoiceB(String choiceB) {
        this.choiceB = choiceB;
    }

    public String getChoiceC() {
        return choiceC;
    }

    public void setChoiceC(String choiceC) {
        this.choiceC = choiceC;
    }

    public String getChoiceD() {
        return choiceD;
    }

    public void setChoiceD(String choiceD) {
        this.choiceD = choiceD;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }
}