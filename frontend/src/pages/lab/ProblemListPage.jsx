import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { getProblems } from "../../services/problemApi";
import { useLanguage } from "../../i18n/LanguageContext";
import "./LabPages.css";

function ProblemListPage() {
  const { language, t } = useLanguage();
  const copy = {
    ko: { all: "전체", title: "Java 문제", subtitle: "Java 코딩 문제를 풀고 학습 기록을 확인하세요.", create: "새 문제 만들기", progress: "진행", empty: "아직 생성된 문제가 없습니다.", emptyHelp: "Java 파일을 업로드해 문법별 코딩 문제 3개를 만들어 보세요.", categories: { "메서드 선언": "메서드 선언", "조건문": "조건문", "for문": "for문", "클래스 선언": "클래스 선언", "배열": "배열" }, difficulty: { "쉬움": "쉬움", "보통": "보통", "어려움": "어려움" } },
    en: { all: "All", title: "Java problems", subtitle: "Solve Java coding problems and review your learning history.", create: "Create new problems", progress: "complete", empty: "No problems generated yet.", emptyHelp: "Upload a Java file to create three syntax-based coding problems.", categories: { "메서드 선언": "Method", "조건문": "Conditionals", "for문": "For loop", "클래스 선언": "Class", "배열": "Array" }, difficulty: { "쉬움": "Easy", "보통": "Medium", "어려움": "Hard" } },
    ja: { all: "すべて", title: "Java問題", subtitle: "Javaコーディング問題を解いて学習記録を確認しましょう。", create: "新しい問題を作る", progress: "進行", empty: "生成された問題はありません。", emptyHelp: "Javaファイルをアップロードして文法別の問題を3問作りましょう。", categories: { "메서드 선언": "メソッド宣言", "조건문": "条件文", "for문": "for文", "클래스 선언": "クラス宣言", "배열": "配列" }, difficulty: { "쉬움": "簡単", "보통": "普通", "어려움": "難しい" } },
  }[language];
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [category, setCategory] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => {
      if (!active) return [];
      setIsLoading(true);
      setErrorMessage("");
      return getProblems(language);
    }).then((result) => {
      if (!active) return;

      if (result.length === 0) {
        navigate("/problems/new", { replace: true });
        return;
      }

      setProblems(result);
    })
      .catch((error) => { if (active) setErrorMessage(error.message); })
      .finally(() => { if (active) setIsLoading(false); });

    return () => {
      active = false;
    };
  }, [navigate, language]);

  const categories = ["전체", ...new Set(problems.map((item) => item.category))];
  const visibleProblems =
    category === "전체"
      ? problems
      : problems.filter((problem) => problem.category === category);

  return (
    <div className="lab-page">
      <div className="lab-page__heading">
        <div>
          <span className="lab-page__eyebrow">HWV CODE LAB</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <Link className="lab-primary-link" to="/problems/new">
          ＋ {copy.create}
        </Link>
      </div>

      {problems.length > 0 && (
        <div className="filter-row">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item
                  ? "filter-chip filter-chip--active"
                  : "filter-chip"
              }
              onClick={() => setCategory(item)}
            >
              {item === "전체" ? copy.all : (copy.categories[item] || item)}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <section className="large-empty">{t("loadingProblems")}</section>
      ) : errorMessage ? (
        <p className="form-error" role="alert">{errorMessage}</p>
      ) : visibleProblems.length ? (
        <section className="problem-grid">
          {visibleProblems.map((problem) => (
          <Link
            className="problem-card"
            key={problem.id}
            to={"/problems/" + problem.id}
          >
            <div className="problem-card__top">
              <span>{copy.categories[problem.category] || problem.category}</span>
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
                {copy.difficulty[problem.difficulty] || problem.difficulty}
              </span>
            </div>
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <div className="problem-card__progress">
              <div>
                <span style={{ width: problem.progress + "%" }} />
              </div>
              <small>{problem.progress}% {copy.progress}</small>
            </div>
          </Link>
          ))}
        </section>
      ) : (
        <section className="large-empty">
          <strong>{copy.empty}</strong>
          <span>
            {copy.emptyHelp}
          </span>
          <Link className="lab-primary-link" to="/problems/new">
            ＋ {copy.create}
          </Link>
        </section>
      )}
    </div>
  );
}

export default ProblemListPage;
