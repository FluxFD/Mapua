package com.example.mapua;

public class TaskHelpers extends BaseCourseContent {
    private String Course;
    private String dueDate;
    private String taskName;

    public TaskHelpers() {
        // Default constructor required for calls to DataSnapshot.getValue(Task.class)
    }

    public TaskHelpers(String course, String dueDate, String taskName) {
        this.Course = course;
        this.dueDate = dueDate;
        this.taskName = taskName;
    }

    public String getCourse() {
        return Course;
    }

    public void setCourse(String course) {
        this.Course = course;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
}
