package com.example.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "github_connection")
public class GitHubConnection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", unique = true) private User user;
    @Column(nullable = false) private String repositoryOwner;
    @Column(nullable = false) private String repositoryName;
    private Long installationId;
    private boolean privateRepository;
    @Column(unique = true, length = 100) private String state;
    private LocalDateTime stateExpiresAt;
    private LocalDateTime connectedAt;
    @Column(length = 64) private String publishTokenHash;

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User value) { user = value; }
    public String getRepositoryOwner() { return repositoryOwner; }
    public void setRepositoryOwner(String value) { repositoryOwner = value; }
    public String getRepositoryName() { return repositoryName; }
    public void setRepositoryName(String value) { repositoryName = value; }
    public Long getInstallationId() { return installationId; }
    public void setInstallationId(Long value) { installationId = value; }
    public boolean isPrivateRepository() { return privateRepository; }
    public void setPrivateRepository(boolean value) { privateRepository = value; }
    public String getState() { return state; }
    public void setState(String value) { state = value; }
    public LocalDateTime getStateExpiresAt() { return stateExpiresAt; }
    public void setStateExpiresAt(LocalDateTime value) { stateExpiresAt = value; }
    public LocalDateTime getConnectedAt() { return connectedAt; }
    public void setConnectedAt(LocalDateTime value) { connectedAt = value; }
    public String getPublishTokenHash() { return publishTokenHash; }
    public void setPublishTokenHash(String value) { publishTokenHash = value; }
}
