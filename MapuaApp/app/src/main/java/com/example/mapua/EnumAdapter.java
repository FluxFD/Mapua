package com.example.mapua;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class EnumAdapter extends RecyclerView.Adapter<EnumAdapter.ViewHolder> {

    private List<EnumActivity> enumActivityList;
    private HashMap<Integer,List<String>> enumAnswerMap; // storing of correct answer

    private HashMap<Integer,List<String>> enumInputAnswerMap; // storing of user answer
    private HashMap<Integer, List<EditText>> editFieldsList;

    public EnumAdapter(List<EnumActivity> enumActivityList, HashMap<Integer,List<String>> enumAnswerMap, HashMap<Integer,List<String>> enumInputAnswerMap) {
        this.enumActivityList = enumActivityList;
        this.enumAnswerMap = enumAnswerMap;
        this.enumInputAnswerMap = enumInputAnswerMap;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_enumeration, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        EnumActivity enumActivity = enumActivityList.get(position);
        holder.enumQuestion.setText(enumActivity.getQuestion());

        // Clear the container before adding new EditText views
        holder.enumAnswersContainer.removeAllViews();

        // Add EditText views for each answer
        for (String answer : enumActivity.getAnswer()) {
            EditText answerEditText = new EditText(holder.itemView.getContext());

            List<String> temp1 = new ArrayList<>();
            if (enumAnswerMap.containsKey(position)) {
                temp1.addAll(enumAnswerMap.get(position));
            }
            temp1.add(answer);
            enumAnswerMap.put(position, temp1);

            answerEditText.addTextChangedListener(new TextWatcher() {
                @Override
                public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                }

                @Override
                public void onTextChanged(CharSequence s, int start, int before, int count) {

                }

                @Override
                public void afterTextChanged(Editable s) {
                    int position = holder.getAdapterPosition();
                    List<String> temp = new ArrayList<>();
                    if (enumInputAnswerMap.containsKey(position)) {
                        temp.addAll(enumInputAnswerMap.get(position));
                    }
                    temp.add(s.toString());
                    enumInputAnswerMap.put(position, temp);
                }
            });

            holder.enumAnswersContainer.addView(answerEditText);
        }
    }

    @Override
    public int getItemCount() {
        int count = enumActivityList.size();
        Log.d("EnumAdapter", "getItemCount: " + count);
        return count;
    }


    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView enumQuestion;
        LinearLayout enumAnswersContainer;

        public ViewHolder(View itemView) {
            super(itemView);
            enumQuestion = itemView.findViewById(R.id.enumQuestion);
            enumAnswersContainer = itemView.findViewById(R.id.enumAnswersContainer);
        }
    }

}
