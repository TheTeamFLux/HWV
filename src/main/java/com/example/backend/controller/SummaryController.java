package com.example.backend.controller;

import com.example.backend.dto.SummaryRequest;
import com.example.backend.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/summary")
public class SummaryController {

    private final GeminiService geminiService;

    public SummaryController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public String summarize(@RequestBody SummaryRequest request) {

        return geminiService.summarize(request.getText());

    }
}
