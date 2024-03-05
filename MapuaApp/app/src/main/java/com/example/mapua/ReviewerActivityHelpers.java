package com.example.mapua;

import android.os.Parcel;
import android.os.Parcelable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

class ReviewerActivities extends BaseCourseContent {
    private String reviewerId;
    private String course;
    private String date;
    private String title;


    private List<ActivitiesReviewerListItem> activities;

    public ReviewerActivities(String reviewerId, String course, String date, String title) {
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

    public List<ActivitiesReviewerListItem> getActivities() {
        return activities;
    }

    public void setActivities(List<ActivitiesReviewerListItem> activities) {
        this.activities = activities;
    }
}


class ActivitiesReviewerListItem extends BaseCourseContent implements Parcelable {
    private String activityId;
    private String question;
    private String questionType;
    private String answer;
    private Map<String, String> choices;

    private String userAnswer;

    public ActivitiesReviewerListItem(String activityId, String question,String questionType, String answer, Map<String, String> choices) {
        this.activityId = activityId;
        this.question = question;
        this.answer = answer;
        this.questionType = questionType;
        this.choices = choices;
        this.userAnswer = "";
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

    public String getQuestionType() {return questionType;}

    public void setQuestionType(String questionType) {this.questionType = questionType;}

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Map<String, String> getChoices() {
        return choices;
    }

    public void setChoices(Map<String, String> choices) {
        this.choices = choices;
    }

    public String getUserAnswer(){
        return userAnswer;
    }
    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    protected ActivitiesReviewerListItem(Parcel in) {
        activityId = in.readString();
        question = in.readString();
        answer = in.readString();
        questionType = in.readString();
        int size = in.readInt();
        choices = new HashMap<>();
        for (int i = 0; i < size; i++) {
            String key = in.readString();
            String value = in.readString();
            choices.put(key, value);
        }
    }


    public static final Creator<ActivitiesReviewerListItem> CREATOR = new Creator<ActivitiesReviewerListItem>() {
        @Override
        public ActivitiesReviewerListItem createFromParcel(Parcel in) {
            return new ActivitiesReviewerListItem(in);
        }

        @Override
        public ActivitiesReviewerListItem[] newArray(int size) {
            return new ActivitiesReviewerListItem[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(activityId);
        dest.writeString(question);
        dest.writeString(answer);
        dest.writeString(questionType);
        dest.writeInt(choices.size());
        for (Map.Entry<String, String> entry : choices.entrySet()) {
            dest.writeString(entry.getKey());
            dest.writeString(entry.getValue());
        }
    }
}

