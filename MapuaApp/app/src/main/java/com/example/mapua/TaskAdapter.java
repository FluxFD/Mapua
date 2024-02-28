package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.List;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.TaskViewHolder> {

    private List<TaskHelpers> taskList;

    public TaskAdapter(List<TaskHelpers> taskList) {
        this.taskList = taskList;
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course_content, parent, false);
        return new TaskViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, int position) {
        TaskHelpers task = taskList.get(position);
        holder.bind(task);
    }

    @Override
    public int getItemCount() {
        return taskList.size();
    }

    public static class TaskViewHolder extends RecyclerView.ViewHolder {

        private TextView courseTextView;
        private TextView dueDateTextView;
        private TextView taskNameTextView;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            courseTextView = itemView.findViewById(R.id.courseTitleTextView);
            dueDateTextView = itemView.findViewById(R.id.courseDueDate);
            taskNameTextView = itemView.findViewById(R.id.courseTaskName);
        }

        public void bind(TaskHelpers task) {
            courseTextView.setText(task.getCourse());
            dueDateTextView.setText(task.getDueDate());
            taskNameTextView.setText(task.getTaskName());
        }
    }
}

