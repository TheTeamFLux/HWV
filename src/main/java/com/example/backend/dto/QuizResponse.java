package com.example.backend.dto;

import java.util.List;

public class QuizResponse {

    private List<Question> questions;

    public QuizResponse() {}

    public QuizResponse(List<Question> questions) {
        this.questions = questions;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public static class Question {

        private Long id;
        private String question;
        private List<String> options;

        public Question() {}

        public Question(Long id, String question, List<String> options) {
            this.id = id;
            this.question = question;
            this.options = options;
        }

        public Long getId() {
            return id;
        }

        public String getQuestion() {
            return question;
        }

        public List<String> getOptions() {
            return options;
        }
    }
}
