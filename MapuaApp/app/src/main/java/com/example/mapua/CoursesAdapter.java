package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class CoursesAdapter extends RecyclerView.Adapter<CoursesAdapter.ViewHolder> {

    private List<String> courseIds;

    public CoursesAdapter(List<String> courseIds) {
        this.courseIds = courseIds;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        String courseId = courseIds.get(position);
        holder.bind(courseId);
    }

    @Override
    public int getItemCount() {
        return courseIds.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView courseTextView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            courseTextView = itemView.findViewById(R.id.titleCourse);
        }

        public void bind(String courseId) {
            courseTextView.setText(courseId);
        }
    }
}
