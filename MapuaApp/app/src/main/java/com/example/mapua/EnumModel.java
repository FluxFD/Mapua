package com.example.mapua;


import java.util.List;
import java.util.Map;

class EnumerationObject {
    private String Course;
    private String createdBy;
    private String date;
    private String title;
    private Map<String, EnumActivity> activities;

    public EnumerationObject() {
        // Default constructor required for calls to DataSnapshot.getValue(EnumerationObject.class)
    }

    public EnumerationObject(String Course, String createdBy, String date, String title, Map<String, EnumActivity> activities) {
        this.Course = Course;
        this.createdBy = createdBy;
        this.date = date;
        this.title = title;
        this.activities = activities;
    }

    public String getCourse() {
        return Course;
    }

    public void setCourse(String Course) {
        this.Course = Course;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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

    public Map<String, EnumActivity> getActivities() {
        return activities;
    }

    public void setActivities(Map<String, EnumActivity> activities) {
        this.activities = activities;
    }
}

class EnumActivity {
    private List<String> answer;
    private String question;
    private String questionType;

    public EnumActivity() {
        // Default constructor required for calls to DataSnapshot.getValue(EnumActivity.class)
    }

    public EnumActivity(List<String> answer, String question, String questionType) {
        this.answer = answer;
        this.question = question;
        this.questionType = questionType;
    }

    public List<String> getAnswer() {
        return answer;
    }

    public void setAnswer(List<String> answer) {
        this.answer = answer;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }
}
