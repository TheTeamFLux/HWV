export const seedProblems = [
  {
    id: "stack-implementation",
    title: "스택 구현하기",
    category: "자료구조",
    difficulty: "쉬움",
    progress: 60,
    solved: false,
    description:
      "정수를 저장하는 스택을 구현하세요. 입력으로 전달되는 명령을 순서대로 처리하고 각 연산의 결과를 반환해야 합니다.",
    requirements: [
      "push(x): 정수 x를 스택에 넣습니다.",
      "pop(): 스택의 가장 위 값을 제거하고 반환합니다. 비어 있으면 -1을 반환합니다.",
      "size(): 스택에 들어있는 정수의 개수를 반환합니다.",
      "isEmpty(): 스택이 비어있으면 true, 아니면 false를 반환합니다.",
    ],
    inputExample:
      '["push", "push", "pop", "size", "isEmpty"]\n[[1], [2], [], [], []]',
    outputExample: "[null, null, 2, 1, false]",
    starterCode:
      "import java.util.*;\n\nclass Solution {\n    private final Stack<Integer> stack = new Stack<>();\n\n    public void push(int x) {\n        // 코드를 작성하세요.\n    }\n\n    public int pop() {\n        // 빈 스택 예외도 처리하세요.\n        return 0;\n    }\n\n    public int size() {\n        return 0;\n    }\n\n    public boolean isEmpty() {\n        return false;\n    }\n}",
    tests: [
      { id: 1, name: "테스트 1", status: "pending" },
      { id: 2, name: "테스트 2", status: "pending" },
      { id: 3, name: "테스트 3", status: "pending" },
      { id: 4, name: "테스트 4", status: "pending" },
      { id: 5, name: "테스트 5", status: "pending" },
    ],
  },
  {
    id: "user-service-refactor",
    title: "회원 서비스 중복 검사 개선",
    category: "Spring",
    difficulty: "보통",
    progress: 20,
    solved: false,
    description:
      "사용자 등록 서비스에서 이메일 중복 검사를 수행하고 명확한 예외를 반환하도록 구현하세요.",
    requirements: [
      "이메일로 기존 사용자를 조회합니다.",
      "이미 가입된 이메일이면 예외를 발생시킵니다.",
      "신규 사용자만 저장소에 저장합니다.",
    ],
    inputExample: "register(new User('student@example.com'))",
    outputExample: "저장 성공 또는 DuplicateEmailException",
    starterCode:
      "public User register(User user) {\n    // TODO: 이메일 중복 검사\n    return userRepository.save(user);\n}",
    tests: [
      { id: 1, name: "신규 사용자 저장", status: "pending" },
      { id: 2, name: "중복 이메일 거부", status: "pending" },
      { id: 3, name: "빈 이메일 거부", status: "pending" },
    ],
  },
  {
    id: "react-file-list",
    title: "업로드 파일 목록 렌더링",
    category: "React",
    difficulty: "보통",
    progress: 0,
    solved: false,
    description:
      "선택한 파일 배열을 받아 파일명과 크기를 목록으로 출력하고 삭제할 수 있는 React 컴포넌트를 작성하세요.",
    requirements: [
      "파일 배열을 map으로 렌더링합니다.",
      "각 요소에 안정적인 key를 지정합니다.",
      "삭제 버튼을 누르면 해당 파일만 목록에서 제거합니다.",
    ],
    inputExample: "[File, File, File]",
    outputExample: "파일명, 크기, 삭제 버튼이 포함된 목록",
    starterCode:
      "function FileList({ files, onRemove }) {\n    return (\n        <ul>\n            {/* 코드를 작성하세요. */}\n        </ul>\n    );\n}",
    tests: [
      { id: 1, name: "목록 렌더링", status: "pending" },
      { id: 2, name: "key 지정", status: "pending" },
      { id: 3, name: "삭제 이벤트", status: "pending" },
    ],
  },
];
