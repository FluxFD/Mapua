package com.example.mapua;

import static android.content.ContentValues.TAG;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ContentFragment extends Fragment {

    private static final String ARG_PARAM1 = "param1";


    private String mParam1;

    public ContentFragment() {
        // Required empty public constructor
    }

    public static ContentFragment newInstance(String courseId) {
        ContentFragment fragment = new ContentFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, courseId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            Log.d("ContentFragment", "Course ID Checker: " + mParam1);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_content, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        String courseId = requireArguments().getString(ARG_PARAM1);
        if (courseId == null) {
            Log.e(TAG, "CourseId is null");
            return;
        }

        List<BaseCourseContent> items = new ArrayList<>();
        int totalFetchTasks = 3;
        final int[] fetchTasksComplete = {0};

        DatabaseReference database = FirebaseDatabase.getInstance().getReference();

        ValueEventListener valueEventListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                // Fetch tasks
                if (dataSnapshot.getKey().equals("Task")) {
                    for (DataSnapshot taskSnapshot : dataSnapshot.getChildren()) {
                        TaskHelpers task = taskSnapshot.getValue(TaskHelpers.class);
                        if (task != null) {
                            items.add(task);
                        }
                    }
                }
                // Fetch reviewers
                else if (dataSnapshot.getKey().equals("Reviewer")) {
                    for (DataSnapshot reviewerSnapshot : dataSnapshot.getChildren()) {
                        ReviewerHelpers reviewer = reviewerSnapshot.getValue(ReviewerHelpers.class);
                        if (reviewer != null) {
                            items.add(reviewer);
                        }
                    }
                }
                // Fetch reviewer activities
                else if (dataSnapshot.getKey().equals("ReviewerActivity")) {
                    for (DataSnapshot reviewerSnapshot : dataSnapshot.getChildren()) {
                        String reviewerId = reviewerSnapshot.getKey();
                        String course = reviewerSnapshot.child("Course").getValue(String.class);
                        String date = reviewerSnapshot.child("date").getValue(String.class);
                        String title = reviewerSnapshot.child("title").getValue(String.class);
                        List<ActivitiesReviewerListItem> activitiesReviewerListItemList = new ArrayList<>();

                        for (DataSnapshot activitySnapshot : reviewerSnapshot.child("activities").getChildren()) {
                            String activityId = activitySnapshot.getKey();
                            String question = activitySnapshot.child("question").getValue(String.class);
                            String answer = activitySnapshot.child("answer").getValue(String.class);

                            // Fetch choices
                            Map<String, String> choicesMap = new HashMap<>();
                            for (DataSnapshot choiceSnapshot : activitySnapshot.child("choices").getChildren()) {
                                String choiceKey = choiceSnapshot.getKey();
                                String choiceValue = choiceSnapshot.getValue(String.class);
                                choicesMap.put(choiceKey, choiceValue);
                            }

                            ActivitiesReviewerListItem activity = new ActivitiesReviewerListItem(activityId, question, answer, choicesMap);
                            activitiesReviewerListItemList.add(activity);
                        }
                        ReviewerActivities reviewerActivities = new ReviewerActivities(reviewerId, course, date, title);
                        reviewerActivities.setActivities(activitiesReviewerListItemList);
                        items.add(reviewerActivities);
                    }
                }

                fetchTasksComplete[0]++;
                if (fetchTasksComplete[0] == totalFetchTasks) {
                    setAdapter(items);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e(TAG, "Error fetching data", databaseError.toException());
            }
        };

        database.child("Task").orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(valueEventListener);
        database.child("Reviewer").orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(valueEventListener);
        database.child("ReviewerActivity").orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(valueEventListener);
    }


    private void setAdapter(List<BaseCourseContent> items) {
        Log.d(TAG, "Setting adapter with items: " + items);
        RecyclerView recyclerView = requireView().findViewById(R.id.courseContentRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        NewContentAdapter adapter = new NewContentAdapter(items);
        recyclerView.setAdapter(adapter);
    }

}




