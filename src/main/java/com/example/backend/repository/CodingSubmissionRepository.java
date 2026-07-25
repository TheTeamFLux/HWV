package com.example.backend.repository;

import com.example.backend.entity.CodingSubmission;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {
    @EntityGraph(attributePaths = "problem")
    List<CodingSubmission> findByUserOrderBySubmittedAtDesc(User user);

    @EntityGraph(attributePaths = "problem")
    List<CodingSubmission> findTop4ByUserOrderBySubmittedAtDesc(User user);

    @EntityGraph(attributePaths = "problem")
    List<CodingSubmission> findByUserAndPassedFalseOrderBySubmittedAtDesc(User user);

    @EntityGraph(attributePaths = "problem")
    Optional<CodingSubmission> findFirstByUserAndPassedTrueOrderBySubmittedAtDesc(User user);

    @Query("select distinct submission.problem.id from CodingSubmission submission where submission.user = :user and submission.passed = true")
    List<Long> findSolvedProblemIdsByUser(@Param("user") User user);

    long countByUserAndPassed(User user, boolean passed);
}
