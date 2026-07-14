package com.example.backend.controller;

import com.example.backend.service.ProblemGenerationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/problem")
public class ProblemController {

    private final ProblemGenerationService service;

    public ProblemController(ProblemGenerationService service) {
        this.service = service;
    }

    @PostMapping("/generate")
    public String generate(@RequestBody Map<String,String> request){

        return service.generate(request.get("code"));
    }
}