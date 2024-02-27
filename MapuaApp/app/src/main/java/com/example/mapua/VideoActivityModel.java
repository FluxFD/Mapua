package com.example.mapua;

import java.util.Map;

public class VideoActivityModel {
    private String title;
    private String date;
    private String video;
    private Map<String, ActivityModel> activities;
    private String Course; // Add the course field

    public VideoActivityModel() {
        // Default constructor required for Firebase
    }

    public VideoActivityModel(String title, String date, String video, Map<String, ActivityModel> activities, String course) {
        this.title = title;
        this.date = date;
        this.video = video;
        this.activities = activities;
        this.Course = Course;
    }
    public String getCourse() {
        return Course;
    }

    public void setCourse(String Course) {
        this.Course = Course;
    }
    public String getTitle() {
        return title;
    }

    public String getDate() {
        return date;
    }

    public String getVideo() {
        return video;
    }

    public Map<String, ActivityModel> getActivities() {
        return activities;
    }
}

class ActivityModel {
    private String answer;
    private Map<String, String> choices;
    private String question;
    private String questionType;
    private String time;

    public ActivityModel() {
        // Default constructor required for Firebase
    }

    public ActivityModel(String answer, Map<String, String> choices, String question, String questionType, String time) {
        this.answer = answer;
        this.choices = choices;
        this.question = question;
        this.questionType = questionType;
        this.time = time;
    }

    public String getAnswer() {
        return answer;
    }

    public Map<String, String> getChoices() {
        return choices;
    }

    public String getQuestion() {
        return question;
    }

    public String getQuestionType() {
        return questionType;
    }

    public String getTime() {
        return time;
    }
}
