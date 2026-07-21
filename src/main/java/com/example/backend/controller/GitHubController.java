package com.example.backend.controller;

import com.example.backend.service.GitHubIntegrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/github")
public class GitHubController {
    private final GitHubIntegrationService githubService;
    public GitHubController(GitHubIntegrationService githubService) { this.githubService = githubService; }

    @PostMapping("/connect")
    public Map<String, Object> connect(@RequestBody Map<String, Object> request) {
        return githubService.startConnection(Long.valueOf(String.valueOf(request.get("userId"))), String.valueOf(request.get("repositoryUrl")));
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> callback(@RequestParam("installation_id") Long installationId, @RequestParam String state) {
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(githubService.completeConnection(installationId, state))).build();
    }

    @GetMapping("/status")
    public Map<String, Object> status(@RequestParam Long userId) { return githubService.status(userId); }

    @DeleteMapping("/connection")
    public Map<String, String> disconnect(@RequestParam Long userId) {
        githubService.disconnect(userId); return Map.of("message", "GitHub 연결을 해제했습니다.");
    }

    @PostMapping("/publish")
    public Map<String, Object> publish(@RequestBody Map<String, Object> request) {
        return githubService.publish(Long.valueOf(String.valueOf(request.get("userId"))),
            Long.valueOf(String.valueOf(request.get("submissionId"))), String.valueOf(request.get("publishToken")));
    }
}
