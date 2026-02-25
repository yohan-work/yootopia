import { NextRequest, NextResponse } from 'next/server';
import { meetingRepo, runtimeRepo, transcriptRepo } from '@/lib/mock-db';

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const meeting = meetingRepo.findById(id);
    if (!meeting) return NextResponse.json({ error: '회의를 찾을 수 없습니다.' }, { status: 404 });

    const updated = meetingRepo.update(id, { status: 'live' });

    // Initialize runtime states for all participants
    runtimeRepo.initForMeeting(id, meeting.participantAgentIds);

    // Add system message
    transcriptRepo.add({
        meetingId: id,
        speakerType: 'system',
        speakerName: '시스템',
        text: `회의 "${meeting.title}"이 시작되었습니다.`,
        timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ data: updated });
}
