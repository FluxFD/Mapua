package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.ArrayList;
import java.util.List;

public class AllGradeBookActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private RecyclerView recyclerView;
    private ScoreAdapter scoreAdapter;
    private List<Score> scores;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_all_grade_book);

        mAuth = FirebaseAuth.getInstance();

        recyclerView = findViewById(R.id.allGradeBookRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        scores = new ArrayList<>();
        scoreAdapter = new ScoreAdapter(scores);
        recyclerView.setAdapter(scoreAdapter);

        fetchScores();
    }

    private void fetchScores() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            return;
        }

        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference scoresRef = database.getReference("Score");
        scoresRef.orderByChild("studentId").equalTo(currentUser.getUid()).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    String taskName = snapshot.child("taskName").getValue(String.class);
                    Long score = snapshot.child("score").getValue(Long.class);

                    scores.add(new Score(taskName, score.intValue()));
                }
                scoreAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Handle error
            }
        });
    }
}
