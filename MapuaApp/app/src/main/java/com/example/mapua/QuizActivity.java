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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QuizActivity extends AppCompatActivity {


    private TextView questionTextView;
    private RadioButton optionARadioButton, optionBRadioButton, optionCRadioButton, optionDRadioButton;
    private List<Quiz> quizList;
    private int currentQuestionIndex;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        questionTextView = findViewById(R.id.questionTextView);
        optionARadioButton = findViewById(R.id.optionARadioButton);
        optionBRadioButton = findViewById(R.id.optionBRadioButton);
        optionCRadioButton = findViewById(R.id.optionCRadioButton);
        optionDRadioButton = findViewById(R.id.optionDRadioButton);

        quizList = new ArrayList<>();
        currentQuestionIndex = 0;


        // Get the taskName from the intent
        String taskName = getIntent().getStringExtra("taskName");

        // Use the taskName to fetch the quiz from Firebase
        DatabaseReference quizRef = FirebaseDatabase.getInstance().getReference("Quiz");
        quizRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot categorySnapshot : dataSnapshot.getChildren()) {
                    for (DataSnapshot questionSnapshot : categorySnapshot.getChildren()) {
                        String questionKey = questionSnapshot.getKey();
                        String question = (String) questionSnapshot.child("question").getValue();
                        String answer = (String) questionSnapshot.child("answer").getValue();

                        Map<String, String> choicesMap = new HashMap<>();
                        DataSnapshot choicesSnapshot = questionSnapshot.child("choices");
                        for (DataSnapshot choiceSnapshot : choicesSnapshot.getChildren()) {
                            String choiceKey = choiceSnapshot.getKey();
                            String choiceValue = (String) choiceSnapshot.getValue();
                            choicesMap.put(choiceKey, choiceValue);
                        }

                        Log.d(TAG, "Question: " + question);
                        Log.d(TAG, "Choices: " + choicesMap.toString());
                        Log.d(TAG, "Answer: " + answer);

                        Quiz quiz = new Quiz(question, choicesMap.get("A"), choicesMap.get("B"), choicesMap.get("C"), choicesMap.get("D"), answer);
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

}

class Quiz {
    private String question;
    private String choiceA;
    private String choiceB;
    private String choiceC;
    private String choiceD;
    private String answer;

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