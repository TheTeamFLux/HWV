package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "coding_problem_translation", uniqueConstraints =
    @UniqueConstraint(name = "uk_problem_translation_language", columnNames = {"problem_id", "language"}))
public class CodingProblemTranslation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "problem_id", nullable = false)
    @JsonIgnore
    private CodingProblem problem;

    @Column(nullable = false, length = 5)
    private String language;

    @Column(nullable = false, length = 100)
    private String grammarName;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String description;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String summary;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String requirementsJson;

    @Lob
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String testNamesJson;

    public Long getId() { return id; }
    public CodingProblem getProblem() { return problem; }
    public void setProblem(CodingProblem problem) { this.problem = problem; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getGrammarName() { return grammarName; }
    public void setGrammarName(String grammarName) { this.grammarName = grammarName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getRequirementsJson() { return requirementsJson; }
    public void setRequirementsJson(String requirementsJson) { this.requirementsJson = requirementsJson; }
    public String getTestNamesJson() { return testNamesJson; }
    public void setTestNamesJson(String testNamesJson) { this.testNamesJson = testNamesJson; }
}
