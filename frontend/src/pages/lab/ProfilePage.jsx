import { getSessionUser } from "../../services/session";
import "./LabPages.css";

function ProfilePage() {
  const user = getSessionUser();
  const displayName = user?.name || "사용자";

  return (
    <div className="lab-page lab-page--narrow">
      <div className="lab-page__heading">
        <div>
          <span className="lab-page__eyebrow">MY PAGE</span>
          <h1>마이페이지</h1>
          <p>계정 정보와 학습 설정을 관리하세요.</p>
        </div>
      </div>

      <section className="surface-card profile-card">
        <div className="profile-card__avatar">{displayName.slice(0, 1)}</div>
        <div>
          <h2>{displayName}</h2>
          <p>{user?.email || "로그인 이메일 정보 없음"}</p>
        </div>

        <dl>
          <div>
            <dt>주 사용 언어</dt>
            <dd>업로드 시 자동 감지</dd>
          </div>
          <div>
            <dt>목표 난이도</dt>
            <dd>문제 생성 시 선택</dd>
          </div>
          <div>
            <dt>가입 상태</dt>
            <dd>활성</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default ProfilePage;
