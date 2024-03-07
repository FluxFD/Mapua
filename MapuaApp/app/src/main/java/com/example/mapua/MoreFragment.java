package com.example.mapua;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.ToggleButton;

import com.google.firebase.auth.FirebaseAuth;

import org.checkerframework.checker.nullness.qual.NonNull;

import java.util.Objects;


public class MoreFragment extends Fragment {

    private static final String ARG_USERNAME = "username";
    private static final String ARG_USERTYPE = "usertype";
    private static final String PREF_BIOMETRICS = "Biometrics";
    private static final String PREF_USERNAME = "username";
    private static final String PREF_USERNUM = "usernum";

    private String username;
    private String usernum;

    public MoreFragment() {
        // Required empty public constructor
    }

    public static MoreFragment newInstance(String name, String studentNo) {
        MoreFragment fragment = new MoreFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USERNAME, name);
        args.putString(ARG_USERTYPE, studentNo);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            username = getArguments().getString(ARG_USERNAME);
            usernum = getArguments().getString(ARG_USERTYPE);
            Log.d("MoreFragment", "Username: " + username + ", UserNumber: " + usernum);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_more, container, false);

        // Access TextViews in the layout
        TextView studentNameTextView = view.findViewById(R.id.studentName);
        TextView studentNumberTextView = view.findViewById(R.id.studentNumber);
        Button logoutButton = view.findViewById(R.id.logoutBtn);
        Button messageButton = view.findViewById(R.id.messageBtn);
        Button gradeButton = view.findViewById(R.id.gradeBtn);

        ToggleButton bioBtn = view.findViewById(R.id.toggleBio);

        // Set text values with username and usertype
        studentNameTextView.setText(username);
        studentNumberTextView.setText(usernum);


        BiometricManager biometricManager = BiometricManager.from(requireContext());
        int canAuth = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK);
        switch (canAuth) {
            case BiometricManager.BIOMETRIC_SUCCESS:
                // Biometric authentication can be used
                bioBtn.setEnabled(true);
                break;
            case BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE:
            case BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE:
            case BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED:
            case BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED:
            case BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED:
            case BiometricManager.BIOMETRIC_STATUS_UNKNOWN:
                bioBtn.setEnabled(false);
                break;


        }

        logoutButton.setOnClickListener(v -> {
            // Handle logout here
            logout();
        });

        messageButton.setOnClickListener(v -> {
            Intent intent = new Intent(getContext(), MessageActivity.class);
            intent.putExtra("username", username);
            intent.putExtra("usernum", usernum);
            startActivity(intent);
        });

        gradeButton.setOnClickListener(v->{
            Intent intent = new Intent(getContext(), AllGradeBookActivity.class);
            intent.putExtra("username", username);
            intent.putExtra("usernum", usernum);
            startActivity(intent);
        });

        final String finalUserNum = usernum;

        bioBtn.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if (isChecked) {
                    // Enable biometrics
                    enableBiometrics();
                } else {
                    // Disable biometrics
                    disableBiometrics();
                }
            }
        });


        return view;
    }

    private void logout() {
        // Add logout logic here, for example, sign out from Firebase Authentication
//        FirebaseAuth.getInstance().signOut();

        // Redirect to login activity or any other appropriate action
        Intent intent = new Intent(getActivity(), MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK); // Clear back stack
        startActivity(intent);
        getActivity().finish();
    }

    private static final String PREF_BIOMETRICS_ENABLED = "biometrics_enabled";

    private void enableBiometrics() {
        SharedPreferences sharedPref = requireActivity().getSharedPreferences(PREF_BIOMETRICS, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean(PREF_BIOMETRICS_ENABLED, true);
        editor.apply();
    }

    private void disableBiometrics() {
        SharedPreferences sharedPref = requireActivity().getSharedPreferences(PREF_BIOMETRICS, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.putBoolean(PREF_BIOMETRICS_ENABLED, false);
        editor.apply();
    }


}
