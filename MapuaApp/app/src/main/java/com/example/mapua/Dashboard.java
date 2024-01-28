package com.example.mapua;

import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.os.Bundle;
import android.widget.TextView;

import com.example.mapua.databinding.ActivityDashboardBinding;
import com.example.mapua.databinding.ActivityMainBinding;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class Dashboard extends AppCompatActivity {
    TextView username, usertype;
    ActivityDashboardBinding binding;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityDashboardBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        replaceFragment(new TimelineFragment());

        String receivedUsername = getIntent().getStringExtra("username");
        String receivedUserType = getIntent().getStringExtra("user_type");

        binding.bottomNavigationView.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();

            if (itemId == R.id.timeline){
                replaceFragment(new TimelineFragment());
            } else if (itemId == R.id.courses) {
                replaceFragment(new CoursesFragment());
            } else if (itemId == R.id.calendar) {
                replaceFragment(new CalendarFragment());
            }else {
                replaceFragment(MoreFragment.newInstance("", "", receivedUsername, receivedUserType));
            }

            return true;
        });

    }
    private void replaceFragment(Fragment fragment){
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.cons_layout_dashboard, fragment);
        fragmentTransaction.commit();
    }
}