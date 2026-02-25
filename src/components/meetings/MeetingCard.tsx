'use client';

import { Meeting, Agent } from '@/types';
import { MEETING_STATUS_LABELS, MEETING_MODE_LABELS } from '@/constants/ui-text';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Users, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MeetingCardProps {
    meeting: Meeting;
    agents: Agent[];
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(iso: string) {
    const d = new Date(iso);
    return `${d.getHours() >= 12 ? '오후' : '오전'} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function MeetingCard({ meeting, agents }: MeetingCardProps) {
    const router = useRouter();
    const participants = meeting.participantAgentIds
        .map((id) => agents.find((a) => a.id === id))
        .filter(Boolean) as Agent[];

    const statusClass = `status-${meeting.status}`;
    const statusLabel = MEETING_STATUS_LABELS[meeting.status];

    return (
        <div
            className="glass-card"
            style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{meeting.title}</span>
                        <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
                        <span
                            style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                background: 'var(--surface-2)',
                                padding: '1px 8px',
                                borderRadius: '20px',
                                border: '1px solid var(--surface-border)',
                            }}
                        >
                            {MEETING_MODE_LABELS[meeting.mode]}
                        </span>
                    </div>
                    {meeting.description && (
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {meeting.description}
                        </p>
                    )}
                </div>

                <Button
                    onClick={() => router.push(`/meetings/${meeting.id}`)}
                    size="sm"
                    style={{
                        background: meeting.status === 'live' ? 'var(--status-live)' : 'var(--accent-purple)',
                        color: 'white',
                        gap: '4px',
                        fontSize: '12px',
                        flexShrink: 0,
                    }}
                >
                    <Play size={12} />
                    {meeting.status === 'ended' ? '결과 보기' : meeting.status === 'live' ? '참여하기' : '회의실'}
                </Button>
            </div>

            {/* Info row */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <CalendarDays size={12} />
                    {formatDate(meeting.startAt)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Clock size={12} />
                    {formatTime(meeting.startAt)} – {formatTime(meeting.endAt)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Users size={12} />
                    {participants.length}명
                </div>
            </div>

            {/* Participants chips */}
            {participants.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {participants.map((agent) => (
                        <div
                            key={agent.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '2px 8px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                background: `${agent.avatarColor}18`,
                                border: `1px solid ${agent.avatarColor}40`,
                                color: agent.avatarColor,
                            }}
                        >
                            <span
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: '50%',
                                    background: agent.avatarColor,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '8px',
                                    color: '#fff',
                                    fontWeight: 700,
                                }}
                            >
                                {agent.name[0]}
                            </span>
                            {agent.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
