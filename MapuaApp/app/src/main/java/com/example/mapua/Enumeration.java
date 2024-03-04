package com.example.mapua;


import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.Firebase;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class Enumeration extends AppCompatActivity {
    private FirebaseAuth mAuth;
    private EnumAdapter adapter;
    private List<EnumActivity> activities;

    private final HashMap<Integer,List<String>> enumAnswerMap = new HashMap<>();

    private final HashMap<Integer,List<String>> enumInputAnswerMap = new HashMap<>();

    private final List<HashMap<String, Object>> userEnumScore = new ArrayList<>();
    RecyclerView recyclerView;
    int score = 0;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_enumeration);

        mAuth = FirebaseAuth.getInstance();

        // Get the intent that started this activity
        Bundle extras = getIntent().getExtras();
        if (extras != null) {
            // Retrieve the ArrayList from the intent
            String courseId = extras.getString("courseId");
            String title = extras.getString("title");
            Log.d("Enumeration", "CourseId: " + courseId);
            Log.d("Enumeration", "Title: " + title);

        }

        Button enumSubmit = findViewById(R.id.enumSubmit);

        recyclerView = findViewById(R.id.enumRecyclerView);
        activities = new ArrayList<>();
        adapter = new EnumAdapter(activities, enumAnswerMap,enumInputAnswerMap);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        fetchEnum();

        enumSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkEnumAns();
            }
        });


    }

    private void checkEnumAns(){


        for (int i = 0; i < activities.size(); i++){

            List <String> inputAnswers = adapter.getUserInput(i);
            List <String> correctAnswers = enumAnswerMap.get(i);

            EnumActivity activity = activities.get(i);

            HashMap<String, Object> scoreEntry = new HashMap<>();
            scoreEntry.put("question", activity.getQuestion());
            scoreEntry.put("correctAnswers", correctAnswers);
            scoreEntry.put("userEnumAnswers", inputAnswers);
            boolean isCorrect = false;


            for (String input : inputAnswers){
                if (correctAnswers.contains(input)){
                   score++;
                   isCorrect = true;
                }
            }
            scoreEntry.put("isCorrect", isCorrect);
            userEnumScore.add(scoreEntry);

        }
        saveScoreToDb();
        Log.d("Enumeration", "Your Score is " + score);
    }

    private void saveScoreToDb(){
        HashMap<String, Object> enumUserScoreCollection = new HashMap<>();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null){
            Log.e("Enumeration", "User is not logged in");
        }

        String title = getIntent().getStringExtra("title");
        String taskName = title;

        DatabaseReference studentRef = FirebaseDatabase.getInstance().getReference("students").child(currentUser.getUid());
        DatabaseReference scoresRef = FirebaseDatabase.getInstance().getReference("Score"); // Move this outside the ValueEventListener
        String key = scoresRef.push().getKey();

        studentRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists() && snapshot.hasChild("name")){
                    String studentName = snapshot.child("name").getValue(String.class);
                    if (studentName!=null){
                        if (taskName != null && key != null){
                            enumUserScoreCollection.put("studentId", currentUser.getUid());
                            enumUserScoreCollection.put("score", score);
                            enumUserScoreCollection.put("studentName", studentName);
                            enumUserScoreCollection.put("taskName", title);
                            enumUserScoreCollection.put("scores", userEnumScore);
                            scoresRef.child(key).setValue(enumUserScoreCollection);
                        }
                    }
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });



    }

    private void fetchEnum(){
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference().child("Enumeration");

        String courseId = getIntent().getStringExtra("courseId");

        Query query = databaseReference.orderByChild("Course").equalTo(courseId);

        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    EnumerationObject enumerationObject = snapshot.getValue(EnumerationObject.class);
                    if (enumerationObject != null) {
                        Log.d("EnumerationObject", "Course: " + enumerationObject.getCourse());
                        Log.d("EnumerationObject", "CreatedBy: " + enumerationObject.getCreatedBy());
                        Log.d("EnumerationObject", "Date: " + enumerationObject.getDate());
                        Log.d("EnumerationObject", "Title: " + enumerationObject.getTitle());

                        if (enumerationObject.getActivities() != null) {
                            for (Map.Entry<String, EnumActivity> entry : enumerationObject.getActivities().entrySet()) {
                                EnumActivity activity = entry.getValue();
                                Log.d("EnumerationObject", "Activity - Question: " + activity.getQuestion());
                                Log.d("EnumerationObject", "Activity - QuestionType: " + activity.getQuestionType());
                                if (activity.getAnswer() != null) {
                                    for (String answer : activity.getAnswer()) {
                                        Log.d("EnumerationObject", "Activity - Answer: " + answer);
                                    }
                                    activities.add(entry.getValue());
                                }
                            }

                        }
                    }
                }
                adapter.notifyDataSetChanged();
            }


            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle potential errors
                Log.e("EnumerationObject", "Failed to parse enumerationObject");
            }
        });
    }
}
