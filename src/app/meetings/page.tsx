'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meeting, Agent } from '@/types';
import { MeetingCard } from '@/components/meetings/MeetingCard';
import { MeetingFormDialog } from '@/components/meetings/MeetingFormDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, CalendarDays } from 'lucide-react';

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'ended'>('all');

    const fetchData = async () => {
        const [mRes, aRes] = await Promise.all([
            fetch('/api/meetings'),
            fetch('/api/agents'),
        ]);
        const [mJson, aJson] = await Promise.all([mRes.json(), aRes.json()]);
        setMeetings(mJson.data);
        setAgents(aJson.data);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (data: Partial<Meeting>) => {
        await fetch('/api/meetings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        await fetchData();
    };

    const filtered = filter === 'all' ? meetings : meetings.filter((m) => m.status === filter);

    const counts = {
        all: meetings.length,
        scheduled: meetings.filter((m) => m.status === 'scheduled').length,
        live: meetings.filter((m) => m.status === 'live').length,
        ended: meetings.filter((m) => m.status === 'ended').length,
    };

    const tabs = [
        { key: 'all', label: '전체' },
        { key: 'scheduled', label: '예정' },
        { key: 'live', label: '진행중' },
        { key: 'ended', label: '종료' },
    ] as const;

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-header-title">
                        사내 캘린더
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                        회의 일정을 관리하고 AI 에이전트를 초대하세요
                    </p>
                </div>
                <Button
                    onClick={() => setDialogOpen(true)}
                    style={{ background: 'var(--accent-purple)', color: 'white', gap: '6px', fontSize: '13px' }}
                >
                    <Plus size={15} />
                    일정 추가
                </Button>
            </div>

            {/* Content */}
            <div className="page-content">
                {/* Filter tabs */}
                <div
                    style={{
                        display: 'flex',
                        gap: '4px',
                        marginBottom: '20px',
                        background: 'var(--surface-1)',
                        padding: '4px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--surface-border)',
                        width: 'fit-content',
                    }}
                >
                    {tabs.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            style={{
                                padding: '5px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'all 0.15s',
                                background: filter === key ? 'rgba(124,58,237,0.25)' : 'transparent',
                                color: filter === key ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                            }}
                        >
                            {label}
                            {counts[key] > 0 && (
                                <span
                                    style={{
                                        marginLeft: '5px',
                                        fontSize: '10px',
                                        background: filter === key ? 'var(--accent-purple)' : 'var(--surface-3)',
                                        color: 'white',
                                        padding: '1px 5px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    {counts[key]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} style={{ height: 120, borderRadius: 'var(--radius-lg)', background: 'var(--surface-2)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                        <CalendarDays size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                            {filter === 'all' ? '아직 회의가 없습니다.' : `${tabs.find(t => t.key === filter)?.label} 상태의 회의가 없습니다.`}
                        </p>
                        {filter === 'all' && (
                            <Button
                                onClick={() => setDialogOpen(true)}
                                style={{ background: 'var(--accent-purple)', color: 'white', fontSize: '13px' }}
                            >
                                <Plus size={14} style={{ marginRight: '4px' }} />
                                첫 회의 생성하기
                            </Button>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((meeting) => (
                                <motion.div
                                    key={meeting.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <MeetingCard meeting={meeting} agents={agents} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <MeetingFormDialog
                open={dialogOpen}
                agents={agents}
                onClose={() => setDialogOpen(false)}
                onSave={handleCreate}
            />
        </div>
    );
}
