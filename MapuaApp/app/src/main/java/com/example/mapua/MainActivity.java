package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;

public class MainActivity extends AppCompatActivity {


    private TextInputEditText userNameField, passWordField;
    private Button loginButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        userNameField = findViewById(R.id.usernameInput);
        passWordField = findViewById(R.id.passwordInput);
        loginButton = findViewById(R.id.loginBtn);

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // Get the username and password entered by the user
                String username = userNameField.getText().toString().trim();
                String password = passWordField.getText().toString().trim();

                // You should perform input validation here if needed

                // Execute AsyncTask to perform login
                new LoginTask().execute(username, password);
            }
        });

    }

    public class LoginTask extends AsyncTask<String, Void, String[]> {

        @Override
        protected String[] doInBackground(String... params) {
            String username = params[0];
            String password = params[1];

            // Your server URL for login (use HTTPS for security)
            String loginUrl = "http://10.0.2.2/mapua/login_auth.php";

            try {
                URL url = new URL(loginUrl);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();

                // Use POST method for sending sensitive data
                urlConnection.setRequestMethod("POST");
                urlConnection.setDoOutput(true);

                // Construct the request body with username and password
                String requestBody = "username=" + username + "&password=" + password;

                // Send the request body to the server
                urlConnection.getOutputStream().write(requestBody.getBytes());

                // Read the server response
                BufferedReader reader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                StringBuilder sb = new StringBuilder();
                String line;

                while ((line = reader.readLine()) != null) {
                    sb.append(line).append("\n");
                }

                reader.close();
                return new String[]{sb.toString().trim(), username}; // Return an array with server response and username
            } catch (Exception e) {
                Log.e("LoginTask", "Error: " + e.getMessage());
                return null;
            }
        }

        @Override
        protected void onPostExecute(String[] result) {
            // Handle the result after the AsyncTask is done

            if (result != null) {
                String serverResponse = result[0];
                String username = result[1];

                Log.d("LoginTask", "Server Response: " + serverResponse);

                try {
                    JSONObject responseJson = new JSONObject(serverResponse);
                    int status = responseJson.getInt("status");

                    if (status == 1) {
                        // Login successful
                        String userType = responseJson.getString("user_type");

                        Toast.makeText(MainActivity.this, "Login Successful", Toast.LENGTH_SHORT).show();

                        Intent intent = new Intent(MainActivity.this, Dashboard.class);
                        intent.putExtra("username", username);
                        intent.putExtra("user_type", userType);
                        startActivity(intent);
                        finish();

                    } else {
                        // Login failed
                        Toast.makeText(MainActivity.this, "Login Failed", Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(MainActivity.this, "Error parsing server response", Toast.LENGTH_SHORT).show();
                }
            } else {
                // Handle the case where there was an error during the login
                Toast.makeText(MainActivity.this, "Error during login", Toast.LENGTH_SHORT).show();
            }
        }
    }
}