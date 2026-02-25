import { NextRequest, NextResponse } from 'next/server';
import { agentRepo } from '@/lib/mock-db';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const body = await req.json();
    const agent = agentRepo.update(id, body);
    if (!agent) return NextResponse.json({ error: '에이전트를 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ data: agent });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const success = agentRepo.delete(id);
    if (!success) return NextResponse.json({ error: '에이전트를 찾을 수 없습니다.' }, { status: 404 });
    return NextResponse.json({ data: { deleted: true } });
}
