package com.example.backend.controller;

import com.example.backend.dto.JavaAnalysisResponse;
import com.example.backend.service.JavaLearningGenerationService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/java")
public class JavaAnalysisController {
    private final JavaLearningGenerationService generationService;
    public JavaAnalysisController(JavaLearningGenerationService generationService) { this.generationService = generationService; }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public JavaAnalysisResponse analyze(@RequestPart("file") MultipartFile file,
                                        @RequestParam("userId") Long userId) throws Exception {
        if (file.isEmpty() || file.getOriginalFilename() == null || !file.getOriginalFilename().toLowerCase().endsWith(".java")) {
            throw new IllegalArgumentException(".java 파일만 업로드할 수 있습니다.");
        }
        if (file.getSize() > 1024 * 1024) throw new IllegalArgumentException("Java 파일은 1MB 이하여야 합니다.");
        return generationService.generateAll(userId, new String(file.getBytes(), StandardCharsets.UTF_8));
    }
}
