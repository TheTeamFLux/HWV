export const LANGUAGE_BY_EXTENSION = {
  java: "Java",
  kt: "Kotlin",
  py: "Python",
  js: "JavaScript",
  jsx: "React (JavaScript)",
  ts: "TypeScript",
  tsx: "React (TypeScript)",
  c: "C",
  h: "C",
  cc: "C++",
  cpp: "C++",
  hpp: "C++",
  cs: "C#",
  go: "Go",
  rs: "Rust",
  swift: "Swift",
  rb: "Ruby",
  php: "PHP",
};

export const PDF_LANGUAGE_LABEL = "PDF 내용에서 AI 자동 감지";

export const ACCEPTED_FILE_TYPES = [
  ".pdf",
  ...Object.keys(LANGUAGE_BY_EXTENSION).map((extension) => `.${extension}`),
].join(",");

export function getFileExtension(fileName) {
  return fileName.toLowerCase().split(".").pop();
}

export function filterSupportedFiles(fileList) {
  return Array.from(fileList).filter((file) => {
    const path = (file.webkitRelativePath || file.name).toLowerCase();
    const extension = getFileExtension(file.name);
    const isSupported = extension === "pdf" || LANGUAGE_BY_EXTENSION[extension];

    return (
      isSupported &&
      !path.includes("/node_modules/") &&
      !path.includes("/.git/") &&
      !path.includes("/dist/") &&
      !path.includes("/build/")
    );
  });
}

export function detectUploadedMaterial(files) {
  const languageCounts = files.reduce((counts, file) => {
    const language = LANGUAGE_BY_EXTENSION[getFileExtension(file.name)];

    if (language) {
      counts[language] = (counts[language] || 0) + 1;
    }

    return counts;
  }, {});
  const detectedLanguage = Object.entries(languageCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];
  const pdfCount = files.filter(
    (file) => getFileExtension(file.name) === "pdf",
  ).length;

  return {
    language: detectedLanguage || (pdfCount ? PDF_LANGUAGE_LABEL : "감지되지 않음"),
    pdfCount,
    codeFileCount: files.length - pdfCount,
    materialType:
      pdfCount === files.length
        ? "pdf"
        : pdfCount > 0
          ? "mixed"
          : "code",
  };
}
