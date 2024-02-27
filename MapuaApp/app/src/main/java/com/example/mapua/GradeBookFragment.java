package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.firebase.Firebase;
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


public class GradeBookFragment extends Fragment {

    private String courseId;
    private RecyclerView recyclerView;
    private ScoreAdapter adapter;
    private List<Score> scoresList;


    public GradeBookFragment() {
        // Required empty public constructor
    }

    public static GradeBookFragment newInstance(String courseId) {
        GradeBookFragment fragment = new GradeBookFragment();
        Bundle args = new Bundle();
        args.putString("courseId", courseId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            courseId = getArguments().getString("courseId");
            Log.d("GradeBookFragment", "Fetched courseId: " + courseId);
        }

        scoresList = new ArrayList<>(); // Initialize scoresList here

        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = mAuth.getCurrentUser();

        if (currentUser != null) {
            String studentId = currentUser.getUid();

            DatabaseReference scoreRef = FirebaseDatabase.getInstance().getReference("Score");
            scoreRef.orderByChild("studentId").equalTo(studentId).addListenerForSingleValueEvent(new ValueEventListener() {
                @Override
                public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                    for (DataSnapshot scoreSnapshot : dataSnapshot.getChildren()) {
                        String fetchedTaskName = scoreSnapshot.child("taskName").getValue(String.class);
                        String fetchedScore = String.valueOf(scoreSnapshot.child("score").getValue());
                        // Fetch the score value

                        if (fetchedTaskName != null && fetchedScore != null) {
                            fetchTask(courseId, fetchedTaskName, scoreSnapshot);
                            fetchReviewerActivity(courseId, fetchedTaskName, studentId, currentUser);
                            scoresList.add(new Score(fetchedTaskName, Integer.parseInt(fetchedScore)));
                            // Add the fetched score to scoresList
                        }
                    }
                    adapter.notifyDataSetChanged();
                }

                @Override
                public void onCancelled(@NonNull DatabaseError databaseError) {
                    Log.e("ScoreFetch", "Failed to fetch score: " + databaseError.getMessage());
                    // Add more robust error handling here
                }
            });
        } else {
            Log.e("GradeBookFragment", "Current user is null.");
        }
    }


    private void fetchTask(String courseId, String taskName, DataSnapshot scoreSnapshot) {
        DatabaseReference taskRef = FirebaseDatabase.getInstance().getReference("Task");
        taskRef.orderByChild("taskName").equalTo(taskName).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot taskSnapshot : dataSnapshot.getChildren()) {
                    String fetchedCourseId = taskSnapshot.child("Course").getValue(String.class);
                    if (fetchedCourseId != null && fetchedCourseId.equals(courseId)) {
                        // TaskName belongs to the courseId
                        Log.d("Validation", "TaskName " + taskName + " belongs to courseId " + courseId);
                        // Retrieve the score as Long and then convert it to String
                        Long fetchedScoreLong = scoreSnapshot.child("score").getValue(Long.class);
                        String fetchedScore = String.valueOf(fetchedScoreLong);
                        Log.d("ScoreFetchTask", "Score: " + fetchedScore);
                        scoresList.add(new Score(taskName, Integer.parseInt(fetchedScore)));
                    }
                }
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("Validation", "Failed to fetch task: " + databaseError.getMessage());
                // Add more robust error handling here
            }
        });
    }



    private void fetchReviewerActivity(String courseId, String taskName, String studentId, FirebaseUser currentUser) {
        DatabaseReference reviewerRef = FirebaseDatabase.getInstance().getReference("ReviewerActivity");
        reviewerRef.orderByChild("title").equalTo(taskName).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                for (DataSnapshot reviewerSnapshot : dataSnapshot.getChildren()) {
                    String reviewerTaskName = reviewerSnapshot.child("title").getValue(String.class);
                    String reviewerCourseId = reviewerSnapshot.child("Course").getValue(String.class);

                    if (reviewerTaskName != null && reviewerCourseId != null && studentId.equals(currentUser.getUid())) {
                        Log.d("ReviewerActivity", "TaskName " + taskName + " matches the title field in ReviewerActivity and belongs to courseId " + courseId + " for studentId " + studentId);

                        // Fetch the score for the taskName from Score node
                        DatabaseReference scoreRef = FirebaseDatabase.getInstance().getReference("Score");
                        scoreRef.orderByChild("taskName")
                                .equalTo(taskName)
                                .addListenerForSingleValueEvent(new ValueEventListener() {
                                    @Override
                                    public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                                        for (DataSnapshot scoreSnapshot : dataSnapshot.getChildren()) {
                                            // Fetch and log the studentId
                                            String fetchedStudentId = scoreSnapshot.child("studentId").getValue(String.class);

                                            // Check if the fetched studentId matches the current user's ID
                                            if (fetchedStudentId != null && fetchedStudentId.equals(currentUser.getUid())) {
                                                // Fetch and log the score
                                                Long fetchedScoreLong = scoreSnapshot.child("score").getValue(Long.class);
                                                String fetchedScore = String.valueOf(fetchedScoreLong);

                                                Log.d("ScoreFetchReviewerAct", "StudentId: " + fetchedStudentId + ", Score: " + fetchedScore);
                                            }
                                        }
                                        adapter.notifyDataSetChanged();
                                    }

                                    @Override
                                    public void onCancelled(@NonNull DatabaseError databaseError) {
                                        Log.e("ScoreFetch", "Failed to fetch score: " + databaseError.getMessage());
                                        // Add more robust error handling here
                                    }
                                });
                    } else {
                        Log.e("ReviewerActivity", "One of the variables is null. reviewerTaskName: " + reviewerTaskName + ", reviewerCourseId: " + reviewerCourseId);
                    }
                }
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e("ReviewerActivity", "Failed to fetch reviewer activity: " + databaseError.getMessage());
                // Add more robust error handling here
            }
        });
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_grade_book, container, false);
        recyclerView = view.findViewById(R.id.recyclerViewGradeBook);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        scoresList = new ArrayList<>();
        adapter = new ScoreAdapter(scoresList);
        recyclerView.setAdapter(adapter);
        return view;
    }
}
