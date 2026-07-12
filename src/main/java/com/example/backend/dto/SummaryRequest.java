package com.example.backend.dto;

public class SummaryRequest {

    private String text;

    public SummaryRequest() {
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
