package com.example.mapua;

import android.content.Intent;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;


public class MoreFragment extends Fragment {

    private static final String ARG_USERNAME = "username";
    private static final String ARG_USERTYPE = "usertype";

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

        // Set text values with username and usertype
        studentNameTextView.setText(username);
        studentNumberTextView.setText(usernum);


        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Handle logout here
                logout();
            }
        });


        return view;
    }

    private void logout() {
        // Add logout logic here, for example, sign out from Firebase Authentication
        FirebaseAuth.getInstance().signOut();

        // Redirect to login activity or any other appropriate action
        Intent intent = new Intent(getActivity(), MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK); // Clear back stack
        startActivity(intent);
        getActivity().finish();
    }
}