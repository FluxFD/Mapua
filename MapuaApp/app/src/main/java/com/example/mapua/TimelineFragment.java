package com.example.mapua;

import android.media.Image;
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;


public class TimelineFragment extends Fragment {

    private RecyclerView recyclerView;
    private TaskAdapter taskAdapter;
    private List<TaskHelpers> taskList = new ArrayList<>();

    public TimelineFragment() {
        // Required empty public constructor
    }

    public static TimelineFragment newInstance(String param1, String param2) {
        TimelineFragment fragment = new TimelineFragment();
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
        View view = inflater.inflate(R.layout.fragment_timeline, container, false);


        recyclerView = view.findViewById(R.id.timelineRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        taskAdapter = new TaskAdapter(taskList);
        recyclerView.setAdapter(taskAdapter);


        ImageView showBottomSheetButton = view.findViewById(R.id.bottom_sheet_toggle);
        showBottomSheetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Show the bottom sheet when the button is clicked
                showBottomSheet();
            }
        });
        // Fetch and log the "Task" collection
        fetchTaskCollection();
        return view;
    }

    private void fetchTaskCollection() {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference taskRef = database.getReference("Task");
        taskRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                taskList.clear(); // Clear the existing list
                for (DataSnapshot taskSnapshot : dataSnapshot.getChildren()) {
                    // Access task details
                    String course = taskSnapshot.child("Course").getValue(String.class);
                    String dueDate = taskSnapshot.child("dueDate").getValue(String.class);
                    String taskName = taskSnapshot.child("taskName").getValue(String.class);

                    // Create a TaskHelpers object and add it to the list
                    TaskHelpers task = new TaskHelpers(course, dueDate, taskName);
                    taskList.add(task);
                }
                // Notify the adapter that the data set has changed
                taskAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors
                Log.e("TimelineFragment", "Failed to read value.", databaseError.toException());
            }
        });
    }

    private void showBottomSheet() {
        TimelineBottomSheetFragment bottomSheetFragment = new TimelineBottomSheetFragment();
        bottomSheetFragment.show(getParentFragmentManager(), bottomSheetFragment.getTag());
    }
}
