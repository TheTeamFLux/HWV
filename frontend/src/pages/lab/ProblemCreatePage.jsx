import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../../i18n/LanguageContext";
import { analyzeJavaFile } from "../../services/javaLearningApi";
import "./LabPages.css";

const difficultyValues = ["균형", "쉬움", "보통", "어려움"];
const copy = {
  ko: { eyebrow: "HWV CODE LAB", title: "새 문제 만들기", subtitle: "Java 파일을 업로드하면 핵심 문법을 분석해 코딩 문제 3개를 만듭니다.", drop: "Java 파일을 끌어다 놓거나 아래 버튼으로 선택하세요.", onlyJava: ".java 파일만 선택할 수 있습니다.", select: "Java 파일 선택", selected: "파일 선택 완료", language: "분석 언어", ready: "AI 분석을 시작할 수 있습니다.", remove: "파일 제거", difficulty: "문제 난이도", labels: ["균형 있게", "쉬움", "보통", "어려움"], balanced: "쉬움·보통·어려움 문제를 각각 1개 생성합니다.", three: "문제 3개를 생성합니다.", analyze: "AI 분석 시작", analyzing: "AI가 Java 코드를 분석하고 있습니다...", result: "AI 분석 결과", resultHelp: "업로드한 코드에서 찾은 핵심 Java 문법입니다.", view: "생성된 코딩 문제 3개 확인하기", javaOnly: "확장자가 .java인 Java 파일만 업로드할 수 있습니다.", choose: "분석할 Java 파일을 먼저 선택해 주세요.", failed: "Java 파일을 분석하지 못했습니다.", analyzeFirst: "Java 파일 분석을 먼저 완료해 주세요.", importance: "중요도" },
  en: { eyebrow: "HWV CODE LAB", title: "Create new problems", subtitle: "Upload a Java file to analyze its core syntax and create three coding problems.", drop: "Drag a Java file here or choose one below.", onlyJava: "Only .java files are supported.", select: "Choose Java file", selected: "File selected", language: "Analysis language", ready: "Ready for AI analysis.", remove: "Remove file", difficulty: "Problem difficulty", labels: ["Balanced", "Easy", "Medium", "Hard"], balanced: "Creates one Easy, Medium, and Hard problem.", three: "Creates three problems.", analyze: "Start AI analysis", analyzing: "AI is analyzing your Java code...", result: "AI analysis result", resultHelp: "Core Java syntax found in your uploaded code.", view: "View 3 generated coding problems", javaOnly: "Please upload a Java file with a .java extension.", choose: "Choose a Java file first.", failed: "Could not analyze the Java file.", analyzeFirst: "Complete the Java analysis first.", importance: "Importance" },
  ja: { eyebrow: "HWV CODE LAB", title: "新しい問題を作る", subtitle: "Javaファイルをアップロードすると、重要な文法を分析してコーディング問題を3問作成します。", drop: "Javaファイルをドラッグするか、下のボタンから選択してください。", onlyJava: ".javaファイルのみ選択できます。", select: "Javaファイルを選択", selected: "ファイル選択完了", language: "分析言語", ready: "AI分析を開始できます。", remove: "ファイルを削除", difficulty: "問題の難易度", labels: ["バランス", "簡単", "普通", "難しい"], balanced: "簡単・普通・難しい問題を1問ずつ作成します。", three: "同じ難易度で3問作成します。", analyze: "AI分析を開始", analyzing: "AIがJavaコードを分析しています...", result: "AI分析結果", resultHelp: "アップロードしたコードから見つかった重要なJava文法です。", view: "生成された3問を確認する", javaOnly: ".java拡張子のJavaファイルのみアップロードできます。", choose: "分析するJavaファイルを先に選択してください。", failed: "Javaファイルを分析できませんでした。", analyzeFirst: "Javaファイルの分析を先に完了してください。", importance: "重要度" },
};

