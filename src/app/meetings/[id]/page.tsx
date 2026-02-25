'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Meeting, Agent, TranscriptMessage, AgentRuntimeState } from '@/types';
import { AgentSeatCard } from '@/components/meeting-room/AgentSeatCard';
import { TranscriptPanel } from '@/components/meeting-room/TranscriptPanel';
import { ChatInputBox } from '@/components/meeting-room/ChatInputBox';
import { Button } from '@/components/ui/button';
import { MEETING_STATUS_LABELS, MEETING_MODE_LABELS } from '@/constants/ui-text';
import { Play, Square, FileText, ArrowLeft } from 'lucide-react';

interface MeetingRoomPageProps {
    params: Promise<{ id: string }>;
}

export default function MeetingRoomPage({ params }: MeetingRoomPageProps) {
    const { id } = use(params);
    const router = useRouter();

    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);
    const [runtimeStates, setRuntimeStates] = useState<AgentRuntimeState[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        const [mRes, aRes, tRes, rRes] = await Promise.all([
            fetch(`/api/meetings/${id}`),
            fetch('/api/agents'),
            fetch(`/api/meetings/${id}/transcripts`),
            fetch(`/api/meetings/${id}/runtime-states`),
        ]);
        const [mJson, aJson, tJson, rJson] = await Promise.all([
            mRes.json(), aRes.json(), tRes.json(), rRes.json(),
        ]);
        setMeeting(mJson.data);
        setAgents(aJson.data);
        setTranscripts(tJson.data);
        setRuntimeStates(rJson.data);
        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, [id]);

    const participants = meeting
        ? meeting.participantAgentIds
            .map((aid) => agents.find((a) => a.id === aid))
            .filter(Boolean) as Agent[]
        : [];

    const getRuntimeState = (agentId: string) =>
        runtimeStates.find((r) => r.agentId === agentId);

    const handleStart = async () => {
        await fetch(`/api/meetings/${id}/start`, { method: 'POST' });
        fetchAll();
    };

    const handleEnd = async () => {
        await fetch(`/api/meetings/${id}/end`, { method: 'POST' });
        fetchAll();
    };

    const handleUserMessage = async (text: string) => {
        const res = await fetch(`/api/meetings/${id}/user-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const json = await res.json();
        if (json.data) {
            setTranscripts((prev) => [...prev, ...json.data.messages]);
            setRuntimeStates(json.data.runtimeStates);
        }
    };

    const handleAgentSpeak = async (agentId: string) => {
        const res = await fetch(`/api/meetings/${id}/agent-speak`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agentId, promptHint: '지목 발언 요청' }),
        });
        const json = await res.json();
        if (json.data) {
            setTranscripts((prev) => [...prev, json.data.message]);
            setRuntimeStates(json.data.runtimeStates);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>
                회의실 로딩 중...
            </div>
        );
    }

    if (!meeting) {
        return (
            <div style={{ padding: '32px', color: 'var(--text-muted)' }}>
                회의를 찾을 수 없습니다.
            </div>
        );
    }

    const isLive = meeting.status === 'live';
    const isEnded = meeting.status === 'ended';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* High Quality Zootopia Office Background */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'url("https://image.pollinations.ai/prompt/zootopia%20style%20modern%20startup%20office%20background,%20sunny%20day,%20large%20windows,%20cityscape,%20cinematic%20lighting,%20hyper%20detailed,%20pixar%20disney%20style?width=1920&height=1080&nologo=true")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: -2,
            }} />

            {/* Subtle dark overlay for better UI contrast */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.65)',
                zIndex: -1,
            }} />

            {/* Header - Glassmorphism */}
            <div
                style={{
                    padding: '14px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(20, 20, 30, 0.4)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexShrink: 0,
                    zIndex: 10,
                }}
            >
                <button
                    onClick={() => router.push('/meetings')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', padding: 4 }}
                >
                    <ArrowLeft size={18} />
                </button>

                <div style={{ flex: 1, color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px' }}>{meeting.title}</span>
                        <span
                            className={`status-badge status-${meeting.status}`}
                            style={{ fontSize: '10px' }}
                        >
                            {MEETING_STATUS_LABELS[meeting.status]}
                        </span>
                        <span
                            style={{
                                fontSize: '10px',
                                color: 'rgba(255,255,255,0.7)',
                                background: 'rgba(255,255,255,0.1)',
                                padding: '1px 7px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {MEETING_MODE_LABELS[meeting.mode]}
                        </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                        참석자 {participants.length}명
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {meeting.status === 'scheduled' && (
                        <Button
                            onClick={handleStart}
                            style={{ background: 'var(--status-working)', color: 'white', gap: '5px', fontSize: '13px', border: 'none' }}
                        >
                            <Play size={13} />
                            회의 시작
                        </Button>
                    )}
                    {isLive && (
                        <Button
                            onClick={handleEnd}
                            style={{ background: 'var(--status-live)', color: 'white', gap: '5px', fontSize: '13px', border: 'none' }}
                        >
                            <Square size={13} />
                            회의 종료
                        </Button>
                    )}
                    {isEnded && (
                        <Button
                            onClick={() => router.push(`/meetings/${id}/summary`)}
                            style={{ background: 'var(--accent-purple)', color: 'white', gap: '5px', fontSize: '13px', border: 'none' }}
                        >
                            <FileText size={13} />
                            요약 보기
                        </Button>
                    )}
                </div>
            </div>

            {/* Main content: Grid + Right Panel */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', padding: '16px', gap: '16px' }}>

                {/* Center: Video Grid (Zoom style) */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflowY: 'auto',
                    }}
                >
                    {!isLive && !isEnded && (
                        <div style={{
                            marginBottom: '20px',
                            padding: '12px 24px',
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '30px',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 500,
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            우측 상단의 "회의 시작" 버튼을 눌러 회의를 시작하세요
                        </div>
                    )}

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
                            gap: '16px',
                            width: '100%',
                            maxWidth: '1200px',
                            padding: '16px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {participants.map((agent) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, type: 'spring' }}
                                style={{ display: 'flex', justifyContent: 'center' }}
                            >
                                <AgentSeatCard
                                    agent={agent}
                                    runtimeState={getRuntimeState(agent.id)}
                                    onSpeak={handleAgentSpeak}
                                    meetingLive={isLive}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Floating Transcript + Chat Panel (Glassmorphism) */}
                <div style={{
                    width: 360,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'rgba(20, 20, 30, 0.5)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    {meeting.description && (
                        <div style={{
                            padding: '16px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px', fontWeight: 600 }}>
                                회의 맥락
                            </div>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
                                {meeting.description}
                            </p>
                        </div>
                    )}

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <TranscriptPanel messages={transcripts} />
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
                        <ChatInputBox
                            onSend={handleUserMessage}
                            disabled={!isLive}
                            placeholder="회의에서 발언하세요..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
