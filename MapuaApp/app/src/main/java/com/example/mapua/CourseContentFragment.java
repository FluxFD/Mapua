package com.example.mapua;


import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.viewpager.widget.PagerAdapter;
import androidx.viewpager.widget.ViewPager;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


import com.google.android.material.tabs.TabLayout;
import com.google.firebase.database.annotations.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;


/**
 * A simple {@link Fragment} subclass.
 * Use the {@link CourseContentFragment#newInstance} factory method to
 * create an instance of this fragment.
 *
 */
public class CourseContentFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @return A new instance of fragment CourseContentFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static CourseContentFragment newInstance(String courseId, String taskId) {
        CourseContentFragment fragment = new CourseContentFragment();
        Bundle args = new Bundle();
        args.putString("courseId", courseId);
        args.putString("taskId", taskId);
        fragment.setArguments(args);
        return fragment;
    }
    public CourseContentFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_course_content, container, false);
    }


    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        TabLayout tabLayout = view.findViewById(R.id.tabLayout);
        ViewPager viewPager = view.findViewById(R.id.viewPager);
        String courseId = requireArguments().getString("courseId");
        // Create an instance of PagerAdapter
        PagerAdapter pagerAdapter = new CustomPagerAdapter(getChildFragmentManager(), courseId);

        // Set the PagerAdapter to the ViewPager
        viewPager.setAdapter(pagerAdapter);

        // Connect the TabLayout with the ViewPager
        tabLayout.setupWithViewPager(viewPager);

    }

}


