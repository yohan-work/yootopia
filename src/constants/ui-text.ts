// ============================================================
// Yootopia - Korean UI Text Constants
// ============================================================

export const SIDEBAR_LABELS = {
    dashboard: '대시보드',
    agents: '직원 관리',
    chat: '채팅 관리',
    calendar: '사내 캘린더',
    meetingRoom: '회의실',
    system: '시스템',
} as const;

export const AGENT_ROLE_LABELS: Record<string, string> = {
    lawyer: '변호사',
    accountant: '회계사',
    developer: '개발자',
    designer: '디자이너',
    announcer: '아나운서',
    custom: '커스텀',
};

export const AGENT_STATUS_LABELS: Record<string, string> = {
    working: 'Working',
    idle: 'Idle',
    offline: 'Offline',
};

export const MEETING_MODE_LABELS: Record<string, string> = {
    free: '자유 토론',
    round_robin: '순차 발언',
    directed: '지목 발언',
};

export const MEETING_STATUS_LABELS: Record<string, string> = {
    scheduled: '예정',
    live: '진행중',
    ended: '종료',
};

export const AGENT_UI_STATE_LABELS: Record<string, string> = {
    idle: '대기중',
    thinking: '생각중',
    speaking: '발언중',
    hand_raised: '손들기',
};

export const PERSONALITY_TONE_LABELS: Record<string, string> = {
    calm: '차분함',
    direct: '직설적',
    friendly: '친절함',
    analytical: '분석적',
    creative: '창의적',
};

export const RESPONSE_STYLE_LABELS: Record<string, string> = {
    brief: '간결하게',
    logical: '논리적',
    questioning: '질문형',
    detailed: '상세하게',
};

export const PAGE_TITLES = {
    dashboard: '대시보드',
    agents: '직원 관리',
    meetings: '사내 캘린더',
    meetingRoom: '회의실',
    summary: '회의 요약',
} as const;
