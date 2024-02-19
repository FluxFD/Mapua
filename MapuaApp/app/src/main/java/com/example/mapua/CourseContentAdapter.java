package com.example.mapua;

import static android.content.ContentValues.TAG;

import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Context;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.List;

public class CourseContentAdapter extends RecyclerView.Adapter<CourseContentAdapter.CourseViewHolder> {
    private List<String> courseContent;
    private Context context;
    private FirebaseAuth mAuth;

    public CourseContentAdapter(Context context, List<String> courseContent) {
        this.context = context;
        this.courseContent = courseContent;
        mAuth = FirebaseAuth.getInstance();
    }

    @NonNull
    @Override
    public CourseViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course_content, parent, false);
        return new CourseViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CourseViewHolder holder, int position) {
        String courseContentItem = courseContent.get(position);
        if (courseContentItem != null) {
            String[] parts = courseContentItem.split(",");
            if (parts.length >= 3) {
                holder.courseTitleTextView.setText(parts[0]);
                holder.courseTaskNameTextView.setText(parts[1]);
                holder.courseDueDateTextView.setText(parts[2]);

                // Set click listener to start the next activity
                holder.itemView.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if (parts.length >= 3) {
                            String taskName = parts[1];
                            if (taskName != null && !taskName.isEmpty()) {
                                checkIfUserHasTakenTask(taskName, context);
                            } else {
                                Log.e(TAG, "Invalid taskName: " + taskName);
                            }
                        } else {
                            Log.e(TAG, "Invalid parts length: " + parts.length);
                        }
                    }
                });
            } else {
                Log.e(TAG, "Invalid parts length: " + parts.length);
            }
        }
    }

    @Override
    public int getItemCount() {
        return courseContent.size();
    }

    public static class CourseViewHolder extends RecyclerView.ViewHolder {
        TextView courseTitleTextView;
        TextView courseTaskNameTextView;
        TextView courseDueDateTextView;

        public CourseViewHolder(@NonNull View itemView) {
            super(itemView);
            courseTitleTextView = itemView.findViewById(R.id.courseTitleTextView);
            courseTaskNameTextView = itemView.findViewById(R.id.courseTaskName);
            courseDueDateTextView = itemView.findViewById(R.id.courseDueDate);
        }
    }

    private void checkIfUserHasTakenTask(String taskName, Context context) {
        String currentUserId = mAuth.getCurrentUser().getUid();
        DatabaseReference scoreRef = FirebaseDatabase.getInstance().getReference("Score");
        Query query = scoreRef.orderByChild("studentId").equalTo(currentUserId);

        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                int score = -1;
                boolean hasTakenTask = false;
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    String scoreTaskName = snapshot.child("taskName").getValue(String.class);
                    if (scoreTaskName != null && scoreTaskName.equals(taskName)) {
                        score = snapshot.child("score").getValue(Integer.class);
                        hasTakenTask = true;
                        break;
                    }
                }

                if (hasTakenTask) {
                    Log.d(TAG, "User has already taken the task");
                    Toast.makeText(context, "Already taken test, Score:" + score,Toast.LENGTH_SHORT).show();

                } else {
                    Log.d(TAG, "User has not taken the task");
                    // Proceed to the QuizActivity
                    Intent intent = new Intent(context, QuizActivity.class);
                    intent.putExtra("taskName", taskName);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e(TAG, "Error checking if user has taken the task", databaseError.toException());
            }
        });
    }
}

