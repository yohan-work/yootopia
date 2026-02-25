import { NextRequest, NextResponse } from 'next/server';
import { transcriptRepo } from '@/lib/mock-db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    const msgs = transcriptRepo.findByMeeting(id);
    return NextResponse.json({ data: msgs });
}
