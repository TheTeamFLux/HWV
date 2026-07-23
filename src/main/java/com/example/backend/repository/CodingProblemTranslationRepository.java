package com.example.backend.repository;

import com.example.backend.entity.CodingProblem;
import com.example.backend.entity.CodingProblemTranslation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CodingProblemTranslationRepository extends JpaRepository<CodingProblemTranslation, Long> {
    Optional<CodingProblemTranslation> findByProblemAndLanguage(CodingProblem problem, String language);
    List<CodingProblemTranslation> findByProblemIdInAndLanguage(Collection<Long> problemIds, String language);
}
