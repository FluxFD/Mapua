package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CalendarView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class CourseCalendarFragment extends Fragment {

    private String courseId;
    private List<BaseCourseContent> items = new ArrayList<>();
    private NewContentAdapter adapter;

    public CourseCalendarFragment() {
        // Required empty public constructor
    }

    public static CourseCalendarFragment newInstance(String courseId) {
        CourseCalendarFragment fragment = new CourseCalendarFragment();
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
            Log.d("CourseCalendarFragment", "Fetched courseId: " + courseId);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_course_calendar, container, false);
        CalendarView calendarView = view.findViewById(R.id.courseCalendarView);
        long currentDate = System.currentTimeMillis();
        calendarView.setDate(currentDate);

        RecyclerView recyclerView = view.findViewById(R.id.courseCalendarRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new NewContentAdapter(items);
        recyclerView.setAdapter(adapter);

        if (courseId != null) {
            fetchTasks(courseId);
        }

        return view;
    }

    private void fetchTasks(String courseId) {
        DatabaseReference tasksRef = FirebaseDatabase.getInstance().getReference("Task");

        tasksRef.orderByChild("Course").equalTo(courseId).addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                items.clear(); // Clear the list before adding new items
                for (DataSnapshot taskSnapshot : dataSnapshot.getChildren()) {
                    // Get the task details
                    String course = taskSnapshot.child("Course").getValue(String.class);
                    String dueDate = taskSnapshot.child("dueDate").getValue(String.class);
                    String taskName = taskSnapshot.child("taskName").getValue(String.class);

                    // Create a Task object and add it to the list
                    TaskHelpers task = new TaskHelpers(course, dueDate, taskName);
                    items.add(task);
                }
                // Notify the adapter that the data has changed
                adapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors
            }
        });
    }
}
