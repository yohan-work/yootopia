'use client';

import { useState, useEffect } from 'react';
import { Agent, AgentRuntimeState, AgentUiState } from '@/types';
import { AGENT_UI_STATE_LABELS, AGENT_ROLE_LABELS } from '@/constants/ui-text';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Hand, Lightbulb } from 'lucide-react';
import Image from 'next/image';

interface AgentSeatCardProps {
    agent: Agent;
    runtimeState?: AgentRuntimeState;
    onSpeak: (agentId: string) => void;
    meetingLive: boolean;
}

const STATE_COLORS: Record<AgentUiState, string> = {
    idle: 'var(--text-muted)',
    thinking: '#8b5cf6', // purple
    speaking: '#3b82f6', // blue
    hand_raised: '#f97316', // orange
};

// Generates a robust, consistent image URL using pollinations.ai
const getAvatarImageUrl = (role: string, name: string) => {
    // We add a distinct seed using the name to ensure the same agent always gets the exact same image
    const seed = name.length * 1024 + name.charCodeAt(0);
    const basePrompt = "zootopia style anthropomorphic 3d animation character, pixar disney style, hyper realistic, cinematic lighting, modern office background";

    let specificPrompt = "";
    switch (role) {
        case 'lawyer':
            specificPrompt = "a serious calm cat wearing a sharp lawyer suit and tie";
            break;
        case 'accountant':
            specificPrompt = "a smart pig wearing a formal business suit and glasses";
            break;
        case 'designer':
            specificPrompt = "a trendy cool duck wearing stylish designer clothes and a scarf";
            break;
        case 'announcer':
            specificPrompt = "an elegant fox wearing a formal news anchor suit";
            break;
        default:
            specificPrompt = "a professional animal wearing business casual clothes";
            break;
    }

    const fullPrompt = `${specificPrompt}, ${basePrompt}`;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=400&height=400&seed=${seed}&nologo=true`;
};

export function AgentSeatCard({ agent, runtimeState, onSpeak, meetingLive }: AgentSeatCardProps) {
    const uiState: AgentUiState = runtimeState?.uiState ?? 'idle';
    const stateColor = STATE_COLORS[uiState];
    const isSpeaking = uiState === 'speaking';

    // Auto-generate avatar image URL
    const imageUrl = getAvatarImageUrl(agent.role, agent.name);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/11', // Video feed aspect ratio
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'var(--surface-2)',
            boxShadow: isSpeaking
                ? `0 0 0 3px ${stateColor}, 0 8px 32px ${stateColor}80`
                : '0 4px 24px rgba(0,0,0,0.4)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isSpeaking ? 'translateY(-4px)' : 'none',
        }}>
            {/* Main Avatar Image (2D Video Feed) */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                transform: isSpeaking ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 2s ease-out',
                background: agent.avatarColor, // Fallback background color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Image
                    src={imageUrl}
                    alt={agent.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized // required for external pollinations.ai URLs without configuring next.config.js
                    onError={(e) => {
                        // If generation service is down (e.g. 530 Cloudflare error), hide the image tag 
                        // so the colored background + initials show instead.
                        e.currentTarget.style.display = 'none';
                    }}
                />

                {/* Fallback Text if Image Fails to Load */}
                <div style={{
                    fontSize: '64px',
                    fontWeight: 800,
                    color: 'white',
                    opacity: 0.5,
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                    {agent.name.charAt(0).toUpperCase()}
                </div>
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                pointerEvents: 'none',
            }} />

            {/* Top Left: Role Badge & State Icons */}
            <div style={{
                position: 'absolute',
                top: '12px', left: '12px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
            }}>
                <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}>
                    {AGENT_ROLE_LABELS[agent.role] ?? agent.title}
                </div>

                {/* State Indicator Floating Badges */}
                {uiState === 'thinking' && (
                    <div style={{
                        padding: '6px',
                        borderRadius: '50%',
                        background: 'rgba(139,92,246,0.9)',
                        color: 'white',
                        boxShadow: '0 0 12px rgba(139,92,246,0.6)',
                        animation: 'pulse 2s infinite',
                    }}>
                        <Lightbulb size={14} />
                    </div>
                )}
                {uiState === 'hand_raised' && (
                    <div style={{
                        padding: '6px',
                        borderRadius: '50%',
                        background: 'rgba(249,115,22,0.9)',
                        color: 'white',
                        boxShadow: '0 0 12px rgba(249,115,22,0.6)',
                        animation: 'bounce 1s infinite',
                    }}>
                        <Hand size={14} />
                    </div>
                )}
            </div>

            {/* Bottom Section: Name & Controls */}
            <div style={{
                position: 'absolute',
                bottom: '12px', left: '12px', right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
            }}>
                {/* Name and Audio Wave wrapper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSpeaking ? 'var(--status-speaking)' : 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        color: 'white',
                    }}>
                        {isSpeaking ? <Mic size={12} className="animate-pulse" /> : <MicOff size={12} opacity={0.5} />}
                    </div>

                    <div style={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '14px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    }}>
                        {agent.name}
                    </div>

                    {/* Simple CSS audio bars when speaking */}
                    {isSpeaking && (
                        <div style={{ display: 'flex', gap: '2px', height: '12px', alignItems: 'center', marginLeft: '4px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{
                                    width: '3px',
                                    background: 'var(--status-speaking)',
                                    borderRadius: '2px',
                                    animation: `audioWave 1s infinite ease-in-out alternate`,
                                    animationDelay: `${i * 0.15}s`,
                                    height: '100%',
                                }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Director Control: "Ask to Speak" Button */}
                {meetingLive && !isSpeaking && (
                    <Button
                        size="sm"
                        onClick={() => onSpeak(agent.id)}
                        style={{
                            height: '28px',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            fontSize: '12px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        지목하기
                    </Button>
                )}
            </div>

            {/* Global Keyframes embedded cleanly for the animations */}
            <style jsx>{`
                @keyframes audioWave {
                    0% { height: 20%; opacity: 0.5; }
                    100% { height: 100%; opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
