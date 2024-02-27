package com.example.mapua;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.google.firebase.database.annotations.Nullable;

import org.checkerframework.checker.nullness.qual.NonNull;

public class PagerAdapter extends FragmentPagerAdapter {

    private final String[] tabTitles = new String[]{"Tab 1", "Tab 2"};

    public PagerAdapter(FragmentManager fm) {
        super(fm, BEHAVIOR_RESUME_ONLY_CURRENT_FRAGMENT);
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                return new AnnouncementFragment();
            case 1:
                return new ContentFragment();
            default:
                throw new IllegalArgumentException("Invalid position: " + position);
        }
    }

    @Override
    public int getCount() {
        return tabTitles.length;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return tabTitles[position];
    }
}

class CustomPagerAdapter extends FragmentPagerAdapter {
    private String courseId;

    public CustomPagerAdapter(FragmentManager fm, String courseId) {
        super(fm);
        this.courseId = courseId;
    }

    @Override
    public Fragment getItem(int position) {
        switch (position) {
            case 0:
                ContentFragment contentFragment = ContentFragment.newInstance(courseId);
                return contentFragment;
            case 1:
                AnnouncementFragment announcementFragment = AnnouncementFragment.newInstance(courseId);
                return announcementFragment;
            case 2:
                CourseCalendarFragment calendarFragment = CourseCalendarFragment.newInstance(courseId);
                return calendarFragment;
            default:
                throw new IllegalArgumentException("Invalid position: " + position);
        }
    }

    @Override
    public int getCount() {
        return 3; // Update the count to include the new fragment
    }

    @Override
    public CharSequence getPageTitle(int position) {
        switch (position) {
            case 0:
                return "Content";
            case 1:
                return "Announcement";
            case 2:
                return "Calendar"; // Title for the new fragment
            default:
                throw new IllegalArgumentException("Invalid position: " + position);
        }
    }
}