const aiDisclosure = {
  ko: "본 학습 콘텐츠와 코딩 문제는 Google Gemini를 활용하여 생성되었습니다. AI 생성 결과에는 부정확한 내용이 포함될 수 있습니다.",
  en: "This learning content and its coding problems were generated with Google Gemini. AI-generated results may contain inaccuracies.",
  ja: "この学習コンテンツとコーディング問題はGoogle Geminiを活用して生成されました。AIの生成結果には不正確な内容が含まれる場合があります。",
};

function ProblemCreatePage() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = copy[language] || copy.ko;
  const disclosure = aiDisclosure[language] || aiDisclosure.ko;
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [difficulty, setDifficulty] = useState("균형");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function selectJavaFile(fileList) {
    const file = Array.from(fileList).find((item) => item.name.toLowerCase().endsWith(".java"));
    if (!file) { setSelectedFile(null); setAnalysis(null); setErrorMessage(text.javaOnly); return; }
    setSelectedFile(file); setAnalysis(null); setErrorMessage("");
  }
  async function handleAnalyze(event) {
    event.preventDefault();
    if (!selectedFile) { setErrorMessage(text.choose); return; }
    try { setIsAnalyzing(true); setErrorMessage(""); setAnalysis(await analyzeJavaFile(selectedFile, difficulty)); }
    catch (error) { setErrorMessage(error.message || text.failed); }
    finally { setIsAnalyzing(false); }
  }

  return <div className="lab-page lab-page--narrow">
    <div className="lab-page__heading"><div><span className="lab-page__eyebrow">{text.eyebrow}</span><h1>{text.title}</h1><p>{text.subtitle}</p></div></div>
    <form className="creation-card" onSubmit={handleAnalyze}>
      <section>
        <div className="project-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectJavaFile(event.dataTransfer.files); }}>
          <strong>{text.drop}</strong><span>{text.onlyJava}</span><div><button type="button" onClick={() => fileInputRef.current?.click()}>{text.select}</button></div>
        </div>
        <input ref={fileInputRef} type="file" accept=".java" onChange={(event) => { selectJavaFile(event.target.files); event.target.value = ""; }} hidden />
        {selectedFile && <div className="selected-project"><div><strong>{text.selected}</strong><span className="selected-project__language">{text.language} <b>Java</b></span><span>{selectedFile.name}</span><small>{(selectedFile.size / 1024).toFixed(1)}KB · {text.ready}</small></div><button type="button" onClick={() => { setSelectedFile(null); setAnalysis(null); setErrorMessage(""); }}>{text.remove}</button></div>}
        <fieldset className="difficulty-field difficulty-field--creation"><legend>{text.difficulty}</legend><div className="difficulty-options difficulty-options--four">{difficultyValues.map((value, index) => <button key={value} type="button" className={difficulty === value ? "difficulty-option difficulty-option--active" : "difficulty-option"} onClick={() => setDifficulty(value)} disabled={isAnalyzing}>{text.labels[index]}</button>)}</div><small>{difficulty === "균형" ? text.balanced : `${text.labels[difficultyValues.indexOf(difficulty)]} ${text.three}`}</small></fieldset>
        <button type="submit" className="creation-analyze-button" disabled={isAnalyzing || !selectedFile}>{isAnalyzing ? text.analyzing : text.analyze}</button>
      </section>
      {analysis && <section className="analysis-result-section"><div className="section-heading"><span>2</span><div><h2>{text.result}</h2><p>{text.resultHelp}</p></div></div><div className="grammar-card-grid">{analysis.grammars.map((grammar) => <article className="grammar-card" key={grammar.name}><strong>{grammar.name}</strong><span className="grammar-card__rating" aria-label={`${text.importance}: ${grammar.rating}/5`}>{"★".repeat(grammar.rating)}<i>{"★".repeat(5 - grammar.rating)}</i></span><p>{grammar.description}</p></article>)}</div><p className="ai-generated-notice" role="note"><b>AI</b><span>{disclosure}</span></p><button type="button" className="creation-submit" onClick={() => navigate("/problems")}>{text.view}</button></section>}
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
    </form>
  </div>;
}

export default ProblemCreatePage;
