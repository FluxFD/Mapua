package com.example.mapua;

import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import android.content.Context;
import java.util.List;

public class CourseContentAdapter extends RecyclerView.Adapter<CourseContentAdapter.CourseViewHolder> {
    private List<String> courseContent;
    private Context context;

    public CourseContentAdapter(Context context, List<String> courseContent) {
        this.context = context;
        this.courseContent = courseContent;
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
                        // Start the next activity here
                        Intent intent = new Intent(context, QuizActivity.class);
                        // Pass the task name to the QuizActivity
                        intent.putExtra("taskName", parts[1]);
                        context.startActivity(intent);
                    }
                });
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
}

