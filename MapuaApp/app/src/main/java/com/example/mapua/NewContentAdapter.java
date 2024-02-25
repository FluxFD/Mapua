package com.example.mapua;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;

public class NewContentAdapter extends RecyclerView.Adapter<NewContentAdapter.ViewHolder> implements View.OnClickListener {

    List<BaseCourseContent> items;
    private FirebaseAuth mAuth;

    static String TAG = "NewContentAdapter";

    public NewContentAdapter(List<BaseCourseContent> items){
        this.items = items != null ? items : new ArrayList<>();
        Log.d("NewContentAdapter", "Initial items list size: " + this.items.size());
        for (BaseCourseContent item : this.items) {
            Log.d("NewContentAdapter", "Item: " + item.toString());
        }
        mAuth = FirebaseAuth.getInstance();
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

                    holder.taskCardView.setTag(position);
                    holder.taskCardView.setOnClickListener(this::onClick);

                }
                break;
            case 1:
                if (content instanceof ReviewerHelpers) {
                    ReviewerHelpers reviewerHelpers = (ReviewerHelpers) content;
                    holder.reviewerTitleTextView.setText(reviewerHelpers.getTitle());
                    holder.reviewerCreatedByTextView.setText(reviewerHelpers.getCreatedBy());

                    holder.reviewerCardView.setTag(position);
                    holder.reviewerCardView.setOnClickListener(this::onClick);
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

                    holder.reviewerActivityCardView.setTag(position);
                    holder.reviewerActivityCardView.setOnClickListener(this::onClick);
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

    @Override
    public void onClick(View v) {
        int position = (int) v.getTag();
        int type = getItemViewType(position);
        BaseCourseContent content = items.get(position);
        switch (type){
            case 0:
                if (content instanceof TaskHelpers){
                    TaskHelpers task = (TaskHelpers) content;
                    String taskName = task.getTaskName();
                    if (taskName != null && !taskName.isEmpty()) {
                        checkIfUserHasTakenTask(taskName, v.getContext());
                    } else {
                        Log.e("NewContentAdapter", "Invalid taskName: " + taskName);
                    }
                    Log.d("NewContentAdapter", "Task Clicked");
                }
                break;
            case 1:
                if (content instanceof ReviewerHelpers){
                    ReviewerHelpers reviewer = (ReviewerHelpers) content;
                    openFile(reviewer.getFile(), v.getContext());
                    Log.d("NewContentAdapter", "Reviewer Clicked");
                }
                break;
            case 2:
                if (content instanceof ReviewerActivities){
                    ReviewerActivities reviewerActivities = (ReviewerActivities) content;
                    Intent intent = new Intent(v.getContext(), CardReviewerActivity.class); // Replace YourActivity with the name of your activity
                    // Pass any data you need to the new activity
                    intent.putExtra("reviewerId", reviewerActivities.getReviewerId());
                    intent.putExtra("course", reviewerActivities.getCourse());
                    intent.putExtra("date", reviewerActivities.getDate());
                    intent.putExtra("title", reviewerActivities.getTitle());
                    // Start the new activity
                    v.getContext().startActivity(intent);

                    Log.d("NewContentAdapter", "Reviewer Activities Clicked");
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid view type");
        }
    }

    private void checkIfUserHasTakenTask(String taskName, Context context) {
        String currentUserId = mAuth.getCurrentUser().getUid();
        DatabaseReference scoreRef = FirebaseDatabase.getInstance().getReference("Score");
        Query query = scoreRef.orderByChild("studentId").equalTo(currentUserId);

        query.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                int score = -1;
                boolean hasTakenTask = false;
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    String scoreTaskName = snapshot.child("taskName").getValue(String.class);
                    if (scoreTaskName != null && scoreTaskName.equals(taskName)) {
                        score = snapshot.child("score").getValue(Integer.class);
                        hasTakenTask = true;
                        break;
                    }
                }

                if (hasTakenTask) {
                    Log.d(TAG, "User has already taken the task");
                    Toast.makeText(context, "Already taken test, Score:" + score,Toast.LENGTH_SHORT).show();

                } else {
                    Log.d(TAG, "User has not taken the task");
                    // Proceed to the QuizActivity
                    Intent intent = new Intent(context, QuizActivity.class);
                    intent.putExtra("taskName", taskName);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                Log.e(TAG, "Error checking if user has taken the task", databaseError.toException());
            }
        });
    }

    private void openFile(String fileUrl, Context context) {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse(fileUrl));
        context.startActivity(intent);
    }


    public static class ViewHolder extends RecyclerView.ViewHolder {

        CardView taskCardView;
        TextView courseTitleTextView;
        TextView courseTaskNameTextView;
        TextView courseDueDateTextView;
        //
        CardView reviewerCardView;
        TextView reviewerTitleTextView;
        TextView reviewerCreatedByTextView;
        //
        CardView reviewerActivityCardView;
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
            // reviewerActivitiesListTextView = itemView.findViewById(R.id.textViewActivitiesList);

            taskCardView = itemView.findViewById(R.id.taskCard);
            reviewerCardView = itemView.findViewById(R.id.reviewerCard);
            reviewerActivityCardView = itemView.findViewById(R.id.reviewerActivitiesCard);

        }
    }


}
