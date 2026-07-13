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
          <p>실패한 테스트가 있었던 제출을 다시 확인하고 보완하세요.</p>
        </div>
      </div>

      <section className="surface-card">
        {notes.length === 0 ? (
          <div className="large-empty">
            <strong>저장된 오답이 없습니다.</strong>
            <span>문제를 제출하고 실패한 테스트를 확인해 보세요.</span>
            <Link className="lab-primary-link" to="/problems">
              문제 풀러 가기
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
                    테스트 {note.totalCount}개 중 {note.passedCount}개 통과
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
