import { NextRequest, NextResponse } from 'next/server';
import { meetingRepo, agentRepo, transcriptRepo, runtimeRepo } from '@/lib/mock-db';
import { generateAgentResponse } from '@/lib/orchestration';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const { agentId, promptHint } = await req.json();

    const meeting = meetingRepo.findById(id);
    if (!meeting) return NextResponse.json({ error: '회의를 찾을 수 없습니다.' }, { status: 404 });

    const agent = agentRepo.findById(agentId);
    if (!agent) return NextResponse.json({ error: '에이전트를 찾을 수 없습니다.' }, { status: 404 });

    runtimeRepo.upsert(id, agentId, {
        uiState: 'speaking',
        lastSpokenAt: new Date().toISOString(),
    });

    // Get recent transcripts
    const transcripts = transcriptRepo.findByMeeting(id);

    const responseText = await generateAgentResponse(agent, meeting, transcripts, promptHint ?? '지목 발언 요청');
    const agentMsg = transcriptRepo.add({
        meetingId: id,
        speakerType: 'agent',
        speakerId: agentId,
        speakerName: `${agent.name} (${agent.title})`,
        text: responseText,
        timestamp: new Date().toISOString(),
    });

    runtimeRepo.upsert(id, agentId, { uiState: 'idle' });

    const runtimeStates = runtimeRepo.findByMeeting(id);
    return NextResponse.json({ data: { message: agentMsg, runtimeStates } });
}
