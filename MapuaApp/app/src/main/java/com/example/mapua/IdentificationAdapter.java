package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class IdentificationAdapter extends RecyclerView.Adapter<IdentificationAdapter.ViewHolder> {
    private List<ActivitiesReviewerListItem> activities;

    public IdentificationAdapter(List<ActivitiesReviewerListItem> activities) {
        this.activities = activities;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_identification, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ActivitiesReviewerListItem activity = activities.get(position);
        holder.questionTextView.setText(activity.getQuestion());
        // Set a tag to identify the position of the EditText when retrieving answers
        holder.answerEditText.setTag(position);
    }

    @Override
    public int getItemCount() {
        return activities.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView questionTextView;
        EditText answerEditText;

        public ViewHolder(View itemView) {
            super(itemView);
            questionTextView = itemView.findViewById(R.id.questionTextView);
            answerEditText = itemView.findViewById(R.id.answerEditText);
        }
    }
}
