import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import CodeEditor from "../../components/lab/CodeEditor";
import TestCasePanel from "../../components/lab/TestCasePanel";
import { publishSolutionToGitHub } from "../../services/githubApi";
import { getProblem, submitSolution } from "../../services/problemApi";
import "./LabPages.css";

function ProblemWorkspacePage() {
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [sourceCode, setSourceCode] = useState("");
  const [language, setLanguage] = useState("Java");
  const [tests, setTests] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [githubResult, setGitHubResult] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    let active = true;

    getProblem(problemId)
      .then((result) => {
        if (active && result) {
          setProblem(result);
          setSourceCode(result.starterCode);
          setLanguage(
            result.detectedLanguage ||
              result.programmingLanguage ||
              result.language ||
              "언어 정보 없음",
          );
          setTests(result.tests);
        }
      })
      .catch((error) => { if (active) setErrorMessage(error.message); })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [problemId]);

  async function handleSubmit() {
    if (!problem || !sourceCode.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      setErrorMessage("");

      const result = await submitSolution({
        problemId: problem.id,
        language,
        sourceCode,
      });

      setTests(result.tests);
      setSubmissionResult(result);
    } catch (error) {
      setErrorMessage(error.message || "Java 코드 실행에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGitHubPublish() {
    try {
      setIsPublishing(true);
      setErrorMessage("");
      setGitHubResult(await publishSolutionToGitHub(submissionResult.attempt.id));
    } catch (error) {
      setErrorMessage(error.message || "GitHub에 저장하지 못했습니다.");
    } finally {
      setIsPublishing(false);
    }
  }

  if (isLoading) {
    return <div className="workspace-loading">문제를 불러오고 있습니다...</div>;
  }

  if (!problem) {
    return (
      <div className="lab-page lab-page--narrow">
        <section className="large-empty">
          <strong>문제를 찾을 수 없습니다.</strong>
          <span>코드를 업로드해 새로운 AI 문제를 만들어 주세요.</span>
          <Link className="lab-primary-link" to="/problems/new">
            ＋ AI 문제 만들기
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <div className="workspace-breadcrumb">
        <Link to="/problems">AI 문제</Link>
        <span>›</span>
        <strong>{problem.title}</strong>
      </div>

      <div className="workspace-grid">
        <div className="workspace-left">
          <section className="problem-statement">
            <div className="problem-statement__header">
              <div>
                <h1>{problem.title}</h1>
                <span
                  className={
                    "difficulty difficulty--" +
                    (problem.difficulty === "쉬움"
                      ? "easy"
                      : problem.difficulty === "어려움"
                        ? "hard"
                        : "medium")
                  }
                >
                  {problem.difficulty}
                </span>
              </div>
            </div>

            {problem.summary && (
              <div className="ai-summary-box">
                <strong>AI 코드 요약</strong>
                <p>{problem.summary}</p>
              </div>
            )}

            <p>{problem.description}</p>

            <ul>
              {problem.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>

            <div className="example-block">
              <strong>입력 예시</strong>
              <pre>{problem.inputExample}</pre>
            </div>

            <div className="example-block">
              <strong>출력 예시</strong>
              <pre>{problem.outputExample}</pre>
            </div>
          </section>

          <div className="ai-summary-box">
            <strong>코드 작성 안내</strong>
            <p>
              {problem.methodName
                ? "기본 Solution 클래스는 그대로 두고 solution 메서드 내부의 TODO와 return 부분만 수정해 주세요. 입력·출력 코드는 서버가 자동으로 처리합니다."
                : "기본으로 제공되는 Main 클래스와 main 메서드는 그대로 두고 solution 메서드 내부만 수정해 주세요."}
            </p>
          </div>

          <CodeEditor
            value={sourceCode}
            language={language}
            onChange={setSourceCode}
          />

          <div className="workspace-actions">
            <button
              type="button"
              className="submit-code-button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Java 코드를 실행하고 있습니다..." : "실행하기"}
            </button>

            <button
              type="button"
              className="reset-code-button"
              onClick={() => {
                setSourceCode(problem.starterCode);
                setTests(problem.tests);
                setSubmissionResult(null);
              }}
            >
              ↻ 코드 초기화
            </button>
          </div>
        </div>

        <aside className="workspace-right">
          <TestCasePanel tests={tests} />

          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

          <section className="feedback-card">
            <div className="feedback-card__header">
              <h2>실행 결과</h2>
              {submissionResult && (
                <span
                  className={
                    submissionResult.status === "passed"
                      ? "result-pill result-pill--passed"
                      : "result-pill result-pill--failed"
                  }
                >
                  {submissionResult.status === "passed" ? "성공" : "실패"}
                </span>
              )}
            </div>

            {!submissionResult ? (
              <div className="compact-empty">
                코드를 실행하면 테스트 케이스별 실제 출력과 통과 여부가 표시됩니다.
              </div>
            ) : (
              <>
                {submissionResult.hint && (
                  <article className="feedback-box feedback-box--hint">
                    <strong>☼ 힌트</strong>
                    <p>{submissionResult.hint}</p>
                  </article>
                )}

                <article className="feedback-box feedback-box--improvement">
                  <strong>ⓘ 보완할 점</strong>
                  <p>{submissionResult.improvement}</p>
                </article>
                {submissionResult.status === "passed" && (
                  <article className="feedback-box github-publish-box">
                    <strong>GitHub 학습 기록</strong>
                    {githubResult ? (
                      <a href={githubResult.commitUrl} target="_blank" rel="noreferrer">커밋 확인하기</a>
                    ) : (
                      <button type="button" onClick={handleGitHubPublish} disabled={isPublishing}>
                        {isPublishing ? "GitHub에 저장하고 있습니다..." : "GitHub에 저장"}
                      </button>
                    )}
                  </article>
                )}
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ProblemWorkspacePage;
