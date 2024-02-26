package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.List;
import java.util.Map;

public class MultipleChoiceAdapter extends RecyclerView.Adapter<MultipleChoiceAdapter.ViewHolder> {

    private List<ActivitiesReviewerListItem> mItems;

    public MultipleChoiceAdapter(List<ActivitiesReviewerListItem> items) {
        mItems = items;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_multiple_choice, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ActivitiesReviewerListItem item = mItems.get(position);
        holder.questionTextView.setText(item.getQuestion());

        // Clear existing radio buttons
        holder.choicesRadioGroup.removeAllViews();

        // Add radio buttons for choices
        for (Map.Entry<String, String> entry : item.getChoices().entrySet()) {
            RadioButton radioButton = new RadioButton(holder.itemView.getContext());
            radioButton.setText(entry.getValue());
            radioButton.setTag(entry.getKey());
            holder.choicesRadioGroup.addView(radioButton);
        }
    }

    @Override
    public int getItemCount() {
        return mItems.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView questionTextView;
        RadioGroup choicesRadioGroup;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            questionTextView = itemView.findViewById(R.id.questionTextView);
            choicesRadioGroup = itemView.findViewById(R.id.choicesRadioGroup);
        }
    }
}