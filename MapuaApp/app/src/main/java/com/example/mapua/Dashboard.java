package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

public class Dashboard extends AppCompatActivity {

    TextView username, usertype;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        username = findViewById(R.id.userNameField);
        usertype = findViewById(R.id.userTypeField);

        String receivedUsername = getIntent().getStringExtra("username");
        String receivedUserType = getIntent().getStringExtra("user_type");

        // Display username and user type in TextViews
        username.setText("Username: " + receivedUsername);
        usertype.setText("User Type: " + receivedUserType);

    }
}