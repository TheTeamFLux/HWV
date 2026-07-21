package com.example.backend.repository;

import com.example.backend.entity.GitHubConnection;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GitHubConnectionRepository extends JpaRepository<GitHubConnection, Long> {
    Optional<GitHubConnection> findByUser(User user);
    Optional<GitHubConnection> findByState(String state);
}
