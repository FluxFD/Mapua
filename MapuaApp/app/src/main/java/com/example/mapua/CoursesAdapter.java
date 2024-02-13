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
    private OnCourseClickListener listener;
    public CoursesAdapter(List<String> courseIds, OnCourseClickListener listener) {
        this.courseIds = courseIds;
        this.listener = listener;
    }
    public interface OnCourseClickListener {
        void onCourseClick(String courseId);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course, parent, false);
        return new ViewHolder(view, listener);
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

    public static class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {
        TextView courseTextView;
        OnCourseClickListener listener;
        String courseId;

        public ViewHolder(@NonNull View itemView, OnCourseClickListener listener) {
            super(itemView);
            courseTextView = itemView.findViewById(R.id.titleCourse);
            this.listener = listener;
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            listener.onCourseClick(courseId);
        }

        public void bind(String courseId) {
            this.courseId = courseId;
            courseTextView.setText(courseId);
        }
    }
}
