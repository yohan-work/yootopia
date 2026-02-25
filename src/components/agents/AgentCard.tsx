'use client';

import { useState } from 'react';
import { Agent } from '@/types';
import { AGENT_ROLE_LABELS, AGENT_STATUS_LABELS } from '@/constants/ui-text';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Cat, Bird, Bug, User, PawPrint } from 'lucide-react';
import Image from 'next/image';

const getAvatarImageUrl = (role: string, name: string) => {
    const seed = name.length * 1024 + name.charCodeAt(0);
    const lowerRole = role.toLowerCase();

    if (name === 'Qui' || lowerRole === 'lawyer') {
        return '/avatars/qui.png';
    } else if (name === 'Done' || lowerRole === 'accountant') {
        return 'https://image.pollinations.ai/prompt/a%20smart%20pink%20pig%20accountant%20wearing%20glasses,%20Zootopia%20Pixar%203D%20style,%20high%20quality?width=100&height=100&nologo=true';
    } else if (name === 'Cal' || lowerRole === 'designer') {
        return 'https://image.pollinations.ai/prompt/a%20vibrant%20green%20chameleon%20designer,%20Zootopia%20Pixar%203D%20style,%20high%20quality?width=100&height=100&nologo=true';
    } else if (name === 'Sian' || lowerRole === 'announcer') {
        return 'https://image.pollinations.ai/prompt/a%20professional%20orange%20fox%20news%20anchor,%20Zootopia%20Pixar%203D%20style,%20high%20quality?width=100&height=100&nologo=true';
    }

    const basePrompt = "Zootopia Pixar 3D animation style, anthropomorphic character, soft lighting, neutral background, high quality";
    const specificPrompt = "professional anthropomorphic animal";
    const fullPrompt = `${specificPrompt}, ${basePrompt}`;
    const encodedPrompt = fullPrompt.replace(/ /g, '%20');
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=100&height=100&seed=${seed}&nologo=true`;
};

interface AgentCardProps {
    agent: Agent;
    onEdit: (agent: Agent) => void;
    onDelete: (id: string) => void;
}

export function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
    const statusClass = `status-${agent.status}`;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className="glass-card"
            style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'default',
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: agent.avatarColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: `0 0 0 2px ${agent.avatarColor}40`,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {!imageError && (
                    <Image
                        src={getAvatarImageUrl(agent.role, agent.name)}
                        alt={agent.name}
                        fill
                        style={{
                            objectFit: 'cover',
                            zIndex: 2,
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.3s'
                        }}
                        unoptimized
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                )}
                <span style={{ position: 'relative', zIndex: 1, opacity: imageLoaded ? 0 : 0.7 }}>
                    {(() => {
                        const lowerRole = agent.role.toLowerCase();
                        if (agent.name === 'Qui' || lowerRole === 'lawyer') return <Cat size={20} />;
                        if (agent.name === 'Done' || lowerRole === 'accountant') return <PawPrint size={20} />;
                        if (agent.name === 'Cal' || lowerRole === 'designer') return <Bug size={20} />;
                        if (agent.name === 'Sian' || lowerRole === 'announcer') return <Bird size={20} />;
                        return <User size={20} />;
                    })()}
                </span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{agent.name}</span>
                    <span
                        className="status-badge"
                        style={{
                            fontSize: '10px',
                            padding: '1px 7px',
                            background: `${agent.avatarColor}20`,
                            color: agent.avatarColor,
                        }}
                    >
                        {AGENT_ROLE_LABELS[agent.role] ?? agent.role}
                    </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                    {agent.title}
                </div>
                <div
                    style={{
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {agent.specialty}
                </div>
            </div>

            {/* Status badge */}
            <div className={`status-badge ${statusClass}`} style={{ flexShrink: 0 }}>
                {AGENT_STATUS_LABELS[agent.status]}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(agent)}
                    style={{ width: 32, height: 32, color: 'var(--text-secondary)' }}
                >
                    <Pencil size={14} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(agent.id)}
                    style={{ width: 32, height: 32, color: 'var(--status-live)' }}
                >
                    <Trash2 size={14} />
                </Button>
            </div>
        </div>
    );
}
