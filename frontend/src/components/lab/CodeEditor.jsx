import { useMemo, useRef } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

function CodeEditor({ value, onChange, language }) {
  const { language: uiLanguage } = useLanguage();
  const text = ({
    ko: { title: "코드 작성", detected: "자동 감지", languageLabel: "자동 감지된 프로그래밍 언어", source: "소스 코드" },
    en: { title: "Code Editor", detected: "Detected", languageLabel: "Detected programming language", source: "Source code" },
    ja: { title: "コード作成", detected: "自動検出", languageLabel: "自動検出されたプログラミング言語", source: "ソースコード" },
  })[uiLanguage];
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const lineNumbers = useMemo(() => {
    const count = Math.max(value.split("\n").length, 16);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [value]);

  function restoreSelection(start, end) {
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start, end);
    });
  }

  function handleKeyDown(event) {
    if (event.key !== "Tab") {
      return;
    }

    event.preventDefault();

    const textarea = event.currentTarget;
    const source = textarea.value;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const tabSize = 4;
    const lineStart = source.lastIndexOf("\n", Math.max(0, start - 1)) + 1;

    if (start === end && !event.shiftKey) {
      const column = start - lineStart;
      const spaces = tabSize - (column % tabSize);
      const indentation = " ".repeat(spaces);
      onChange(source.slice(0, start) + indentation + source.slice(end));
      restoreSelection(start + spaces, start + spaces);
      return;
    }

    if (start === end && event.shiftKey) {
      const leadingSpaces = source.slice(lineStart).match(/^ {1,4}/)?.[0].length || 0;
      if (!leadingSpaces) return;

      onChange(source.slice(0, lineStart) + source.slice(lineStart + leadingSpaces));
      const nextCursor = Math.max(lineStart, start - leadingSpaces);
      restoreSelection(nextCursor, nextCursor);
      return;
    }

    const blockStart = lineStart;
    const effectiveEnd = end > start && source[end - 1] === "\n" ? end - 1 : end;
    const nextNewLine = source.indexOf("\n", effectiveEnd);
    const blockEnd = nextNewLine === -1 ? source.length : nextNewLine;
    const lines = source.slice(blockStart, blockEnd).split("\n");
    const firstLineOffset = start - blockStart;

    if (event.shiftKey) {
      const removedCounts = lines.map(
        (line) => line.match(/^ {1,4}/)?.[0].length || 0,
      );
      const transformed = lines
        .map((line, index) => line.slice(removedCounts[index]))
        .join("\n");
      const totalRemoved = removedCounts.reduce((sum, count) => sum + count, 0);
      const newStart = start - Math.min(removedCounts[0], firstLineOffset);
      const newEnd = Math.max(newStart, end - totalRemoved);

      onChange(
        source.slice(0, blockStart) + transformed + source.slice(blockEnd),
      );
      restoreSelection(newStart, newEnd);
      return;
    }

    const indentation = " ".repeat(tabSize);
    const transformed = lines.map((line) => indentation + line).join("\n");
    const addedLength = indentation.length * lines.length;

    onChange(
      source.slice(0, blockStart) + transformed + source.slice(blockEnd),
    );
    restoreSelection(start + indentation.length, end + addedLength);
  }

  function handleScroll(event) {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  }

  return (
    <section className="code-card">
      <div className="code-card__header">
        <h2>{text.title}</h2>

        <output
          className="code-card__language"
          aria-label={text.languageLabel}
        >
          <span>{text.detected}</span>
          <strong>{language}</strong>
        </output>
      </div>

      <div className="code-editor">
        <pre
          ref={lineNumbersRef}
          className="code-editor__lines"
          aria-hidden="true"
        >
          {lineNumbers.join("\n")}
        </pre>
        <textarea
          ref={textareaRef}
          value={value}
          spellCheck="false"
          aria-label={text.source}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
        />
      </div>
    </section>
  );
}

export default CodeEditor;
