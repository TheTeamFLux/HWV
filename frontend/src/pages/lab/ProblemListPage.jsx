import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getProblems } from "../../services/problemApi";
import "./LabPages.css";

function ProblemListPage() {
  const [problems, setProblems] = useState([]);
  const [category, setCategory] = useState("전체");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    getProblems().then((result) => { if (active) setProblems(result); })
      .catch((error) => { if (active) setErrorMessage(error.message); })
      .finally(() => { if (active) setIsLoading(false); });

    return () => {
      active = false;
    };
  }, []);

  const categories = ["전체", ...new Set(problems.map((item) => item.category))];
  const visibleProblems =
    category === "전체"
      ? problems
      : problems.filter((problem) => problem.category === category);

  return (
    <div className="lab-page">
      <div className="lab-page__heading">
        <div>
          <span className="lab-page__eyebrow">AI GENERATED PROBLEMS</span>
          <h1>AI 문제</h1>
          <p>업로드한 Java 코드의 핵심 문법마다 생성된 AI 코딩 문제입니다.</p>
        </div>
        <Link className="lab-primary-link" to="/problems/new">
          ＋ 새 문제 만들기
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
              {item}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <section className="large-empty">문제 목록을 불러오고 있습니다...</section>
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
              <span>{problem.category}</span>
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
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <div className="problem-card__progress">
              <div>
                <span style={{ width: problem.progress + "%" }} />
              </div>
              <small>{problem.progress}% 진행</small>
            </div>
          </Link>
          ))}
        </section>
      ) : (
        <section className="large-empty">
          <strong>아직 생성된 문제가 없습니다.</strong>
          <span>
            Java 파일을 업로드해 문법별 코딩 문제 3개를 만들어 보세요.
          </span>
          <Link className="lab-primary-link" to="/problems/new">
            ＋ AI 문제 만들기
          </Link>
        </section>
      )}
    </div>
  );
}

export default ProblemListPage;
