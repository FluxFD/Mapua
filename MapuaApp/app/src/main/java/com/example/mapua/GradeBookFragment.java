package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


public class GradeBookFragment extends Fragment {

    private String courseId;

    public GradeBookFragment() {
        // Required empty public constructor
    }


    public static GradeBookFragment newInstance(String courseId) {
        GradeBookFragment fragment = new GradeBookFragment();
        Bundle args = new Bundle();
        args.putString("courseId", courseId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            courseId = getArguments().getString("courseId");
            Log.d("GradeBookFragment", "Fetched courseId: " + courseId);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_grade_book, container, false);
    }
}