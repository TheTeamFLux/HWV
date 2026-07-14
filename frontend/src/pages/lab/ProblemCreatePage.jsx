import { useRef, useState } from "react";
import { useNavigate } from "react-router";

import { createProblemsFromProject } from "../../services/problemApi";
import {
  ACCEPTED_FILE_TYPES,
  detectUploadedMaterial,
  filterSupportedFiles,
} from "../../utils/fileDetection";
import "./LabPages.css";

function ProblemCreatePage() {
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [language, setLanguage] = useState("감지 전");
  const [materialInfo, setMaterialInfo] = useState(null);
  const [difficulty, setDifficulty] = useState("보통");
  const [count, setCount] = useState(3);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function addFiles(fileList) {
    const nextFiles = filterSupportedFiles(fileList);

    if (nextFiles.length === 0) {
      setFiles([]);
      setMaterialInfo(null);
      setLanguage("감지되지 않음");
      setErrorMessage(
        "지원하는 소스 코드 또는 PDF 파일을 찾지 못했습니다.",
      );
      return;
    }

    const nextMaterialInfo = detectUploadedMaterial(nextFiles);

    setFiles(nextFiles);
    setMaterialInfo(nextMaterialInfo);
    setLanguage(nextMaterialInfo.language);
    setErrorMessage("");
  }

  function handleFileChange(event) {
    addFiles(event.target.files);
    event.target.value = "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (files.length === 0) {
      setErrorMessage("분석할 파일 또는 폴더를 먼저 선택해 주세요.");
      return;
    }

    try {
      setIsCreating(true);
      setErrorMessage("");

      const problems = await createProblemsFromProject({
        files,
        language,
        difficulty,
        count,
        materialType: materialInfo?.materialType,
      });

      navigate("/problems/" + problems[0].id);
    } catch (error) {
      setErrorMessage(error.message || "문제를 생성하지 못했습니다.");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="lab-page lab-page--narrow">
      <div className="lab-page__heading">
        <div>
          <span className="lab-page__eyebrow">AI PROBLEM MAKER</span>
          <h1>AI 문제 만들기</h1>
          <p>
            코드나 PDF를 업로드하면 AI가 내용을 요약하고 선택한 난이도에 맞는
            문제를 만듭니다.
          </p>
        </div>
      </div>

      <form className="creation-card" onSubmit={handleSubmit}>
        <section>
          <div className="section-heading">
            <span>1</span>
            <div>
              <h2>학습자료 업로드</h2>
              <p>
                소스 파일, PDF 또는 프로젝트 폴더를 선택하면 자료 유형과
                프로그래밍 언어를 확인합니다.
              </p>
            </div>
          </div>

          <div
            className="project-dropzone"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              addFiles(event.dataTransfer.files);
            }}
          >
            <strong>파일을 끌어다 놓거나 아래 버튼으로 선택하세요.</strong>
            <span>
              PDF, Java, Kotlin, Python, JavaScript, TypeScript, React, C/C++ 등
              지원
            </span>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                파일 선택
              </button>
              <button
                type="button"
                onClick={() => folderInputRef.current?.click()}
              >
                폴더 선택
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileChange}
            hidden
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            webkitdirectory=""
            onChange={handleFileChange}
            hidden
          />

          {files.length > 0 && (
            <div className="selected-project">
              <div>
                <strong>파일 선택 완료 · {files.length}개</strong>
                <span className="selected-project__language">
                  감지된 언어 <b>{language}</b>
                </span>
                <span>
                  {files
                    .slice(0, 4)
                    .map((file) => file.webkitRelativePath || file.name)
                    .join(" · ")}
                </span>
                <small>
                  {materialInfo?.codeFileCount
                    ? `소스 코드 ${materialInfo.codeFileCount}개`
                    : ""}
                  {materialInfo?.codeFileCount && materialInfo?.pdfCount
                    ? " · "
                    : ""}
                  {materialInfo?.pdfCount
                    ? `PDF ${materialInfo.pdfCount}개`
                    : ""}
                  {" · AI 문제 만들기를 누르면 업로드됩니다."}
                </small>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setMaterialInfo(null);
                  setLanguage("감지 전");
                }}
              >
                초기화
              </button>
            </div>
          )}
        </section>

        <section>
          <div className="section-heading">
            <span>2</span>
            <div>
              <h2>문제 생성 설정</h2>
              <p>감지된 언어를 확인하고 원하는 난이도를 선택하세요.</p>
            </div>
          </div>

          <div className="creation-fields">
            <label>
              언어 감지 결과
              <output className="detected-language">{language}</output>
            </label>

            <fieldset className="difficulty-field">
              <legend>난이도</legend>
              <div className="difficulty-options">
                {["쉬움", "보통", "어려움"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      difficulty === option
                        ? "difficulty-option difficulty-option--active"
                        : "difficulty-option"
                    }
                    onClick={() => setDifficulty(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <label>
              문제 수
              <select
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
              >
                <option value={1}>1개</option>
                <option value={3}>3개</option>
                <option value={5}>5개</option>
              </select>
            </label>
          </div>

          <div className="ai-generation-note">
            <strong>AI 생성 방식</strong>
            <p>
              소스 코드는 확장자로 언어를 즉시 감지합니다. PDF는 서버에서 내용을
              추출한 뒤 AI가 언어와 핵심 내용을 분석하며, 선택한 난이도를 기준으로
              문제와 테스트 케이스를 만듭니다.
            </p>
          </div>
        </section>

        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="creation-submit"
          disabled={isCreating}
        >
          {isCreating
            ? "파일을 업로드하고 AI가 문제를 만들고 있습니다..."
            : "업로드 및 AI 문제 만들기"}
        </button>
      </form>
    </div>
  );
}

export default ProblemCreatePage;
