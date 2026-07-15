function TestCasePanel({ tests }) {
  return (
    <section className="test-card">
      <h2>AI 예상 테스트 케이스</h2>

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

              <span className={"test-status test-status--" + test.status}>
                <b>
                  {test.status === "passed"
                    ? "✓"
                    : test.status === "failed"
                      ? "×"
                      : "·"}
                </b>
                {test.status === "passed"
                  ? "예상 통과"
                  : test.status === "failed"
                    ? "예상 실패"
                    : "대기"}
              </span>

              <small>{test.reason || "실제 실행 전"}</small>
            </div>

            {test.status === "failed" && (
              <div className="test-item__details">
                <span>입력</span>
                <code>{test.input}</code>
                <span>기대 출력</span>
                <code>{test.expected}</code>
                <span>내 코드 출력</span>
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
