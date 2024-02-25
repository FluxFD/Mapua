package com.example.mapua;

public class ReviewerHelpers extends BaseCourseContent {
    private String Course;
    private String createdBy;
    private String file;
    private String title;

    public ReviewerHelpers() {
        // Default constructor required for calls to DataSnapshot.getValue(Reviewer.class)
    }

    public ReviewerHelpers(String course, String createdBy, String file, String title) {
        this.Course = course;
        this.createdBy = createdBy;
        this.file = file;
        this.title = title;
    }

    public String getCourse() {
        return Course;
    }

    public void setCourse(String course) {
        this.Course = course;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
