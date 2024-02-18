package com.example.mapua;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.List;

// QuizQuestionAdapter.java
public class QuizQuestionAdapter extends RecyclerView.Adapter<QuizQuestionAdapter.QuizViewHolder> {

    private List<Quiz> quizList;

    public QuizQuestionAdapter(List<Quiz> quizList) {
        this.quizList = quizList;
    }

    @NonNull
    @Override
    public QuizViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_quiz_question, parent, false);
        return new QuizViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull QuizViewHolder holder, int position) {
        Quiz quiz = quizList.get(position);
        holder.questionTextView.setText(quiz.getQuestion());

        // Set choices
        holder.optionARadioButton.setText(quiz.getChoices().get("A"));
        holder.optionBRadioButton.setText(quiz.getChoices().get("B"));
        holder.optionCRadioButton.setText(quiz.getChoices().get("C"));
        holder.optionDRadioButton.setText(quiz.getChoices().get("D"));

        // Set click listener for radio buttons
        holder.optionARadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                quiz.setSelectedAnswer("A");
            }
        });
        holder.optionBRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                quiz.setSelectedAnswer("B");
            }
        });
        holder.optionCRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                quiz.setSelectedAnswer("C");
            }
        });
        holder.optionDRadioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                quiz.setSelectedAnswer("D");
            }
        });
    }

    @Override
    public int getItemCount() {
        return quizList.size();
    }

    public static class QuizViewHolder extends RecyclerView.ViewHolder {
        TextView questionTextView;
        RadioButton optionARadioButton, optionBRadioButton, optionCRadioButton, optionDRadioButton;

        public QuizViewHolder(@NonNull View itemView) {
            super(itemView);
            questionTextView = itemView.findViewById(R.id.questionTextView);
            optionARadioButton = itemView.findViewById(R.id.optionARadioButton);
            optionBRadioButton = itemView.findViewById(R.id.optionBRadioButton);
            optionCRadioButton = itemView.findViewById(R.id.optionCRadioButton);
            optionDRadioButton = itemView.findViewById(R.id.optionDRadioButton);
        }
    }
}

