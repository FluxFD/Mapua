package com.example.mapua;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputEditText;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.concurrent.Executor;


public class MainActivity extends AppCompatActivity {


    private TextInputEditText userNameField, passWordField;
    private FirebaseAuth mAuth;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        userNameField = findViewById(R.id.usernameInput);
        passWordField = findViewById(R.id.passwordInput);
        Button loginButton = findViewById(R.id.loginBtn);
        mAuth = FirebaseAuth.getInstance();

        Button bioButton = findViewById(R.id.bioBtn);

        bioButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle("Please Verify")
                        .setDescription("User Auth is required to proceed")
                        .setNegativeButtonText("Cancel")
                        .build();
                getPrompt().authenticate(promptInfo);
            }
        });

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = userNameField.getText().toString().trim();
                String password = passWordField.getText().toString().trim();

                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(MainActivity.this, "Please enter email and password", Toast.LENGTH_SHORT).show();
                    return;
                }

                loginUser(email, password);
            }
        });


        Button biometricsButton = findViewById(R.id.loginWithBiometricsBtn);
        biometricsButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                authenticateWithBiometrics();
            }
        });



    }

    private void authenticateWithBiometrics() {
        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("Please Verify")
                .setDescription("User Auth is required to proceed")
                .setNegativeButtonText("Cancel")
                .build();
        getPrompt().authenticate(promptInfo);
    }

    private void proceedToNextActivity(String name, String studentNo) {
        Intent intent = new Intent(MainActivity.this, Dashboard.class);
        intent.putExtra("name", name);
        intent.putExtra("studentNo", studentNo);
        startActivity(intent);
        finish();
    }


    private void loginUser(String email, String password) {
        mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(TAG, "signInWithEmail:success");
                            FirebaseUser user = mAuth.getCurrentUser();
                            String uid = user.getUid();
                            checkStudentCollection(uid);
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(TAG, "signInWithEmail:failure", task.getException());
                            Toast.makeText(MainActivity.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    private void checkStudentCollection(String uid) {
        DatabaseReference studentsRef = FirebaseDatabase.getInstance().getReference("students").child(uid);
        studentsRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (snapshot.exists()) {
                    String email = snapshot.child("email").getValue(String.class);
                    String name = snapshot.child("name").getValue(String.class);
                    String role = snapshot.child("role").getValue(String.class);
                    String studentNo = snapshot.child("studentNo").getValue(String.class);

                    Log.d(TAG, "Email: " + email);
                    Log.d(TAG, "Name: " + name);
                    Log.d(TAG, "Role: " + role);
                    Log.d(TAG, "Student No: " + studentNo);

                    proceedToNextActivity(name, studentNo);

                    // You can perform further actions here, such as navigating to another activity
                } else {
                    Log.d(TAG, "User not found in student collection");
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                Log.e(TAG, "Error querying student collection: " + error.getMessage());
            }
        });
    }

    private BiometricPrompt getPrompt(){
        Executor executor = ContextCompat.getMainExecutor(this);
        BiometricPrompt.AuthenticationCallback callback = new BiometricPrompt.AuthenticationCallback() {
            @Override
            public void onAuthenticationError(int errorCode, CharSequence errString) {
                super.onAuthenticationError(errorCode, errString);
                notifyUser(errString.toString());
            }


            @Override
            public void onAuthenticationSucceeded(BiometricPrompt.AuthenticationResult result) {
                super.onAuthenticationSucceeded(result);
                notifyUser("Authentication Success");

            }

            @Override
            public void onAuthenticationFailed() {
                super.onAuthenticationFailed();
                notifyUser("Authentication Failed");
            }
        };
        BiometricPrompt biometricPrompt = new BiometricPrompt(this,executor,callback);
        return biometricPrompt;
    }

    private void notifyUser(String message){
        Toast.makeText(this,message,Toast.LENGTH_SHORT).show();
    }



}