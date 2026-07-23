import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import CodeEditor from "../../components/lab/CodeEditor";
import TestCasePanel from "../../components/lab/TestCasePanel";
import { publishSolutionToGitHub } from "../../services/githubApi";
import { getProblem, submitSolution } from "../../services/problemApi";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LabPages.css";

const workspaceCopy = {
  ko: {
    javaProblems: "Java 문제", codingTest: "코딩 테스트", notFound: "문제를 찾을 수 없습니다.", notFoundHelp: "코드를 업로드해 새로운 AI 문제를 만들어 주세요.", createAi: "＋ AI 문제 만들기",
    description: "문제 설명", requirements: "제약 조건", inputExample: "입력 예시", outputExample: "출력 예시", guide: "코드 작성 안내", methodGuide: "기본 Solution 클래스는 그대로 두고 solution 메서드 내부의 TODO와 return 부분만 수정해 주세요. 입력·출력 코드는 서버가 자동으로 처리합니다.", mainGuide: "기본으로 제공되는 Main 클래스와 main 메서드는 그대로 두고 solution 메서드 내부만 수정해 주세요.",
    running: "Java 코드를 실행하고 있습니다...", run: "▷ 코드 실행", reset: "↻ 코드 초기화", runFailed: "Java 코드 실행에 실패했습니다.", githubFailed: "GitHub에 저장하지 못했습니다.", result: "실행 결과", success: "성공", failure: "실패", resultEmpty: "코드를 실행하면 테스트 케이스별 실제 출력과 통과 여부가 표시됩니다.", allPassed: "모든 테스트 케이스를 통과했습니다!", someFailed: "통과하지 못한 테스트 케이스가 있습니다.", hint: "☼ 힌트", improvement: "ⓘ 보완할 점", githubLearning: "GitHub 학습 기록", viewCommit: "커밋 확인하기", savingGithub: "GitHub에 저장하고 있습니다...", saveGithub: "GitHub에 저장",
    difficulty: { "쉬움": "쉬움", "보통": "보통", "어려움": "어려움" }, categories: { "메서드 선언": "메서드 선언", "조건문": "조건문", "for문": "for문", "클래스 선언": "클래스 선언", "배열": "배열" },
  },
  en: {
    javaProblems: "Java Problems", codingTest: "Coding Test", notFound: "Problem not found.", notFoundHelp: "Upload code to create new AI problems.", createAi: "＋ Create AI Problems",
    description: "Description", requirements: "Constraints", inputExample: "Input Example", outputExample: "Output Example", guide: "Coding Guide", methodGuide: "Keep the provided Solution class and edit only the TODO and return statement inside the solution method. The server handles input and output automatically.", mainGuide: "Keep the provided Main class and main method, and edit only the inside of the solution method.",
    running: "Running Java code...", run: "▷ Run Code", reset: "↻ Reset Code", runFailed: "Failed to run the Java code.", githubFailed: "Failed to save to GitHub.", result: "Result", success: "Passed", failure: "Failed", resultEmpty: "Run your code to see the actual output and pass status for each test case.", allPassed: "All test cases passed!", someFailed: "Some test cases did not pass.", hint: "☼ Hint", improvement: "ⓘ What to Improve", githubLearning: "GitHub Learning Record", viewCommit: "View Commit", savingGithub: "Saving to GitHub...", saveGithub: "Save to GitHub",
    difficulty: { "쉬움": "Easy", "보통": "Medium", "어려움": "Hard" }, categories: { "메서드 선언": "Method", "조건문": "Conditionals", "for문": "For Loop", "클래스 선언": "Class", "배열": "Array" },
  },
  ja: {
    javaProblems: "Java問題", codingTest: "コーディングテスト", notFound: "問題が見つかりません。", notFoundHelp: "コードをアップロードして新しいAI問題を作成してください。", createAi: "＋ AI問題を作る",
    description: "問題説明", requirements: "制約条件", inputExample: "入力例", outputExample: "出力例", guide: "作成ガイド", methodGuide: "基本のSolutionクラスはそのままにして、solutionメソッド内のTODOとreturn部分のみ修正してください。入出力はサーバーが自動処理します。", mainGuide: "基本のMainクラスとmainメソッドはそのままにして、solutionメソッドの内部のみ修正してください。",
    running: "Javaコードを実行しています...", run: "▷ コード実行", reset: "↻ コード初期化", runFailed: "Javaコードを実行できませんでした。", githubFailed: "GitHubに保存できませんでした。", result: "実行結果", success: "成功", failure: "失敗", resultEmpty: "コードを実行すると、各テストケースの実際の出力と合否が表示されます。", allPassed: "すべてのテストケースに合格しました！", someFailed: "合格していないテストケースがあります。", hint: "☼ ヒント", improvement: "ⓘ 改善点", githubLearning: "GitHub学習記録", viewCommit: "コミットを確認", savingGithub: "GitHubに保存しています...", saveGithub: "GitHubに保存",
    difficulty: { "쉬움": "簡単", "보통": "普通", "어려움": "難しい" }, categories: { "메서드 선언": "メソッド宣言", "조건문": "条件文", "for문": "for文", "클래스 선언": "クラス宣言", "배열": "配列" },
  },
};

