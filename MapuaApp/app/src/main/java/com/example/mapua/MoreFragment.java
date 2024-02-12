package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link MoreFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class MoreFragment extends Fragment {

    private static final String ARG_USERNAME = "username";
    private static final String ARG_USERTYPE = "usertype";

    private String username;
    private String usertype;

    public MoreFragment() {
        // Required empty public constructor
    }

    public static MoreFragment newInstance(String username, String usertype) {
        MoreFragment fragment = new MoreFragment();
        Bundle args = new Bundle();
        args.putString(ARG_USERNAME, username);
        args.putString(ARG_USERTYPE, usertype);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            username = getArguments().getString(ARG_USERNAME);
            usertype = getArguments().getString(ARG_USERTYPE);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_more, container, false);

        // Access TextViews in the layout
        TextView studentNameTextView = view.findViewById(R.id.studentName);
        TextView studentNumberTextView = view.findViewById(R.id.studentNumber);

        // Set text values with username and usertype
        studentNameTextView.setText(username);
        studentNumberTextView.setText(usertype);

        return view;
    }
}