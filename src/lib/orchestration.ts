// ============================================================
// Yootopia - Orchestration Engine (Mock)
// 역할 기반 발언 의향 점수 계산 + 응답 생성
// TODO: Replace generateAgentResponse() with real LLM API
// ============================================================
import { Agent, TranscriptMessage, SpeakIntentScore } from '@/types';

// ---- Role-based keyword triggers ----
const ROLE_KEYWORDS: Record<string, string[]> = {
    lawyer: ['법률', '약관', '계약', '개인정보', '법적', '규정', '조항', '소송', '허가', '면허'],
    accountant: ['비용', '예산', '세금', '수익', '지출', '회계', '재무', '이익', '손실', '투자'],
    developer: ['기능', 'API', '구현', '개발', '코드', '시스템', '서버', '데이터베이스', '배포', '테스트'],
    designer: ['UX', 'UI', '디자인', '화면', '레이아웃', '사용성', '색상', '인터페이스', '경험', '와이어프레임'],
    announcer: ['진행', '발표', '안내', '정리', '요약', '공지', '설명'],
};

// ---- Speak intent scoring ----
export function calculateSpeakIntentScores(
    userText: string,
    agents: Agent[],
    recentSpeakerIds: string[],
): SpeakIntentScore[] {
    return agents.map((agent) => {
        const keywords = ROLE_KEYWORDS[agent.role] ?? [];
        let score = 0;

        // Keyword match score
        for (const kw of keywords) {
            if (userText.includes(kw)) score += 3;
        }

        // Random weight
        score += Math.random() * 2;

        // Penalty for recent speakers
        if (recentSpeakerIds.includes(agent.id)) {
            score -= 4;
        }

        return { agentId: agent.id, score };
    });
}

// ---- Mock response templates ----
const RESPONSE_TEMPLATES: Record<string, string[]> = {
    lawyer: [
        '법률적 관점에서 검토가 필요한 부분이 있습니다. 특히 계약 조항과 개인정보 처리 방침에 대한 세밀한 검토가 필요합니다. 법적 리스크를 최소화하기 위해 전문 법무팀의 검토를 권장드립니다.',
        '이 사안은 관련 법규 준수 여부를 먼저 확인해야 합니다. 현행 규정상 허용 범위 내에 있는지 면밀히 살펴보겠습니다. 추가적인 법적 검토가 필요하신가요?',
        '계약서 조항 중 몇 가지 잠재적 법적 위험이 있습니다. 특히 면책 조항과 분쟁 해결 조항을 명확히 할 필요가 있습니다.',
    ],
    accountant: [
        '재무적 관점에서 분석하면, 초기 투자 비용 대비 예상 수익률을 검토해야 합니다. 현재 예산 배분이 적절한지, 운영비가 계획 대비 초과하지 않는지 확인이 필요합니다.',
        '비용-편익 분석 결과, 이 방향이 가장 효율적입니다. 다만 세금 처리와 회계 기준을 명확히 설정해야 합니다. 구체적인 수치를 공유해 주시면 더 정확한 분석을 드릴게요.',
        '예산 측면에서 현재 계획은 실현 가능합니다. 단, 예비비 항목을 10-15% 정도 여유 있게 잡는 것을 권장드립니다.',
    ],
    developer: [
        '기술적 구현 관점에서, 이 기능은 약 2-3주 내에 개발 가능합니다. 다만 기존 시스템과의 API 연동 부분에서 복잡성이 있을 수 있습니다. 기술 스택 선택이 중요할 것 같네요.',
        '개발 난이도를 평가하면 중간 수준입니다. 데이터베이스 설계를 먼저 확정하고 진행하는 것이 효율적일 것 같습니다. 테스트 계획도 함께 세워야 할까요?',
        '이 부분은 성능 최적화가 핵심입니다. 캐싱 전략과 비동기 처리 방식을 먼저 결정해야 전체 아키텍처를 설계할 수 있습니다.',
    ],
    designer: [
        'UX 관점에서, 사용자 흐름이 직관적이어야 합니다. 현재 제안된 구조는 3번째 화면에서 사용자가 혼란을 겪을 수 있습니다. 사용자 테스트를 진행해 보셨나요?',
        '정보 구조 측면에서 개선이 필요합니다. 주요 기능을 상단에 배치하고 보조 기능은 하위 메뉴로 이동하는 것이 사용성을 높일 것입니다.',
        '디자인 시스템 측면에서 일관성이 중요합니다. 색상 팔레트와 컴포넌트 규칙을 먼저 정의하면 개발 속도도 올라갈 것 같습니다.',
    ],
    announcer: [
        '말씀하신 내용을 정리하면, 핵심 쟁점은 세 가지입니다. 각 팀의 의견을 순서대로 들어보도록 하겠습니다.',
        '지금까지의 논의를 요약하면, 방향성은 합의됐고 세부 실행 방안이 남아 있습니다. 다음 단계로 넘어가도 될까요?',
        '좋은 의견 감사합니다. 이 부분에 대해 다른 분들의 의견도 들어보겠습니다.',
    ],
    custom: [
        '말씀하신 내용에 대해 충분히 검토가 필요할 것 같습니다. 추가적인 정보가 있으면 더 구체적인 의견을 드릴 수 있습니다.',
    ],
};

// ---- Generate agent response (Ollama) ----
export async function generateAgentResponse(agent: Agent, userText: string): Promise<string> {
    const prompt = `
당신은 현재 회사 회의에 참석 중입니다.
당신의 역할: ${agent.title} (${agent.role})
당신의 이름: ${agent.name}
당신의 전문 분야: ${agent.specialty}
당신의 말투: ${agent.personalityTone}
당신의 응답 스타일: ${agent.responseStyle}

상황 및 시스템 프롬프트: ${agent.systemPrompt || '당신의 역할에 맞게 아주 자연스러운 한국어로 대화에 참여하세요.'}

회의 중 누군가가 다음과 같이 발언했습니다: "${userText}"

이 발언을 듣고 당신의 역할과 성격에 맞게 대답하세요.
절대 다른 언어를 쓰지 말고 오직 '자연스러운 한국어'로만 문서나 대본의 형식이 아닌, 육성으로 말하는 것처럼 자연스럽게 1~3문장으로 짧게 대답하세요.
`;

    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'qwen3-coder-next:latest',
                prompt: prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            console.error('Ollama API error:', response.statusText);
            return `[${agent.name}] (시스템 오류: 연결할 수 없습니다.)`;
        }

        const data = await response.json();
        return `[${agent.name}] ${data.response.trim()}`;
    } catch (err) {
        console.error('Failed to call Ollama:', err);
        return `[${agent.name}] (시스템 오류: Ollama 응답 실패)`;
    }
}
