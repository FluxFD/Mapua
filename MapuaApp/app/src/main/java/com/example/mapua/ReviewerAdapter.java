package com.example.mapua;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class ReviewerAdapter extends RecyclerView.Adapter<ReviewerAdapter.ReviewerViewHolder> {
    private List<Reviewer> reviewersList;
    private Context context;

    public ReviewerAdapter(Context context, List<Reviewer> reviewersList) {
        this.context = context;
        this.reviewersList = reviewersList;
    }

    @NonNull
    @Override
    public ReviewerViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_reviewer, parent, false);
        return new ReviewerViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ReviewerViewHolder holder, int position) {
        Reviewer reviewer = reviewersList.get(position);
        if (reviewer != null) {
            holder.titleTextView.setText(reviewer.getTitle());
            holder.createdByTextView.setText(reviewer.getCreatedBy());
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    openFile(reviewer.getFile());
                }
            });

            // You can add more views here to display other reviewer information
            Log.d("ReviewerAdapter", "Reviewer at position " + position + ": " + reviewer.toString());
        }
    }

    private void openFile(String fileUrl) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(fileUrl));
        context.startActivity(intent);
    }

    @Override
    public int getItemCount() {
        return reviewersList.size();
    }

    public static class ReviewerViewHolder extends RecyclerView.ViewHolder {
        TextView titleTextView;
        TextView createdByTextView;

        public ReviewerViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.titleTextView);
            createdByTextView = itemView.findViewById(R.id.createdByTextView);
        }
    }
}
