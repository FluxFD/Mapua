// Generated by view binder compiler. Do not edit!
package com.example.mapua.databinding;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.RecyclerView;
import androidx.viewbinding.ViewBinding;
import androidx.viewbinding.ViewBindings;
import com.example.mapua.R;
import java.lang.NullPointerException;
import java.lang.Override;
import java.lang.String;

public final class FragmentContentBinding implements ViewBinding {
  @NonNull
  private final LinearLayout rootView;

  @NonNull
  public final RecyclerView courseContentRecyclerView;

  @NonNull
  public final RecyclerView courseReviewerCardRecyclerView;

  @NonNull
  public final RecyclerView courseReviewerRecyclerView;

  private FragmentContentBinding(@NonNull LinearLayout rootView,
      @NonNull RecyclerView courseContentRecyclerView,
      @NonNull RecyclerView courseReviewerCardRecyclerView,
      @NonNull RecyclerView courseReviewerRecyclerView) {
    this.rootView = rootView;
    this.courseContentRecyclerView = courseContentRecyclerView;
    this.courseReviewerCardRecyclerView = courseReviewerCardRecyclerView;
    this.courseReviewerRecyclerView = courseReviewerRecyclerView;
  }

  @Override
  @NonNull
  public LinearLayout getRoot() {
    return rootView;
  }

  @NonNull
  public static FragmentContentBinding inflate(@NonNull LayoutInflater inflater) {
    return inflate(inflater, null, false);
  }

  @NonNull
  public static FragmentContentBinding inflate(@NonNull LayoutInflater inflater,
      @Nullable ViewGroup parent, boolean attachToParent) {
    View root = inflater.inflate(R.layout.fragment_content, parent, false);
    if (attachToParent) {
      parent.addView(root);
    }
    return bind(root);
  }

  @NonNull
  public static FragmentContentBinding bind(@NonNull View rootView) {
    // The body of this method is generated in a way you would not otherwise write.
    // This is done to optimize the compiled bytecode for size and performance.
    int id;
    missingId: {
      id = R.id.courseContentRecyclerView;
      RecyclerView courseContentRecyclerView = ViewBindings.findChildViewById(rootView, id);
      if (courseContentRecyclerView == null) {
        break missingId;
      }

      id = R.id.courseReviewerCardRecyclerView;
      RecyclerView courseReviewerCardRecyclerView = ViewBindings.findChildViewById(rootView, id);
      if (courseReviewerCardRecyclerView == null) {
        break missingId;
      }

      id = R.id.courseReviewerRecyclerView;
      RecyclerView courseReviewerRecyclerView = ViewBindings.findChildViewById(rootView, id);
      if (courseReviewerRecyclerView == null) {
        break missingId;
      }

      return new FragmentContentBinding((LinearLayout) rootView, courseContentRecyclerView,
          courseReviewerCardRecyclerView, courseReviewerRecyclerView);
    }
    String missingId = rootView.getResources().getResourceName(id);
    throw new NullPointerException("Missing required view with ID: ".concat(missingId));
  }
}
