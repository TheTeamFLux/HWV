package com.example.backend.controller;

import com.example.backend.dto.*;
import com.example.backend.service.ProblemGenerationService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ProblemController {
    private final ProblemGenerationService problemService;
    public ProblemController(ProblemGenerationService problemService) { this.problemService = problemService; }

    @PostMapping("/projects/problems")
    public List<Map<String, Object>> generate(@RequestBody CodingProblemRequest request) { return problemService.generate(request); }
    @GetMapping("/problems")
    public List<Map<String, Object>> problems(@RequestParam Long userId) { return problemService.findAll(userId); }
    @GetMapping("/problems/{id}")
    public Map<String, Object> problem(@PathVariable Long id, @RequestParam Long userId) { return problemService.findOne(id, userId); }
    @PostMapping("/submissions")
    public Map<String, Object> submit(@RequestBody CodingSubmissionRequest request) { return problemService.review(request); }
}
