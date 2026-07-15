package com.example.backend.dto;

public class GenerateQuizRequest {

    private String summary;
    private Long userId;
    private String code;

    public GenerateQuizRequest() {
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
