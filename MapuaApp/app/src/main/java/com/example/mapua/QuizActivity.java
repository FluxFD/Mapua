package com.example.mapua;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

public class QuizActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        // Get the taskName from the intent
        String taskName = getIntent().getStringExtra("taskName");

        // Use the taskName to fetch the quiz from Firebase
        DatabaseReference quizRef = FirebaseDatabase.getInstance().getReference("Quiz");
        quizRef.child(taskName).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                Quiz quiz = null;
                for (DataSnapshot childSnapshot : dataSnapshot.getChildren()) {
                    // Assuming quiz data is stored as an object
                    quiz = childSnapshot.getValue(Quiz.class);
                    if (quiz != null) {
                        Log.d(TAG, "Question: " + quiz.getQuestion());
                        Log.d(TAG, "ChoiceA: " + quiz.getChoiceA());
                        Log.d(TAG, "ChoiceB: " + quiz.getChoiceB());
                        Log.d(TAG, "ChoiceC: " + quiz.getChoiceC());
                        Log.d(TAG, "ChoiceD: " + quiz.getChoiceD());
                        Log.d(TAG, "Answer: " + quiz.getAnswer());

                    }
                }
                if (quiz == null) {
                    Log.e(TAG, "Quiz not found for taskName: " + taskName);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Error fetching quiz
            }
        });
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