package com.example.backend.service;

public class CodeExecutionUnavailableException extends RuntimeException {
    public CodeExecutionUnavailableException(String message) {
        super(message);
    }

    public CodeExecutionUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
