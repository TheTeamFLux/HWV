import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getWrongNotes } from "../../services/problemApi";
import "./LabPages.css";

function WrongNotesPage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    getWrongNotes().then((result) => {
      if (active) {
        setNotes(result);
      }
    }).catch((error) => { if (active) setErrorMessage(error.message); })
      .finally(() => { if (active) setIsLoading(false); });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="lab-page">
      <div className="lab-page__heading">
        <div>
          <span className="lab-page__eyebrow">WRONG NOTES</span>
          <h1>오답노트</h1>
          <p>AI 예상 테스트에서 보완이 필요했던 코드를 다시 확인하세요.</p>
        </div>
      </div>

      <section className="surface-card">
        {isLoading ? (
          <div className="large-empty">오답노트를 불러오고 있습니다...</div>
        ) : errorMessage ? (
          <p className="form-error" role="alert">{errorMessage}</p>
        ) : notes.length === 0 ? (
          <div className="large-empty">
            <strong>저장된 오답이 없습니다.</strong>
            <span>Java 문제를 풀면 틀린 답과 해설이 여기에 저장됩니다.</span>
            <Link className="lab-primary-link" to="/problems/new">
              Java 문제 만들기
            </Link>
          </div>
        ) : (
          <div className="note-list">
            {notes.map((note) => (
              <article key={note.id}>
                <div>
                  <span>{new Date(note.submittedAt).toLocaleString("ko-KR")}</span>
                  <h2>{note.problemTitle}</h2>
                  <p>
                    {note.grammarName} · 예상 통과 {note.passedCount}/{note.totalCount} · {note.explanation}
                  </p>
                </div>
                <Link to={"/problems/" + note.problemId}>다시 풀기</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default WrongNotesPage;
