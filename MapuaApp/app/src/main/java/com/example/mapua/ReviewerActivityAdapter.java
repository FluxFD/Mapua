package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ReviewerActivityAdapter extends RecyclerView.Adapter<ReviewerActivityAdapter.ViewHolder> {

    private List<ReviewerActivityHelpers.Reviewer> reviewers;

    public ReviewerActivityAdapter(List<ReviewerActivityHelpers.Reviewer> reviewers) {
        this.reviewers = reviewers;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_reviewer_activites, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ReviewerActivityHelpers.Reviewer reviewer = reviewers.get(position);
        holder.courseTextView.setText(reviewer.getCourse());
        holder.dateTextView.setText(reviewer.getDate());
        holder.titleTextView.setText(reviewer.getTitle());

        List<ReviewerActivityHelpers.Activities> activities = reviewer.getActivities();
        StringBuilder activitiesText = new StringBuilder();
        for (ReviewerActivityHelpers.Activities activity : activities) {
            activitiesText.append("Activity ID: ").append(activity.getActivityId()).append("\n");
            activitiesText.append("Question: ").append(activity.getQuestion()).append("\n");
            activitiesText.append("Answer: ").append(activity.getAnswer()).append("\n\n");
        }
        holder.activitiesTextView.setText(activitiesText.toString());
    }

    @Override
    public int getItemCount() {
        return reviewers.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView courseTextView;
        public TextView dateTextView;
        public TextView titleTextView;
        public TextView activitiesTextView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            courseTextView = itemView.findViewById(R.id.textViewCourseActivities);
            dateTextView = itemView.findViewById(R.id.textViewDateActivities);
            titleTextView = itemView.findViewById(R.id.textViewTitleActivities);
            activitiesTextView = itemView.findViewById(R.id.textViewActivitiesList);
        }
    }
}
