import { NextRequest, NextResponse } from 'next/server';
import { meetingRepo, runtimeRepo, transcriptRepo } from '@/lib/mock-db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const meeting = meetingRepo.findById(id);
    if (!meeting) return NextResponse.json({ error: '회의를 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ data: meeting });
}

export async function PATCH(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const body = await req.json();
    const meeting = meetingRepo.update(id, body);
    if (!meeting) return NextResponse.json({ error: '회의를 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ data: meeting });
}
