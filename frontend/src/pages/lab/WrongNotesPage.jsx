import { useEffect, useState } from "react";
import { Link } from "react-router";

import { getWrongNotes } from "../../services/problemApi";
import "./LabPages.css";

function WrongNotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    let active = true;

    getWrongNotes().then((result) => {
      if (active) {
        setNotes(result);
      }
    });

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
          <p>틀린 Java 문법 문제와 해설을 다시 확인하세요.</p>
        </div>
      </div>

      <section className="surface-card">
        {notes.length === 0 ? (
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
                    {note.grammarName} · 정답 {note.correctAnswer}번 · {note.explanation}
                  </p>
                </div>
                <Link to="/quiz">다시 풀기</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default WrongNotesPage;
