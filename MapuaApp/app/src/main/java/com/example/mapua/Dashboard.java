package com.example.mapua;

import static android.content.ContentValues.TAG;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import com.example.mapua.databinding.ActivityDashboardBinding;
import com.example.mapua.databinding.ActivityMainBinding;
import com.google.android.gms.tasks.Task;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import org.checkerframework.checker.nullness.qual.NonNull;

public class Dashboard extends AppCompatActivity {
    ActivityDashboardBinding binding;
    FirebaseAuth mAuth;
    private String name;
    private String studentNo;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        replaceFragment(new TimelineFragment());

        mAuth = FirebaseAuth.getInstance();

        binding.bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();

            if (itemId == R.id.timeline) {
                replaceFragment(new TimelineFragment());
            } else if (itemId == R.id.courses) {
                replaceFragment(new CoursesFragment());
            } else if (itemId == R.id.calendar) {
                replaceFragment(new CalendarFragment());
            } else {
                // Pass data to MoreFragment
                MoreFragment moreFragment = MoreFragment.newInstance(name, studentNo);
                replaceFragment(moreFragment);
            }

            return true;
        });

        // Retrieve data from Realtime Database
        DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReferenceFromUrl("https://mapua-f1526-default-rtdb.firebaseio.com/students");
        databaseReference.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                // Assuming there's only one student's data
                DataSnapshot studentSnapshot = dataSnapshot.getChildren().iterator().next();
                // Get field name and studentNo
                name = studentSnapshot.child("name").getValue(String.class);
                studentNo = studentSnapshot.child("studentNo").getValue(String.class);
                Log.d(TAG, "Student Name: " + name + ", Student No: " + studentNo);
                // You can use the retrieved data here as needed
            }

            @Override
            public void onCancelled(@NonNull DatabaseError databaseError) {
                // Handle potential errors here
                Log.w(TAG, "loadPost:onCancelled", databaseError.toException());
            }
        });
    }

    private void replaceFragment(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.cons_layout_dashboard, fragment);
        fragmentTransaction.commit();
    }
}

