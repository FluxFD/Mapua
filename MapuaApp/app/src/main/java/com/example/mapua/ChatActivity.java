package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

public class ChatActivity extends AppCompatActivity {

    private MessageAdapter messageAdapter;
    private List<MessageModel> messages;

    private EditText editTextMessage;
    private Button buttonSend;
    private RecyclerView recyclerViewMessages;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        String courseId = getIntent().getStringExtra("courseId");

        editTextMessage = findViewById(R.id.editTextMessage);
        buttonSend = findViewById(R.id.buttonSend);

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

        recyclerViewMessages = findViewById(R.id.recyclerViewMessages);
        recyclerViewMessages.setLayoutManager(new LinearLayoutManager(this));
        messages = new ArrayList<>();
        messageAdapter = new MessageAdapter(messages);
        recyclerViewMessages.setAdapter(messageAdapter);

        fetchMessages(courseId);

        String username = intent.getStringExtra("username");
        buttonSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                sendMessage(courseId, username);
            }
        });


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
                messageAdapter.notifyItemInserted(messages.size() -1);
                recyclerViewMessages.smoothScrollToPosition(messageAdapter.getItemCount()- 1);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors
                Log.e("ChatActivity", "Failed to read value.", databaseError.toException());
            }
        });
    }

    private void sendMessage(String courseId, String username) {
        String messageText = editTextMessage.getText().toString().trim();
        if (!messageText.isEmpty()) {
            FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
            if (currentUser != null) {
                String userId = currentUser.getUid();

                DatabaseReference messageRef = FirebaseDatabase.getInstance().getReference("Message").push();
                String messageId = messageRef.getKey();
                String date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());


                HashMap <String, String> messageMap = new HashMap<>();
                messageMap.put("Course",courseId);
                messageMap.put("date",date);
                messageMap.put("message",messageText);
                messageMap.put("name",username);
                messageMap.put("uid",userId);
                messageRef.setValue(messageMap)
                        .addOnSuccessListener(new OnSuccessListener<Void>() {
                            @Override
                            public void onSuccess(Void aVoid) {
                                Log.d("ChatActivity", "Message sent successfully");
                                editTextMessage.setText(""); // Clear the input field after sending
                            }
                        })
                        .addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Log.e("ChatActivity", "Failed to send message", e);
                            }
                        });
            } else {
                Log.e("ChatActivity", "User is not authenticated");
            }
        } else {
            Log.e("ChatActivity", "Message text is empty");
        }
    }


}