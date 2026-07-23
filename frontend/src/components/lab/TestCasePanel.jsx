import { useLanguage } from "../../i18n/LanguageContext";

function TestCasePanel({ tests }) {
  const { language } = useLanguage();
  const text = ({
    ko: { title: "실행 테스트 케이스", input: "입력", passed: "통과", failed: "실패", waiting: "대기", expected: "기대 출력", actual: "내 코드 출력" },
    en: { title: "Test Cases", input: "Input", passed: "Passed", failed: "Failed", waiting: "Waiting", expected: "Expected", actual: "Your Output" },
    ja: { title: "テストケース", input: "入力", passed: "合格", failed: "失敗", waiting: "待機", expected: "期待する出力", actual: "コードの出力" },
  })[language];
  return (
    <section className="test-card">
      <h2>{text.title}</h2>

      <div className="test-list">
        {tests.map((test) => (
          <article
            key={test.id}
            className={
              "test-item " +
              (test.status === "failed" ? "test-item--failed" : "")
            }
          >
            <div className="test-item__summary">
              <strong>{test.name}</strong>

              <small className="test-item__input">{text.input}: {test.input}</small>

              <span className={"test-status test-status--" + test.status}>
                <b>
                  {test.status === "passed"
                    ? "✓"
                    : test.status === "failed"
                      ? "×"
                      : "·"}
                </b>
                {test.status === "passed"
                  ? text.passed
                  : test.status === "failed"
                    ? text.failed
                    : text.waiting}
              </span>

            </div>

            {test.status === "failed" && (
              <div className="test-item__details">
                <span>{text.input}</span>
                <code>{test.input}</code>
                <span>{text.expected}</span>
                <code>{test.expected}</code>
                <span>{text.actual}</span>
                <code>{test.actual}</code>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default TestCasePanel;
