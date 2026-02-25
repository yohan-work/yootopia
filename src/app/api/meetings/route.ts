import { NextRequest, NextResponse } from 'next/server';
import { meetingRepo } from '@/lib/mock-db';
import { Meeting } from '@/types';

export async function GET() {
    return NextResponse.json({ data: meetingRepo.findAll() });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { title, description, mode, startAt, endAt, participantAgentIds } = body;

    if (!title || !mode || !startAt || !endAt) {
        return NextResponse.json({ error: 'title, mode, startAt, endAt은 필수입니다.' }, { status: 400 });
    }

    const meeting = meetingRepo.create({
        title,
        description,
        mode,
        startAt,
        endAt,
        status: 'scheduled',
        participantAgentIds: participantAgentIds ?? [],
    } as Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>);

    return NextResponse.json({ data: meeting }, { status: 201 });
}
