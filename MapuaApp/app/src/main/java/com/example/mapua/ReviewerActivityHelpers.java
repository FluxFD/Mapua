package com.example.mapua;

import java.util.List;

public class ReviewerActivityHelpers {

    public static class Reviewer {
        private String reviewerId;
        private String course;
        private String date;
        private String title;
        private List<Activities> activities;

        public Reviewer(String reviewerId, String course, String date, String title, List<Activities> activities) {
            this.reviewerId = reviewerId;
            this.course = course;
            this.date = date;
            this.title = title;
            this.activities = activities;
        }

        public String getReviewerId() {
            return reviewerId;
        }

        public void setReviewerId(String reviewerId) {
            this.reviewerId = reviewerId;
        }

        public String getCourse() {
            return course;
        }

        public void setCourse(String course) {
            this.course = course;
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

        public List<Activities> getActivities() {
            return activities;
        }

        public void setActivities(List<Activities> activities) {
            this.activities = activities;
        }
    }

    public static class Activities {
        private String activityId;
        private String question;
        private String answer;

        public Activities(String activityId, String question, String answer) {
            this.activityId = activityId;
            this.question = question;
            this.answer = answer;
        }

        public String getActivityId() {
            return activityId;
        }

        public void setActivityId(String activityId) {
            this.activityId = activityId;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getAnswer() {
            return answer;
        }

        public void setAnswer(String answer) {
            this.answer = answer;
        }
    }

    // Other helper methods can go here
}
