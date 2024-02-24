// Generated by view binder compiler. Do not edit!
package com.example.mapua.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.Guideline;
import androidx.viewbinding.ViewBinding;
import androidx.viewbinding.ViewBindings;
import com.example.mapua.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class ActivityDashboardBinding implements ViewBinding {
  @NonNull
  private final ConstraintLayout rootView;

  @NonNull
  public final BottomNavigationView bottomNavigationView;

  @NonNull
  public final ConstraintLayout consLayoutDashboard;

  @NonNull
  public final Guideline guideline;

  @NonNull
  public final Guideline guideline7;

  @NonNull
  public final Guideline guideline8;

  private ActivityDashboardBinding(@NonNull ConstraintLayout rootView,
      @NonNull BottomNavigationView bottomNavigationView,
      @NonNull ConstraintLayout consLayoutDashboard, @NonNull Guideline guideline,
      @NonNull Guideline guideline7, @NonNull Guideline guideline8) {
    this.rootView = rootView;
    this.bottomNavigationView = bottomNavigationView;
    this.consLayoutDashboard = consLayoutDashboard;
    this.guideline = guideline;
    this.guideline7 = guideline7;
    this.guideline8 = guideline8;
  }

  @Override
  @NonNull
  public ConstraintLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static ActivityDashboardBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static ActivityDashboardBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.activity_dashboard, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static ActivityDashboardBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.bottomNavigationView;
      BottomNavigationView bottomNavigationView = ViewBindings.findChildViewById(rootView, id);
      if (bottomNavigationView == null) {
        break missingId;
      }

      id = R.id.cons_layout_dashboard;
      ConstraintLayout consLayoutDashboard = ViewBindings.findChildViewById(rootView, id);
      if (consLayoutDashboard == null) {
        break missingId;
      }

      id = R.id.guideline;
      Guideline guideline = ViewBindings.findChildViewById(rootView, id);
      if (guideline == null) {
        break missingId;
      }

      id = R.id.guideline7;
      Guideline guideline7 = ViewBindings.findChildViewById(rootView, id);
      if (guideline7 == null) {
        break missingId;
      }

      id = R.id.guideline8;
      Guideline guideline8 = ViewBindings.findChildViewById(rootView, id);
      if (guideline8 == null) {
        break missingId;
      }

      return new ActivityDashboardBinding((ConstraintLayout) rootView, bottomNavigationView,
          consLayoutDashboard, guideline, guideline7, guideline8);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
