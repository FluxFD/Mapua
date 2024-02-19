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
                                String courseTitle = taskSnapshot.child("Course").getValue(String.class);
                                String taskName = taskSnapshot.child("taskName").getValue(String.class);
                                String dueDate = taskSnapshot.child("dueDate").getValue(String.class);

                                String courseContent = courseTitle + "," + taskName + "," + dueDate;
                                courseContentList.add(courseContent);
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
    }

}
