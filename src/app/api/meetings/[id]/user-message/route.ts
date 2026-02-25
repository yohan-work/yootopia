import { NextRequest, NextResponse } from 'next/server';
import { meetingRepo, agentRepo, transcriptRepo, runtimeRepo } from '@/lib/mock-db';
import { calculateSpeakIntentScores, generateAgentResponse } from '@/lib/orchestration';

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const meeting = meetingRepo.findById(id);
    if (!meeting) return NextResponse.json({ error: '회의를 찾을 수 없습니다.' }, { status: 404 });
    if (meeting.status !== 'live') {
        return NextResponse.json({ error: '회의가 진행 중이 아닙니다.' }, { status: 400 });
    }

    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: '텍스트가 비어있습니다.' }, { status: 400 });

    // 1. Save user message
    const userMsg = transcriptRepo.add({
        meetingId: id,
        speakerType: 'user',
        speakerName: '사용자',
        text,
        timestamp: new Date().toISOString(),
    });

    // 2. Get participants
    const participantAgents = meeting.participantAgentIds
        .map((agentId) => agentRepo.findById(agentId))
        .filter(Boolean) as import('@/types').Agent[];

    // 3. Calculate speak intent scores
    const recentTranscripts = transcriptRepo
        .findByMeeting(id)
        .filter((t) => t.speakerType === 'agent')
        .slice(-4)
        .map((t) => t.speakerId ?? '');

    const scores = calculateSpeakIntentScores(text, participantAgents, recentTranscripts);
    scores.sort((a, b) => b.score - a.score);

    // 4. Select speakers (top 1-2)
    const speakerCount = Math.random() > 0.4 ? 1 : 2;
    const speakers = scores.slice(0, speakerCount);
    const handRaised = scores.slice(speakerCount, speakerCount + 2);

    // 5. Reset all states to idle first
    for (const agent of participantAgents) {
        runtimeRepo.upsert(id, agent.id, { uiState: 'idle' });
    }

    // 6. Set hand_raised
    for (const { agentId } of handRaised) {
        runtimeRepo.upsert(id, agentId, { uiState: 'hand_raised' });
    }

    // 7. Generate responses sequentially (simulate speaking)
    const newMessages = [userMsg];
    for (const { agentId } of speakers) {
        const agent = agentRepo.findById(agentId);
        if (!agent) continue;

        runtimeRepo.upsert(id, agentId, {
            uiState: 'speaking',
            lastSpokenAt: new Date().toISOString(),
        });

        const responseText = await generateAgentResponse(agent, text);
        const agentMsg = transcriptRepo.add({
            meetingId: id,
            speakerType: 'agent',
            speakerId: agentId,
            speakerName: `${agent.name} (${agent.title})`,
            text: responseText,
            timestamp: new Date().toISOString(),
        });
        newMessages.push(agentMsg);

        // After speaking, revert to idle
        runtimeRepo.upsert(id, agentId, { uiState: 'idle' });
    }

    const runtimeStates = runtimeRepo.findByMeeting(id);
    return NextResponse.json({ data: { messages: newMessages, runtimeStates } });
}
