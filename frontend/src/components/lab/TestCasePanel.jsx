function TestCasePanel({ tests }) {
  return (
    <section className="test-card">
      <h2>테스트 케이스</h2>

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
                  ? "통과"
                  : test.status === "failed"
                    ? "실패"
                    : "대기"}
              </span>

              <small>
                {test.runtime
                  ? test.runtime + " / " + test.memory
                  : "-"}
              </small>
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
