import { useMemo } from "react";

const SUPPORTED_LANGUAGES = [
  "PDF 내용에서 AI 자동 감지",
  "Java",
  "Kotlin",
  "Python",
  "JavaScript",
  "React (JavaScript)",
  "TypeScript",
  "React (TypeScript)",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Swift",
  "Ruby",
  "PHP",
];

function CodeEditor({ value, onChange, language, onLanguageChange }) {
  const lineNumbers = useMemo(() => {
    const count = Math.max(value.split("\n").length, 16);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [value]);

  return (
    <section className="code-card">
      <div className="code-card__header">
        <h2>코드 작성</h2>

        <select
          value={language}
          aria-label="프로그래밍 언어"
          onChange={(event) => onLanguageChange(event.target.value)}
        >
          {SUPPORTED_LANGUAGES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="code-editor">
        <pre className="code-editor__lines" aria-hidden="true">
          {lineNumbers.join("\n")}
        </pre>
        <textarea
          value={value}
          spellCheck="false"
          aria-label="소스 코드"
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </section>
  );
}

export default CodeEditor;
