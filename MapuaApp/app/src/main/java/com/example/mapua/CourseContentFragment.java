package com.example.mapua;

import static android.content.ContentValues.TAG;

import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.database.annotations.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link CourseContentFragment#newInstance} factory method to
 * create an instance of this fragment.
 *
 */
public class CourseContentFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment CourseContentFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static CourseContentFragment newInstance(String courseId, String taskId) {
        CourseContentFragment fragment = new CourseContentFragment();
        Bundle args = new Bundle();
        args.putString("courseId", courseId);
        args.putString("taskId", taskId);
        fragment.setArguments(args);
        return fragment;
    }
    public CourseContentFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_course_content, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        RecyclerView courseContentRecyclerView = view.findViewById(R.id.courseContentRecyclerView);

        courseContentRecyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));

        // Get the course ID passed from CoursesFragment
        String courseId = getArguments().getString("courseId");

        // Fetch tasks for the selected course ID
        DatabaseReference tasksRef = FirebaseDatabase.getInstance().getReference("Task");
        tasksRef.orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                // Retrieve the course title for the selected course ID
                DatabaseReference courseRef = FirebaseDatabase.getInstance().getReference("Course").child(courseId);
                courseRef.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot courseSnapshot) {
                        if (courseSnapshot.exists()) {
                            Log.d(TAG, "Course Snapshot: " + courseSnapshot.toString());

                            // Create a list to hold course content strings
                            List<String> courseContentList = new ArrayList<>();

                            // Iterate through tasks and add course content strings to the list
                            for (DataSnapshot taskSnapshot : dataSnapshot.getChildren()) {
                                String courseTitle = taskSnapshot.child("Course").getValue(String.class);
                                String taskName = taskSnapshot.child("taskName").getValue(String.class);
                                String dueDate = taskSnapshot.child("dueDate").getValue(String.class);

                                // Create a course content string and add it to the list
                                String courseContent = courseTitle + "," + taskName + "," + dueDate;
                                courseContentList.add(courseContent);
                            }

                            // Create an instance of the CourseContentAdapter with the courseContentList
                            CourseContentAdapter adapter = new CourseContentAdapter(courseContentList);

                            // Set the adapter to the courseContentRecyclerView
                            courseContentRecyclerView.setAdapter(adapter);
                        } else {
                            Log.e(TAG, "Course not found for ID: " + courseId);
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError databaseError) {
                        // Handle errors
                        Log.e(TAG, "Error fetching course", databaseError.toException());
                    }
                });
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Handle errors
                Log.e(TAG, "Error fetching tasks", databaseError.toException());
            }
        });
    }


}