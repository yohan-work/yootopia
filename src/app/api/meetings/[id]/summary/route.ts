import { NextRequest, NextResponse } from 'next/server';
import { meetingRepo, transcriptRepo, agentRepo, summaryRepo } from '@/lib/mock-db';

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const meeting = meetingRepo.findById(id);
    if (!meeting) return NextResponse.json({ error: '회의를 찾을 수 없습니다.' }, { status: 404 });

    const msgs = transcriptRepo.findByMeeting(id);
    const agentMsgs = msgs.filter((m) => m.speakerType === 'agent');

    // Mock summary generation
    // TODO: Replace with actual LLM summarization
    const uniqueSpeakers = [...new Set(agentMsgs.map((m) => m.speakerName))];

    const summary = summaryRepo.upsert({
        meetingId: id,
        keyTopics: [
            '회의 주요 현안 논의',
            '게스트/참석자 역할별 의견 공유',
            '실행 방안 검토',
        ],
        decisions: [
            '추가 검토 후 최종 방향 결정 예정',
            `${uniqueSpeakers.join(', ')}의 의견을 바탕으로 다음 단계 진행`,
        ],
        actionItems: [
            { id: '1', text: '관련 문서 검토 및 공유', assignee: uniqueSpeakers[0] ?? '담당자', done: false },
            { id: '2', text: '다음 회의 일정 확정', done: false },
            { id: '3', text: '결정 사항 공지 및 이행', done: false },
        ],
        reviewItems: ['추가 전문가 의견 수렴 필요', '구체적 일정 및 예산 확정 필요'],
        generatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ data: summary });
}

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const summary = summaryRepo.findByMeeting(id);
    if (!summary) return NextResponse.json({ error: '요약이 없습니다.' }, { status: 404 });
    return NextResponse.json({ data: summary });
}
