package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.PropertyName;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link AnnouncementFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class AnnouncementFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private RecyclerView recyclerView;
    private AnnouncementAdapter adapter;
    private List<Announcement> announcements;
    private String currentUid;


    public AnnouncementFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment AnnouncementFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static AnnouncementFragment newInstance(String courseId) {
        AnnouncementFragment fragment = new AnnouncementFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, courseId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            Log.d("AnnouncementFragment", "Course ID: " + mParam1);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_announcement, container, false);

        recyclerView = view.findViewById(R.id.announcementRecyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        announcements = new ArrayList<>();
        adapter = new AnnouncementAdapter(announcements);
        recyclerView.setAdapter(adapter);

        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
        if (currentUser != null) {
            currentUid = currentUser.getUid();
            Log.d("AnnouncementFragment", "Current user UID: " + currentUid);
            fetchAnnouncements(mParam1);
        }

        return view;
    }
    private void fetchAnnouncements(String courseId) {
        if (courseId == null) {
            Log.e("AnnouncementFragment", "Course ID is null");
            return;
        }

        Log.d("AnnouncementFragment", "Fetching announcements for course ID: " + courseId);

        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference("Announcement");

        databaseReference.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                announcements.clear();
                for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                    Announcement announcement = snapshot.getValue(Announcement.class);
                    if (announcement != null && courseId.equals(announcement.getCourse())) {
                        announcements.add(announcement);
                    }
                }
                adapter.notifyDataSetChanged();
                Log.d("AnnouncementFragment", "Announcements fetched successfully. Count: " + announcements.size());
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                Log.e("AnnouncementFragment", "Failed to fetch announcements: " + databaseError.getMessage());
            }
        });
    }



}

class Announcement {
    @PropertyName("Course")
    private String course;
    private String date;
    private String title;
    private String uid;

    public Announcement() {
        // Default constructor required for Firebase
    }

    public Announcement(String course, String date, String title, String uid) {
        this.course = course;
        this.date = date;
        this.title = title;
        this.uid = uid;
    }

    // Constructor that takes a DataSnapshot parameter
    public Announcement(DataSnapshot snapshot) {
        this.course = snapshot.child("Course").getValue(String.class);
        this.date = snapshot.child("date").getValue(String.class);
        this.title = snapshot.child("title").getValue(String.class);
        this.uid = snapshot.child("uid").getValue(String.class);
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}

