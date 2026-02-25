import { NextRequest, NextResponse } from 'next/server';
import { runtimeRepo } from '@/lib/mock-db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const states = runtimeRepo.findByMeeting(id);
    return NextResponse.json({ data: states });
}
