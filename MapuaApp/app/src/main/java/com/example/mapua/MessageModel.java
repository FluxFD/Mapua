package com.example.mapua;

class MessageModel {
    private String courseId;
    private String date;
    private String message;
    private String name;
    private String uid;
    private String Course;

    public MessageModel() {
        // Default constructor required for calls to DataSnapshot.getValue(Message.class)
    }

    public MessageModel(String Course, String date, String message, String name, String uid) {
        this.Course = Course;
        this.date = date;
        this.message = message;
        this.name = name;
        this.uid = uid;
    }

    // Getters and setters
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCourse() {
        return Course;
    }

    public void setCourse(String Course) {
        this.Course = Course;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
