'use client';

import { Agent } from '@/types';
import { AGENT_ROLE_LABELS, AGENT_STATUS_LABELS } from '@/constants/ui-text';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface AgentCardProps {
    agent: Agent;
    onEdit: (agent: Agent) => void;
    onDelete: (id: string) => void;
}

export function AgentCard({ agent, onEdit, onDelete }: AgentCardProps) {
    const statusClass = `status-${agent.status}`;

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
                }}
            >
                {agent.name[0]}
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
