'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Meeting, Agent, MeetingSummary, TranscriptMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Sparkles, CheckCircle2, Circle } from 'lucide-react';

interface SummaryPageProps {
    params: Promise<{ id: string }>;
}

export default function MeetingSummaryPage({ params }: SummaryPageProps) {
    const { id } = use(params);
    const router = useRouter();

    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [summary, setSummary] = useState<MeetingSummary | null>(null);
    const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchData = async () => {
        const [mRes, aRes, tRes] = await Promise.all([
            fetch(`/api/meetings/${id}`),
            fetch('/api/agents'),
            fetch(`/api/meetings/${id}/transcripts`),
        ]);
        const [mJson, aJson, tJson] = await Promise.all([
            mRes.json(), aRes.json(), tRes.json(),
        ]);
        setMeeting(mJson.data);
        setAgents(aJson.data);
        setTranscripts(tJson.data);

        // Try fetching existing summary
        const sRes = await fetch(`/api/meetings/${id}/summary`);
        if (sRes.ok) {
            const sJson = await sRes.json();
            setSummary(sJson.data);
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleGenerate = async () => {
        setGenerating(true);
        const res = await fetch(`/api/meetings/${id}/summary`, { method: 'POST' });
        const json = await res.json();
        setSummary(json.data);
        setGenerating(false);
    };

    const agentMsgCount = transcripts.filter((t) => t.speakerType === 'agent').length;
    const userMsgCount = transcripts.filter((t) => t.speakerType === 'user').length;

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--text-muted)' }}>
                로딩 중...
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => router.push(`/meetings/${id}`)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="page-header-title">
                            <span className="page-header-emoji">📝</span>회의 요약
                        </h2>
                        {meeting && (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                {meeting.title}
                            </p>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    style={{ background: 'var(--accent-purple)', color: 'white', gap: '6px', fontSize: '13px' }}
                >
                    <Sparkles size={14} />
                    {generating ? '요약 생성 중...' : summary ? '요약 재생성' : '요약 생성'}
                </Button>
            </div>

            <div className="page-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: 900 }}>
                    {/* Left column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Stats */}
                        <div className="glass-card" style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                                회의 통계
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { label: '총 발언', value: transcripts.filter(t => t.speakerType !== 'system').length },
                                    { label: '사용자 발언', value: userMsgCount },
                                    { label: '에이전트 응답', value: agentMsgCount },
                                    { label: '참석자', value: meeting?.participantAgentIds.length ?? 0 },
                                ].map((s) => (
                                    <div key={s.label} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-purple-light)' }}>{s.value}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Key topics */}
                        {summary && (
                            <div className="glass-card" style={{ padding: '16px 20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                                    핵심 논의사항
                                </div>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {summary.keyTopics.map((t, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--accent-purple-light)', flexShrink: 0 }}>•</span>
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Decisions */}
                        {summary && (
                            <div className="glass-card" style={{ padding: '16px 20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                                    결정사항
                                </div>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {summary.decisions.map((d, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <CheckCircle2 size={14} style={{ color: 'var(--status-working)', flexShrink: 0, marginTop: '2px' }} />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Action items */}
                        {summary && (
                            <div className="glass-card" style={{ padding: '16px 20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                                    액션 아이템
                                </div>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {summary.actionItems.map((item) => (
                                        <li key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                            <Circle size={14} style={{ color: 'var(--status-idle)', flexShrink: 0, marginTop: '2px' }} />
                                            <div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{item.text}</div>
                                                {item.assignee && (
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                        담당: {item.assignee}
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Review items */}
                        {summary && (
                            <div className="glass-card" style={{ padding: '16px 20px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                                    추가 검토 필요
                                </div>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {summary.reviewItems.map((r, i) => (
                                        <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            <span style={{ color: 'var(--status-hand-raised)', flexShrink: 0 }}>!</span>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {!summary && !generating && (
                            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                                <Sparkles size={32} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
                                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                                    "요약 생성" 버튼을 눌러 회의 결과를 정리하세요
                                </p>
                            </div>
                        )}

                        {generating && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} style={{ height: 60, borderRadius: 'var(--radius-lg)', background: 'var(--surface-2)' }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
