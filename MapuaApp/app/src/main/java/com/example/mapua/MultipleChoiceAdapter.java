package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

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

        holder.choicesRadioGroup.setOnCheckedChangeListener(null); // Clear previous listeners

        // Add radio buttons for choices
        for (String key : item.getChoices().keySet()) {
            RadioButton radioButton = new RadioButton(holder.itemView.getContext());
            radioButton.setText("Choice " + key + ": " + item.getChoices().get(key));
            radioButton.setTag(item.getChoices().get(key));
            holder.choicesRadioGroup.addView(radioButton);
        }

        holder.choicesRadioGroup.setOnCheckedChangeListener((group, checkedId) -> {
            RadioButton selectedRadioButton = group.findViewById(checkedId);
            if (selectedRadioButton != null) {
                item.setUserAnswer((String) selectedRadioButton.getTag());
            }
        });
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
            choicesRadioGroup = itemView.findViewById(R.id.optionsRadioGroupMultipleChoice);
        }
    }
}
