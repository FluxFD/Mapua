package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class MessageActivity extends AppCompatActivity implements CoursesAdapter.OnCourseClickListener {

    private RecyclerView recyclerViewCourses;
    private CoursesAdapter coursesAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_message);

        String username = getIntent().getStringExtra("username");
        String usernum = getIntent().getStringExtra("usernum");

        // Log the username and usernum
        Log.d("MessageActivity", "Username: " + username + ", Usernum: " + usernum);

        recyclerViewCourses = findViewById(R.id.messageRecyclerView);
        recyclerViewCourses.setLayoutManager(new LinearLayoutManager(this));

        fetchCourseCollection();
    }

    private void fetchCourseCollection() {
        FirebaseDatabase database = FirebaseDatabase.getInstance();
        DatabaseReference courseRef = database.getReference("Course");
        courseRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                List<String> courseIds = new ArrayList<>();
                for (DataSnapshot courseSnapshot : dataSnapshot.getChildren()) {
                    String courseName = courseSnapshot.getKey();
                    String createdBy = courseSnapshot.child("createdBy").getValue(String.class);
                    Log.d("FetchCourse", "Course Name: " + courseName + ", Created By: " + createdBy);
                    courseIds.add(courseName);
                }
                // Initialize and set the adapter
                coursesAdapter = new CoursesAdapter(courseIds, MessageActivity.this);
                recyclerViewCourses.setAdapter(coursesAdapter);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors
                Log.e("FetchCourse", "Failed to read value.", databaseError.toException());
            }
        });
    }

    @Override
    public void onCourseClick(String courseId) {
        // Handle course click event
        Intent intent = new Intent(MessageActivity.this, ChatActivity.class);
        intent.putExtra("courseId", courseId);
        intent.putExtra("username", getIntent().getStringExtra("username"));
        intent.putExtra("usernum", getIntent().getStringExtra("usernum"));
        startActivity(intent);
    }
}
