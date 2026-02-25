import { NextRequest, NextResponse } from 'next/server';
import { agentRepo } from '@/lib/mock-db';
import { Agent } from '@/types';

export async function GET() {
    return NextResponse.json({ data: agentRepo.findAll() });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, role, title, specialty, personalityTone, responseStyle, avatarColor, status, systemPrompt } = body;

    if (!name || !role || !title) {
        return NextResponse.json({ error: 'name, role, title은 필수입니다.' }, { status: 400 });
    }

    const agent = agentRepo.create({
        name,
        role,
        title,
        specialty: specialty ?? '',
        personalityTone: personalityTone ?? 'friendly',
        responseStyle: responseStyle ?? 'brief',
        avatarColor: avatarColor ?? '#6366f1',
        status: status ?? 'idle',
        systemPrompt: systemPrompt ?? '',
    } as Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>);

    return NextResponse.json({ data: agent }, { status: 201 });
}
