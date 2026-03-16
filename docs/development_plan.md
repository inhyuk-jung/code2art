# Code2Art (Is My Code Art?) 개발 계획서

본 문서는 `code_to_art_idea.md` 기획안을 바탕으로 완성된 서비스 기능과 향후 로드맵을 정리한 개발 지침서입니다.

## 1. 프로젝트 핵심 요약
*   **목표**: 사용자 코드를 브라우저에서 분석하여 AI 기반 제너러티브 아트로 변환.
*   **보안 원칙**: 100% 클라이언트 사이드 코드 파싱 (원본 코드는 서버 전송 불가).
*   **핵심 기능**: 8대 코드 메트릭 분석, 5대 명화 스타일 지원, AI 도슨트 비평, ArtBot 애니메이션.

---

## 2. 완료된 마일스톤 (v1.5)

### ✅ Phase 1: 프로젝트 기반 설정 및 UI/UX (완료)
*   **디자인 시스템**: 네오-팝(Neo-pop) 스타일의 조형미와 부드러운 파스텔 톤 UI 구축.
*   **반응형 레이아웃**: 중앙 집중형 1컬럼 레이아웃으로 콘텐츠 몰입도 강화.
*   **에디터 통합**: 코드 분석과 언어 선택 기능이 통합된 CodeEditor 컴포넌트.

### ✅ Phase 2: 코어 분석 엔진 (완료)
*   **AST 파서**: Babel Standalone을 활용한 JS/TS 정밀 분석 및 15개 언어 정규식 폴백 엔진 구축.
*   **8대 지표 추출**: Complexity, Cohesion, Consistency, Coupling, Depth, Readability, Sentiment, Paradigm 수치화.
*   **화풍 자동 선택 (Auto-selection)**: 추출된 메트릭을 기반으로 최적의 화풍을 매칭하는 `resolveAutoStyle` 알고리즘 구현.

### ✅ Phase 3: AI 제너레이터 및 프롬프트 (완료)
*   **모델 지원**: OpenAI DALL-E 3 (Server Proxy) 및 Google Gemini 3.1 Flash (Client SDK).
*   **프롬프트 엔지니어링**: 메트릭 수치를 예술적 메타포로 변환하는 정교한 프롬프트 빌더.
*   **안전 필터 최적화**: DALL-E 3의 세이프티 가이드라인을 준수하는 단어 순화 로직 적용.

### ✅ Phase 4: UI/UX 고도화 - ArtBot (완료)
*   **3단계 로딩 시스템**: 
    1. **화풍 확정**: 고민하는 로봇 (3초 인위적 딜레이로 시각적 인지성 확보).
    2. **그림 그리는 중**: 팔레트와 붓을 든 로봇의 페인팅 애니메이션.
    3. **도슨트 작성 중**: 노트에 필기하는 로봇과 함께 생성되는 AI 비평문.

### ✅ Phase 5: 백엔드 및 보안 (완료)
*   **OpenAI Proxy Route**: 브라우저 CORS 문제 해결을 위해 Next.js API Routes를 통한 서버사이드 OpenAI SDK 호출 프록시 구축.
*   **API Key 영속성**: 브라우저 세션 동안 입력된 키 정보를 안전하게 유지.

---

## 3. 기술 스택 상세
*   **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
*   **Parsing**: @babel/standalone (AST Analysis)
*   **AI SDK**: `openai` (Official Node SDK via API Routes), `@google/genai` (Client SDK)
*   **Icons**: Lucide React

---

## 4. 향후 로드맵 (Upcoming)
1.  **이미지 히스토리**: 로컬 스토리지를 활용해 생성된 작품들을 갤러리 형태로 보관.
2.  **커스텀 스타일**: 사용자가 직접 원하는 화풍이나 키워드를 추가할 수 있는 기능.
3.  **이미지 다운로드 및 공유 고도화**: 완성된 작품을 인스타그램 스토리 포맷으로 자동 변환하여 다운로드.
4.  **다중 파일 분석**: 특정 파일 하나가 아닌 전체 폴더의 상호작용을 한 장의 거대한 캔버스에 담는 기능.
