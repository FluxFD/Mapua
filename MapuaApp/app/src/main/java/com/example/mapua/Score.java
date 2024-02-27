package com.example.mapua;

class Score {
    private String taskName;
    private int score; // Assuming score is a numeric value



    public Score(String taskName, int score) {
        this.taskName = taskName;
        this.score = score;
    }

    public Score(String taskName, Long fetchedScore) {

    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
