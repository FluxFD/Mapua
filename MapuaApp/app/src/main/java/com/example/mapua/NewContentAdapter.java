package com.example.mapua;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class NewContentAdapter extends RecyclerView.Adapter<NewContentAdapter.ViewHolder> {

    List<BaseCourseContent> items;

    public NewContentAdapter(List<BaseCourseContent> items){
        this.items = items != null ? items : new ArrayList<>();
        Log.d("NewContentAdapter", "Initial items list size: " + this.items.size());
        for (BaseCourseContent item : this.items) {
            Log.d("NewContentAdapter", "Item: " + item.toString());
        }
    }

    @NonNull
    @Override
    public NewContentAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        if (viewType == 0){
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_course_content, parent, false);
            return new NewContentAdapter.ViewHolder(view);
        }else if (viewType == 1){
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_reviewer, parent, false);
            return new NewContentAdapter.ViewHolder(view);
        }
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_reviewer_activites, parent, false);
        return new NewContentAdapter.ViewHolder(view);

    }

    @Override
    public void onBindViewHolder(@NonNull NewContentAdapter.ViewHolder holder, int position) {
        if (items == null || position < 0 || position >= items.size()) {
            return; // Exit early if items list is null or position is out of bounds
        }

        BaseCourseContent content = items.get(position);
        int viewType = getItemViewType(position);

        switch (viewType) {
            case 0:
                if (content instanceof TaskHelpers) {
                    TaskHelpers taskHelpers = (TaskHelpers) content;
                    holder.courseTitleTextView.setText(taskHelpers.getCourse());
                    holder.courseTaskNameTextView.setText(taskHelpers.getTaskName());
                    holder.courseDueDateTextView.setText(taskHelpers.getDueDate());
                }
                break;
            case 1:
                if (content instanceof ReviewerHelpers) {
                    ReviewerHelpers reviewerHelpers = (ReviewerHelpers) content;
                    holder.reviewerTitleTextView.setText(reviewerHelpers.getTitle());
                    holder.reviewerCreatedByTextView.setText(reviewerHelpers.getCreatedBy());
                }
                break;
            case 2:
                if (content instanceof ReviewerActivities) {
                    ReviewerActivities reviewerActivities = (ReviewerActivities) content;
                    holder.reviewerActivitiesCourseTextView.setText(reviewerActivities.getCourse());
                    holder.reviewerActivitiesDateTextView.setText(reviewerActivities.getTitle());
                    StringBuilder output = new StringBuilder();
                    for (ActivitiesReviewerListItem activitiesReviewer : reviewerActivities.getActivities()) {
                        output.append(activitiesReviewer.getActivityId()).append("\n")
                                .append(activitiesReviewer.getQuestion()).append("\n")
                                .append(activitiesReviewer.getAnswer()).append("\n");
                    }
                    holder.reviewerActivitiesTitleTextView.setText(output.toString());
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid view type");
        }
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public int getItemViewType(int position) {
        BaseCourseContent content = items.get(position);
        if (content instanceof TaskHelpers) {
            return 0;
        } else if (content instanceof ReviewerHelpers) {
            return 1;
        } else if (content instanceof ReviewerActivities) {
            return 2;
        } else {
            throw new IllegalArgumentException("Invalid view type");
        }
    }

    //

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView courseTitleTextView;
        TextView courseTaskNameTextView;
        TextView courseDueDateTextView;
        //
        TextView reviewerTitleTextView;
        TextView reviewerCreatedByTextView;
        //
        TextView reviewerActivitiesCourseTextView;
        TextView reviewerActivitiesDateTextView;
        TextView reviewerActivitiesTitleTextView;
        TextView reviewerActivitiesListTextView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            courseTitleTextView = itemView.findViewById(R.id.courseTitleTextView);
            courseTaskNameTextView = itemView.findViewById(R.id.courseTaskName);
            courseDueDateTextView = itemView.findViewById(R.id.courseDueDate);
            reviewerTitleTextView = itemView.findViewById(R.id.titleTextView);
            reviewerCreatedByTextView = itemView.findViewById(R.id.createdByTextView);
            reviewerActivitiesCourseTextView = itemView.findViewById(R.id.textViewCourseActivities);
            reviewerActivitiesDateTextView = itemView.findViewById(R.id.textViewDateActivities);
            reviewerActivitiesTitleTextView = itemView.findViewById(R.id.textViewTitleActivities);
            reviewerActivitiesListTextView = itemView.findViewById(R.id.textViewActivitiesList);
        }
    }


}
