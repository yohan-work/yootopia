# ⚡ Yootopia

> AI 에이전트가 참여하는 다중 에이전트 회의 시뮬레이터

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Vanilla CSS (Dark mode, Glassmorphism) |
| UI Components | shadcn/ui, Lucide Icons |
| 3D 렌더링 | React Three Fiber, @react-three/drei, Three.js |
| 애니메이션 | Framer Motion |
| 상태 관리 | Zustand (예정) |

---

### Phase 1 — 직원 관리 (`/agents`)

- 에이전트 목록 카드 (아바타 색상, 직군 뱃지, 상태 뱃지)
- **직원 추가/수정 다이얼로그**
  - 이름, 직군, 직함, 전문 분야
  - 말투 / 응답 스타일
  - 아바타 색상 (8색 선택)
  - 시스템 프롬프트
- 에이전트 삭제
- Working / Idle 통계 카드
- API: `GET/POST /api/agents`, `PATCH/DELETE /api/agents/[id]`

---

### Phase 2 — 사내 캘린더 (`/meetings`)

- 회의 목록 카드 (날짜/시간, 모드, 참석자 칩)
- **일정 추가 다이얼로그**
  - 제목 / 컨텍스트
  - 시작·종료 날짜+시간
  - 회의 모드 토글 (자유 토론 / 순차 발언 / 지목 발언)
  - 에이전트 참석자 선택 (칩 UI)
- 필터 탭: 전체 · 예정 · 진행중 · 종료
- API: `GET/POST /api/meetings`, `GET/PATCH /api/meetings/[id]`

---

### Phase 3 — 회의실 (`/meetings/[id]`)

#### 3D 에이전트 캐릭터
역할별 동물 캐릭터가 React Three Fiber로 렌더링됩니다.

| 역할 | 캐릭터 | 특징 |
|------|--------|------|
| 변호사 (Qui) | 고양이 🐱 | 라운드 귀, 칼라 |
| 회계사 (Done) | 돼지 🐷 | 둥근 주둥이, 넥타이 |
| 디자이너 (Cal) | 오리 🦆 | 부리, 왕관 깃털, 스카프 |
| 아나운서 (Sian) | 여우 🦊 | 뾰족한 귀, 흰 가슴 |

#### 상태별 애니메이션
- **speaking**: 파란 글로우 링 + 고개 흔들기
- **thinking**: 보라 점 3개 + 좌우 흔들기
- **hand_raised**: 주황 글로우 + 통통 튀기
- **idle**: 은은한 부유 + 좌우 미세 회전

#### 회의 진행 기능
- 회의 시작 / 종료 버튼
- 채팅 입력창 (Enter 전송, Shift+Enter 줄바꿈)
- 에이전트 자동 응답 (키워드 기반 오케스트레이션 엔진)
- **지목 발언** — 특정 에이전트 카드의 "지목" 버튼으로 발언 유도
- 대화 트랜스크립트 패널 (사용자/에이전트/시스템 버블, 자동 스크롤)
- API: `POST /api/meetings/[id]/start`, `end`, `user-message`, `agent-speak`, `runtime-states`

---

### Phase 4 — 회의 요약 (`/meetings/[id]/summary`)

- 회의 통계 (총 발언 수, 사용자/에이전트 발언, 참석자 수)
- AI 요약 생성 버튼 (mock)
  - **핵심 논의사항** 목록
  - **결정사항** 목록
  - **액션 아이템** (담당자 포함)
  - **추가 검토 필요** 항목
- API: `GET/POST /api/meetings/[id]/summary`

---