function ProblemWorkspacePage() {
  const { language: uiLanguage, t } = useLanguage();
  const text = workspaceCopy[uiLanguage] || workspaceCopy.ko;
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [sourceCode, setSourceCode] = useState("");
  const [language, setLanguage] = useState("Java");
  const aiCopy = ({
    ko: { title: "✦ AI 코드 요약", notice: "이 요약은 Google Gemini를 활용하여 생성되었습니다. AI 생성 결과에는 부정확한 내용이 포함될 수 있습니다." },
    en: { title: "✦ AI code summary", notice: "This summary was generated with Google Gemini. AI-generated results may contain inaccuracies." },
    ja: { title: "✦ AIコード要約", notice: "この要約はGoogle Geminiを活用して生成されました。AIの生成結果には不正確な内容が含まれる場合があります。" },
  })[uiLanguage] || { title: "✦ AI 코드 요약", notice: "이 요약은 Google Gemini를 활용하여 생성되었습니다. AI 생성 결과에는 부정확한 내용이 포함될 수 있습니다." };
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
      setErrorMessage(error.message || text.runFailed);
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
      setErrorMessage(error.message || text.githubFailed);
    } finally {
      setIsPublishing(false);
    }
  }

  if (isLoading) {
    return <div className="workspace-loading">{t("loadingProblems")}</div>;
  }

  if (!problem) {
    return (
      <div className="lab-page lab-page--narrow">
        <section className="large-empty">
          <strong>{text.notFound}</strong>
          <span>{text.notFoundHelp}</span>
          <Link className="lab-primary-link" to="/problems/new">
            {text.createAi}
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <div className="workspace-breadcrumb">
        <Link to="/problems">{text.javaProblems}</Link>
        <span>›</span>
        <span>{text.categories[problem.grammarName] || problem.grammarName || text.codingTest}</span>
        <span>›</span>
        <strong>{problem.title}</strong>
      </div>

      <div className="workspace-grid">
        <div className="workspace-left">
          <div className="workspace-problem-overview">
            <section className="problem-statement problem-statement--intro">
              <div className="problem-statement__header">
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
                  {text.difficulty[problem.difficulty] || problem.difficulty}
                </span>
              </div>

              <p>{problem.description}</p>
            </section>
          </div>

          <section className="problem-statement problem-detail-card">
            <div className="problem-detail-card__description">
              <strong>{text.description}</strong>
              <p>{problem.description}</p>
            </div>

            <div className="problem-detail-card__requirements">
              <strong>{text.requirements}</strong>
              <ul>
                {problem.requirements.map((requirement) => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>

            <div className="example-block">
              <strong>{text.inputExample}</strong>
              <pre>{problem.inputExample}</pre>
            </div>

            <div className="example-block">
              <strong>{text.outputExample}</strong>
              <pre>{problem.outputExample}</pre>
            </div>

            <div className="workspace-writing-guide">
              <strong>{text.guide}</strong>
              <p>
                {problem.methodName
                  ? text.methodGuide
                  : text.mainGuide}
              </p>
            </div>
          </section>

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
              {isSubmitting ? text.running : text.run}
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
              {text.reset}
            </button>
          </div>
        </div>

        <aside className="workspace-right">
          <TestCasePanel tests={tests} />

          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}

          <section className="feedback-card">
            <div className="feedback-card__header">
              <h2>{text.result}</h2>
              {submissionResult && (
                <span
                  className={
                    submissionResult.status === "passed"
                      ? "result-pill result-pill--passed"
                      : "result-pill result-pill--failed"
                  }
                >
                  {submissionResult.status === "passed" ? text.success : text.failure}
                </span>
              )}
            </div>

            {!submissionResult ? (
              <div className="compact-empty">
                {text.resultEmpty}
              </div>
            ) : (
              <div className="workspace-result-content">
                <div className={submissionResult.status === "passed" ? "workspace-result-summary workspace-result-summary--passed" : "workspace-result-summary workspace-result-summary--failed"}>
                  <b>{submissionResult.status === "passed" ? "✓" : "!"}</b>
                  <strong>
                    {submissionResult.status === "passed"
                      ? text.allPassed
                      : text.someFailed}
                  </strong>
                </div>
                {submissionResult.hint && (
                  <article className="feedback-box feedback-box--hint">
                    <strong>{text.hint}</strong>
                    <p>{submissionResult.hint}</p>
                  </article>
                )}

                <article className="feedback-box feedback-box--improvement">
                  <strong>{text.improvement}</strong>
                  <p>{submissionResult.improvement}</p>
                </article>
                {submissionResult.status === "passed" && (
                  <article className="feedback-box github-publish-box">
                    <strong>{text.githubLearning}</strong>
                    {githubResult ? (
                      <a href={githubResult.commitUrl} target="_blank" rel="noreferrer">{text.viewCommit}</a>
                    ) : (
                      <button type="button" onClick={handleGitHubPublish} disabled={isPublishing}>
                        {isPublishing ? text.savingGithub : text.saveGithub}
                      </button>
                    )}
                  </article>
                )}
              </div>
            )}
          </section>

          {problem.summary && (
            <section className="ai-summary-box workspace-ai-summary">
              <strong>{aiCopy.title}</strong>
              <p>{problem.summary}</p>
              <p className="ai-generated-notice workspace-ai-notice" role="note"><b>AI</b><span>{aiCopy.notice}</span></p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ProblemWorkspacePage;
