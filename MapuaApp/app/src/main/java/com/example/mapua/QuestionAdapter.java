package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;
import java.util.Map;

public class QuestionAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int VIEW_TYPE_MULTIPLE_CHOICE = 1;
    private static final int VIEW_TYPE_IDENTIFICATION = 2;

    private List<ActivitiesReviewerListItem> questions;

    public QuestionAdapter(List<ActivitiesReviewerListItem> questions) {
        this.questions = questions;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        View view;
        switch (viewType) {
            case VIEW_TYPE_MULTIPLE_CHOICE:
                view = inflater.inflate(R.layout.item_multiple_choice, parent, false);
                return new MultipleChoiceViewHolder(view);
            case VIEW_TYPE_IDENTIFICATION:
                view = inflater.inflate(R.layout.item_identification, parent, false);
                return new IdentificationViewHolder(view);
            default:
                throw new IllegalArgumentException("Invalid view type");
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        ActivitiesReviewerListItem question = questions.get(position);
        switch (holder.getItemViewType()) {
            case VIEW_TYPE_MULTIPLE_CHOICE:
                MultipleChoiceViewHolder mcHolder = (MultipleChoiceViewHolder) holder;
                // Bind data for multiple-choice question
                mcHolder.questionTextView.setText(question.getQuestion());
                // Set up radio buttons for choices
                mcHolder.optionsRadioGroup.removeAllViews();
                for (Map.Entry<String, String> entry : question.getChoices().entrySet()) {
                    RadioButton radioButton = new RadioButton(mcHolder.itemView.getContext());
                    radioButton.setText(entry.getValue());
                    mcHolder.optionsRadioGroup.addView(radioButton);
                }
                break;
            case VIEW_TYPE_IDENTIFICATION:
                IdentificationViewHolder idHolder = (IdentificationViewHolder) holder;
                // Bind data for identification question
                idHolder.questionTextView.setText(question.getQuestion());
                idHolder.answerEditText.setText(""); // Clear any previous answer
                break;
        }
    }

    @Override
    public int getItemCount() {
        return questions.size();
    }

    @Override
    public int getItemViewType(int position) {
        String questionType = questions.get(position).getQuestionType();
        if ("MultipleChoice".equals(questionType)) {
            return VIEW_TYPE_MULTIPLE_CHOICE;
        } else if ("Identification".equals(questionType)) {
            return VIEW_TYPE_IDENTIFICATION;
        }
        throw new IllegalArgumentException("Unknown question type: " + questionType);
    }

    static class MultipleChoiceViewHolder extends RecyclerView.ViewHolder {
        TextView questionTextView;
        RadioGroup optionsRadioGroup;

        public MultipleChoiceViewHolder(@NonNull View itemView) {
            super(itemView);
            questionTextView = itemView.findViewById(R.id.questionTextView);
            optionsRadioGroup = itemView.findViewById(R.id.optionsRadioGroupMultipleChoice);
        }
    }

    static class IdentificationViewHolder extends RecyclerView.ViewHolder {
        TextView questionTextView;
        EditText answerEditText;

        public IdentificationViewHolder(@NonNull View itemView) {
            super(itemView);
            questionTextView = itemView.findViewById(R.id.questionTextView);
            answerEditText = itemView.findViewById(R.id.answerEditText);
        }
    }
}