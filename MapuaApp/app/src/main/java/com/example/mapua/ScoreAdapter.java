package com.example.mapua;

import android.annotation.SuppressLint;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.List;

public class ScoreAdapter extends RecyclerView.Adapter<ScoreAdapter.ScoreViewHolder> {
    private List<Score> scores;

    public ScoreAdapter(List<Score> scores) {
        this.scores = scores;
    }

    @NonNull
    @Override
    public ScoreViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_scores, parent, false);
        return new ScoreViewHolder(view);
    }

    @SuppressLint("SetTextI18n")
    @Override
    public void onBindViewHolder(@NonNull ScoreViewHolder holder, int position) {
        Score score = scores.get(position);
        if (score != null) {
            Log.d("ScoreAdapter", "Score object is not null: " + score);
            holder.taskNameTextView.setText(score.getTaskName());
            holder.scoreTextView.setText("Score: " + score.getScore());
        } else {
            Log.e("ScoreAdapter", "Score object at position " + position + " is null.");
        }
    }

    @Override
    public int getItemCount() {
        Log.d("ScoreAdapter", "getItemCount: " + scores.size());
        return scores.size();
    }

    public static class ScoreViewHolder extends RecyclerView.ViewHolder {
        TextView taskNameTextView;
        TextView scoreTextView;

        public ScoreViewHolder(@NonNull View itemView) {
            super(itemView);
            taskNameTextView = itemView.findViewById(R.id.taskNameTextView);
            scoreTextView = itemView.findViewById(R.id.scoreTextView);
        }
    }
}
