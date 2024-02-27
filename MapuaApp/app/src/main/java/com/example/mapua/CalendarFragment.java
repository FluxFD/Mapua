package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

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


public class CalendarFragment extends Fragment {


    public CalendarFragment() {
        // Required empty public constructor
    }

    public static CalendarFragment newInstance(String param1, String param2) {
        CalendarFragment fragment = new CalendarFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {

        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_calendar, container, false);
        CalendarView calendarView = view.findViewById(R.id.calendarView);
        long currentDate = System.currentTimeMillis();
        calendarView.setDate(currentDate);

        List<BaseCourseContent> items = new ArrayList<>();
        RecyclerView recyclerView = view.findViewById(R.id.calendarRecycleView);
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        NewContentAdapter adapter = new NewContentAdapter(items);
        recyclerView.setAdapter(adapter);

        // Reference to your "Task" collection
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference("Task");
        databaseReference.addValueEventListener(new ValueEventListener() {
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

        return view;
    }
}