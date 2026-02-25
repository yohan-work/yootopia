'use client';

import { useState, useEffect } from 'react';
import { Agent, AgentRuntimeState, AgentUiState } from '@/types';
import { AGENT_UI_STATE_LABELS, AGENT_ROLE_LABELS } from '@/constants/ui-text';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Hand, Lightbulb, Cat, Bird, Bug, User, PawPrint } from 'lucide-react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

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
    const seed = name.length * 1024 + name.charCodeAt(0);
    const lowerRole = role.toLowerCase();

    if (name === 'Qui' || lowerRole === 'lawyer') {
        return '/avatars/qui.png';
    } else if (name === 'Done' || lowerRole === 'accountant') {
        return 'https://image.pollinations.ai/prompt/a%20smart%20pink%20pig%20accountant%20wearing%20glasses,%20Zootopia%20Pixar%203D%20style,%20high%20quality?width=600&height=400&nologo=true';
    } else if (name === 'Cal' || lowerRole === 'designer') {
        return 'https://image.pollinations.ai/prompt/a%20vibrant%20green%20chameleon%20designer,%20Zootopia%20Pixar%203D%20style,%20high%20quality?width=600&height=400&nologo=true';
    } else if (name === 'Sian' || lowerRole === 'announcer') {
        return 'https://image.pollinations.ai/prompt/a%20professional%20orange%20fox%20news%20anchor,%20Zootopia%20Pixar%203D%20style,%20high%20quality?width=600&height=400&nologo=true';
    }

    const basePrompt = "Zootopia Pixar 3D animation style, anthropomorphic character, professional video call frame, high quality";
    const specificPrompt = "professional animal in a business suit";
    const fullPrompt = `${specificPrompt}, ${basePrompt}`;
    // Using manual replacement for spaces to keep commas as is, matching the background image URL style
    const encodedPrompt = fullPrompt.replace(/ /g, '%20');
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=400&seed=${seed}&nologo=true`;
};

const getRoleIcon = (role: string, name: string): LucideIcon => {
    const lowerRole = role.toLowerCase();
    if (name === 'Qui' || lowerRole === 'lawyer') return Cat;
    if (name === 'Done' || lowerRole === 'accountant') return PawPrint;
    if (name === 'Cal' || lowerRole === 'designer') return Bug;
    if (name === 'Sian' || lowerRole === 'announcer') return Bird;
    return User;
};

export function AgentSeatCard({ agent, runtimeState, onSpeak, meetingLive }: AgentSeatCardProps) {
    const uiState: AgentUiState = runtimeState?.uiState ?? 'idle';
    const stateColor = STATE_COLORS[uiState];
    const isSpeaking = uiState === 'speaking';

    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

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
                {!imageError && (
                    <div className={uiState === 'speaking' ? 'animate-avatar-speaking' : 'animate-avatar-idle'} style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%'
                    }}>
                        <Image
                            src={imageUrl}
                            alt={agent.name}
                            fill
                            style={{
                                objectFit: 'cover',
                                zIndex: 2,
                                opacity: imageLoaded ? 1 : 0,
                                transition: 'opacity 0.5s ease-in-out'
                            }}
                            unoptimized
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    </div>
                )}
                {/* Fallback UI if Image Fails to Load or is Loading */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    zIndex: 1,
                    position: 'relative'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        opacity: imageLoaded ? 0 : 0.9,
                        transition: 'opacity 0.3s',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {(() => {
                            const RoleIcon = getRoleIcon(agent.role, agent.name);
                            return <RoleIcon size={40} strokeWidth={1.5} />;
                        })()}
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'white',
                        opacity: imageLoaded ? 0 : 0.8,
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        transition: 'opacity 0.3s'
                    }}>
                        {agent.name}
                    </div>
                </div>
            </div>

            {/* Solid Dark Overlay for Text Readability instead of Gradient */}
            <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '40%',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
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
