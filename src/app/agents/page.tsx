'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '@/types';
import { AgentCard } from '@/components/agents/AgentCard';
import { AgentFormDialog } from '@/components/agents/AgentFormDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Users } from 'lucide-react';

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

    const fetchAgents = async () => {
        const res = await fetch('/api/agents');
        const json = await res.json();
        setAgents(json.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleCreate = async (data: Partial<Agent>) => {
        await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        await fetchAgents();
    };

    const handleUpdate = async (data: Partial<Agent>) => {
        if (!editingAgent) return;
        await fetch(`/api/agents/${editingAgent.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        await fetchAgents();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/agents/${id}`, { method: 'DELETE' });
        await fetchAgents();
    };

    const openCreate = () => {
        setEditingAgent(null);
        setDialogOpen(true);
    };

    const openEdit = (agent: Agent) => {
        setEditingAgent(agent);
        setDialogOpen(true);
    };

    const workingCount = agents.filter((a) => a.status === 'working').length;

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-header-title">
                        <span className="page-header-emoji">👥</span>직원 관리
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                        고용된 직원의 프로필과 설정을 관리합니다
                    </p>
                </div>
                <Button
                    onClick={openCreate}
                    style={{
                        background: 'var(--accent-purple)',
                        color: 'white',
                        gap: '6px',
                        fontSize: '13px',
                    }}
                >
                    <Plus size={15} />
                    직원 추가
                </Button>
            </div>

            {/* Content */}
            <div className="page-content">
                {/* Stats */}
                <div
                    style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px',
                        flexWrap: 'wrap',
                    }}
                >
                    {[
                        { label: '전체', value: agents.length, color: 'var(--accent-purple-light)' },
                        { label: 'Working', value: workingCount, color: 'var(--status-working)' },
                        { label: 'Idle', value: agents.filter((a) => a.status === 'idle').length, color: 'var(--status-idle)' },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="glass-card"
                            style={{ padding: '12px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}
                        >
                            <span style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.value}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Agent List */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} style={{ height: 76, borderRadius: 'var(--radius-lg)', background: 'var(--surface-2)' }} />
                        ))}
                    </div>
                ) : agents.length === 0 ? (
                    <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                        <Users size={40} style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                            아직 직원이 없습니다. 직원을 추가해 보세요.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <AnimatePresence>
                            {agents.map((agent) => (
                                <motion.div
                                    key={agent.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <AgentCard
                                        agent={agent}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Dialog */}
            <AgentFormDialog
                open={dialogOpen}
                agent={editingAgent}
                onClose={() => setDialogOpen(false)}
                onSave={editingAgent ? handleUpdate : handleCreate}
            />
        </div>
    );
}
