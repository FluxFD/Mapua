package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class ChatActivity extends AppCompatActivity {

    private MessageAdapter messageAdapter;
    private List<MessageModel> messages;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        String courseId = getIntent().getStringExtra("courseId");

        // Get the intent
        Intent intent = getIntent();
        if (intent != null) {
            // Get the extras
            String username = intent.getStringExtra("username");
            String usernum = intent.getStringExtra("usernum");

            // Log the extras
            Log.d("ChatActivity", "CourseId: " + courseId);
            Log.d("ChatActivity", "Username: " + username);
            Log.d("ChatActivity", "Usernum: " + usernum);
        }

        RecyclerView recyclerViewMessages = findViewById(R.id.recyclerViewMessages);
        recyclerViewMessages.setLayoutManager(new LinearLayoutManager(this));
        messages = new ArrayList<>();
        messageAdapter = new MessageAdapter(messages);
        recyclerViewMessages.setAdapter(messageAdapter);

        fetchMessages(courseId);


    }

    private void fetchMessages(String courseId) {
        DatabaseReference messageRef = FirebaseDatabase.getInstance().getReference("Message");
        messageRef.orderByChild("Course").equalTo(courseId).addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                Log.d("ChatActivity", "Fetching messages for courseId: " + courseId);
                messages.clear(); // Clear the list before adding new messages
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    MessageModel message = snapshot.getValue(MessageModel.class);
                    if (message != null) {
                        messages.add(message);
                        Log.d("ChatActivity", "Adding message to list - courseId: " + message.getCourse() +
                                ", Message: " + message.getMessage() +
                                ", Name: " + message.getName() +
                                ", Date: " + message.getDate());
                    }
                }
                messageAdapter.notifyDataSetChanged();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors
                Log.e("ChatActivity", "Failed to read value.", databaseError.toException());
            }
        });
    }

}