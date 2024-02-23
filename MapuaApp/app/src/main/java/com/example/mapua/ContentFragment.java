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
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;

import com.google.android.material.tabs.TabLayout;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;


import java.util.ArrayList;
import java.util.List;

public class ContentFragment extends Fragment {

    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private String mParam1;
    private String mParam2;

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

        RecyclerView courseContentRecyclerView = view.findViewById(R.id.courseContentRecyclerView);
        courseContentRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        RecyclerView courseReviewertRecyclerView = view.findViewById(R.id.courseReviewerRecyclerView);
        courseReviewertRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        RecyclerView courseReviewerCardRecyclerView = view.findViewById(R.id.courseReviewerCardRecyclerView);
        courseReviewerCardRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        String courseId = requireArguments().getString("courseId");
        if (courseId == null) {
            Log.e(TAG, "CourseId is null");
            return;
        }

        DatabaseReference tasksRef = FirebaseDatabase.getInstance().getReference("Task");
        tasksRef.orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                DatabaseReference courseRef = FirebaseDatabase.getInstance().getReference("Course").child(courseId);
                courseRef.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot courseSnapshot) {
                        if (courseSnapshot.exists()) {
                            Log.d(TAG, "Course Snapshot: " + courseSnapshot.toString());

                            List<String> courseContentList = new ArrayList<>();

                            for (DataSnapshot taskSnapshot : dataSnapshot.getChildren()) {
                                Task task = taskSnapshot.getValue(Task.class);
                                if (task != null) {
                                    String courseContent = task.getCourse() + "," + task.getTaskName() + "," + task.getDueDate();
                                    courseContentList.add(courseContent);
                                }
                            }

                            // Pass the context to the adapter
                            CourseContentAdapter adapter = new CourseContentAdapter(requireContext(), courseContentList);
                            courseContentRecyclerView.setAdapter(adapter);
                        } else {
                            Log.e(TAG, "Course not found for ID: " + courseId);
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError databaseError) {
                        Log.e(TAG, "Error fetching course", databaseError.toException());
                    }
                });
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e(TAG, "Error fetching tasks", databaseError.toException());
            }
        });

        DatabaseReference reviewersRef = FirebaseDatabase.getInstance().getReference("Reviewer");
        reviewersRef.orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                List<Reviewer> reviewersList = new ArrayList<>();

                for (DataSnapshot reviewerSnapshot : dataSnapshot.getChildren()) {
                    Reviewer reviewer = reviewerSnapshot.getValue(Reviewer.class);
                    if (reviewer != null) {
                        reviewersList.add(reviewer);
                    }
                }
                Log.d(TAG, "Reviewers DataSnapshot: " + dataSnapshot.getValue());
                // Pass the context and reviewers list to the adapter
                ReviewerAdapter adapter = new ReviewerAdapter(requireContext(), reviewersList);
                courseReviewertRecyclerView.setAdapter(adapter);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e(TAG, "Error fetching reviewers", databaseError.toException());
            }
        });

        DatabaseReference reviewerActivityRef = FirebaseDatabase.getInstance().getReference("ReviewerActivity");
        reviewerActivityRef.orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                List<ReviewerActivityHelpers.Reviewer> reviewers = new ArrayList<>();
                for (DataSnapshot reviewerSnapshot : snapshot.getChildren()) {

                    String reviewerId = reviewerSnapshot.getKey(); // Get the reviewer ID
                    String course = reviewerSnapshot.child("Course").getValue(String.class); // Get the course
                    String date = reviewerSnapshot.child("date").getValue(String.class); // Get the date
                    String title = reviewerSnapshot.child("title").getValue(String.class); // Get the title
                    Log.d("ReviewActivity", "Reviewer ID: " + reviewerId + ", Course: " + course + ", Date: " + date + ", Title: " + title);
                    List<ReviewerActivityHelpers.Activities> activities = new ArrayList<>();
                    // Iterate over the activities
                    for (DataSnapshot activitySnapshot : reviewerSnapshot.child("activities").getChildren()) {
                        String activityId = activitySnapshot.getKey(); // Get the activity ID
                        String question = activitySnapshot.child("question").getValue(String.class); // Get the question
                        String answer = activitySnapshot.child("answer").getValue(String.class); // Get the answer
                        Log.d("ReviewActivity", "  Activity ID: " + activityId + ", Question: " + question + ", Answer: " + answer);
                        activities.add(new ReviewerActivityHelpers.Activities(activityId, question, answer));
                        // Process the data as needed
                    }
                    reviewers.add(new ReviewerActivityHelpers.Reviewer(reviewerId, course, date, title, activities));
                }
                ReviewerActivityAdapter adapter = new ReviewerActivityAdapter(reviewers);
                courseReviewerCardRecyclerView.setAdapter(adapter);
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.e("ReviewActivity", "Database error: " + error.getMessage());
            }
        });

    }

}



class Task {
    private String Course;
    private String dueDate;
    private String taskName;

    public Task() {
        // Default constructor required for calls to DataSnapshot.getValue(Task.class)
    }

    public Task(String course, String dueDate, String taskName) {
        this.Course = course;
        this.dueDate = dueDate;
        this.taskName = taskName;
    }

    public String getCourse() {
        return Course;
    }

    public void setCourse(String course) {
        this.Course = course;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
}

class Reviewer {
    private String Course;
    private String createdBy;
    private String file;
    private String title;

    public Reviewer() {
        // Default constructor required for calls to DataSnapshot.getValue(Reviewer.class)
    }

    public Reviewer(String course, String createdBy, String file, String title) {
        this.Course = course;
        this.createdBy = createdBy;
        this.file = file;
        this.title = title;
    }

    public String getCourse() {
        return Course;
    }

    public void setCourse(String course) {
        this.Course = course;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
