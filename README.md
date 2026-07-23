# NAVER OGQ AI
HWV (Help With Vision)

### 배경

프로그래밍 학습에서는 단순히 문법을 익히는 것보다 직접 코드를 작성하고 피드백을 받는 과정이 중요합니다. 하지만 기존 학습 플랫폼은 모든 사용자에게 동일한 문제를 제공하기 때문에 개인의 학습 수준과 작성한 코드에 맞는 맞춤형 학습이 어렵습니다.

또한 자신이 작성한 코드를 기반으로 부족한 개념을 파악하고 반복적으로 학습할 수 있는 환경이 부족하여 학습 효율이 떨어지는 문제가 있습니다.

### 문제점

#### 1. 획일적인 학습 환경

기존 플랫폼은 정형화된 문제만 제공하기 때문에 개인의 수준과 학습 내용에 맞는 실습이 어렵습니다.

#### 2. 코드 기반 피드백 부족

사용자가 작성한 Java 코드를 분석하여 어떤 문법을 사용했고 어떤 개념을 더 학습해야 하는지 알려주는 맞춤형 피드백이 부족합니다.

#### 3. 지속적인 학습 관리의 어려움

문제를 해결한 이후에도 제출 기록과 학습 결과를 체계적으로 관리하기 어려워 반복 학습과 성장을 이어가기 어렵습니다.

### 해결 방안 (HWV의 가치)

HWV는 사용자가 업로드한 Java 코드를 AI가 분석하여 핵심 문법을 추출하고, 이를 기반으로 개인 맞춤형 코딩 문제를 생성하는 AI 기반 학습 플랫폼입니다.

생성된 문제는 실제 Java 컴파일러를 통해 채점되며, 제출 결과와 학습 기록을 저장하여 사용자가 자신의 성장 과정을 확인하고 반복 학습할 수 있도록 지원합니다.

또한 Render 무료 서버의 초기 지연 문제를 해결하기 위해 로그인 전 프로젝트 소개 화면을 제공하고, 백그라운드에서 서버를 미리 활성화하여 보다 자연스러운 사용자 경험을 제공합니다.

### 시스템 아키텍처

#### 데이터 및 서비스 흐름

**Client (Frontend)**

- Java 파일 업로드
- AI 분석 결과 확인
- 생성된 코딩 문제 풀이
- 코드 제출 및 결과 확인
- 학습 통계 및 제출 기록 조회

**Server (Backend)**

- Java 문법 분석
- Gemini AI 호출
- 맞춤형 문제 생성
- Java 코드 컴파일 및 실행
- 테스트 케이스 기반 자동 채점
- 결과 저장 및 학습 데이터 관리

**AI Pipeline**

- Java 코드 분석
- 핵심 문법 추출
- 코드 요약 생성
- 맞춤형 코딩 문제 생성

**Database**

- 사용자 정보
- 코드 분석 결과
- 생성된 문제
- 제출 기록
- 학습 통계

---

### 사용 스택

| 분류 | 기술 스택 |
|------|-----------|
| Backend | Spring Boot, Java 21, Spring Security, Spring Data JPA |
| Frontend | React, JavaScript, CSS |
| Database | MySQL |
| AI | Google Gemini 2.5 Flash Lite |
| Deployment | Render, Vercel |
| Design | Figma |
| IDE / Tools | IntelliJ IDEA, VS Code, ChatGPT, Claude, Codex |

---

### 실행 방법

#### Backend

```bash
git clone <repository-url>

cd backend

./gradlew bootRun
```

#### Frontend

```bash
cd frontend

npm install

npm run dev
```

#### 환경 변수

```properties
SPRING_DATASOURCE_URL=

SPRING_DATASOURCE_USERNAME=

SPRING_DATASOURCE_PASSWORD=

GEMINI_API_KEY=

JWT_SECRET=

FRONTEND_URL=
```

---

### AI 사용 내역

#### 사용한 AI 모델

- Google Gemini 2.5 Flash Lite
- ChatGPT
- Claude
- Codex

#### 활용 내용

- Java 코드 분석 및 맞춤형 문제 생성
- 코드 리팩토링 및 개발 보조
- UI/UX 디자인 아이디어
- README 및 발표 자료 작성
- 테스트 코드 작성 보조

### 라이선스

본 프로젝트는 NAVER OGQ AI 공모전 출품을 목적으로 제작되었습니다.

MIT License를 따릅니다.

### 사용한 AI 모델

- ChatGPT
- Claude
- Google Gemini 2.5 Flash Lite
- Codex

### 오픈소스 패키지

#### Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- Lombok
- Jackson
- MySQL Connector/J
- JJWT

#### Frontend

- React
- React Router
- Axios
- Lucide React
- Framer Motion

#### Build Tool

- Gradle
- Vite
