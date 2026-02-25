'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TranscriptMessage } from '@/types';

interface TranscriptPanelProps {
    messages: TranscriptMessage[];
}

function formatTime(iso: string) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const SPEAKER_COLORS: Record<string, string> = {
    user: '#a78bfa',
    agent: 'var(--text-primary)',
    system: 'var(--text-muted)',
};

export function TranscriptPanel({ messages }: TranscriptPanelProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div
            style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '12px 16px',
            }}
        >
            <AnimatePresence initial={false}>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: 'flex',
                            flexDirection: msg.speakerType === 'user' ? 'row-reverse' : 'row',
                            gap: '8px',
                            alignItems: 'flex-start',
                        }}
                    >
                        {msg.speakerType === 'system' ? (
                            <div
                                style={{
                                    width: '100%',
                                    textAlign: 'center',
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    padding: '4px 0',
                                }}
                            >
                                — {msg.text} —
                            </div>
                        ) : (
                            <>
                                {/* Avatar circle */}
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background:
                                            msg.speakerType === 'user'
                                                ? 'var(--accent-purple)'
                                                : 'var(--surface-3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        flexShrink: 0,
                                        color: '#fff',
                                    }}
                                >
                                    {msg.speakerName[0]}
                                </div>

                                {/* Bubble */}
                                <div style={{ maxWidth: '75%' }}>
                                    <div
                                        style={{
                                            fontSize: '10px',
                                            color: 'var(--text-muted)',
                                            marginBottom: '3px',
                                            textAlign: msg.speakerType === 'user' ? 'right' : 'left',
                                        }}
                                    >
                                        {msg.speakerName} · {formatTime(msg.timestamp)}
                                    </div>
                                    <div
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius:
                                                msg.speakerType === 'user'
                                                    ? '12px 4px 12px 12px'
                                                    : '4px 12px 12px 12px',
                                            background:
                                                msg.speakerType === 'user'
                                                    ? 'rgba(124,58,237,0.25)'
                                                    : 'var(--surface-2)',
                                            border: `1px solid ${msg.speakerType === 'user'
                                                    ? 'rgba(124,58,237,0.4)'
                                                    : 'var(--surface-border)'
                                                }`,
                                            fontSize: '13px',
                                            lineHeight: 1.5,
                                            color: SPEAKER_COLORS[msg.speakerType],
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
            <div ref={bottomRef} />
        </div>
    );
}
