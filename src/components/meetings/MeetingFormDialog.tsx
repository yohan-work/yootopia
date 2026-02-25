'use client';

import { useState } from 'react';
import { Agent, Meeting, MeetingMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MEETING_MODE_LABELS } from '@/constants/ui-text';
import { X } from 'lucide-react';

interface MeetingFormDialogProps {
    open: boolean;
    agents: Agent[];
    onClose: () => void;
    onSave: (data: Partial<Meeting>) => Promise<void>;
}

export function MeetingFormDialog({ open, agents, onClose, onSave }: MeetingFormDialogProps) {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const localDt = (d: Date) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;

    const startDefault = localDt(now);
    const endDefault = localDt(new Date(now.getTime() + 60 * 60 * 1000));

    const [form, setForm] = useState({
        title: '',
        description: '',
        mode: 'free' as MeetingMode,
        startAt: startDefault,
        endAt: endDefault,
        participantAgentIds: [] as string[],
    });
    const [loading, setLoading] = useState(false);

    const toggleParticipant = (id: string) => {
        setForm((f) => ({
            ...f,
            participantAgentIds: f.participantAgentIds.includes(id)
                ? f.participantAgentIds.filter((x) => x !== id)
                : [...f.participantAgentIds, id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave({
                ...form,
                startAt: new Date(form.startAt).toISOString(),
                endAt: new Date(form.endAt).toISOString(),
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const field = (key: keyof typeof form, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent
                style={{
                    background: 'rgba(15, 8, 36, 0.97)',
                    border: '1px solid var(--surface-border)',
                    backdropFilter: 'blur(20px)',
                    maxWidth: 540,
                }}
            >
                <DialogHeader>
                    <DialogTitle style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        일정 추가
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 0' }}>
                        {/* Title */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>회의 제목 *</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => field('title', e.target.value)}
                                placeholder="회의 제목을 입력하세요"
                                required
                                style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>컨텍스트</Label>
                            <Textarea
                                value={form.description}
                                onChange={(e) => field('description', e.target.value)}
                                placeholder="상세 내용 (참인하는 내용...)"
                                rows={2}
                                style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', resize: 'vertical' }}
                            />
                        </div>

                        {/* Date/Time */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>시작 날짜 *</Label>
                                <Input
                                    type="date"
                                    value={form.startAt.split('T')[0]}
                                    onChange={(e) => field('startAt', `${e.target.value}T${form.startAt.split('T')[1]}`)}
                                    required
                                    style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>시작 시간 *</Label>
                                <Input
                                    type="time"
                                    value={form.startAt.split('T')[1]}
                                    onChange={(e) => field('startAt', `${form.startAt.split('T')[0]}T${e.target.value}`)}
                                    required
                                    style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>종료 날짜 *</Label>
                                <Input
                                    type="date"
                                    value={form.endAt.split('T')[0]}
                                    onChange={(e) => field('endAt', `${e.target.value}T${form.endAt.split('T')[1]}`)}
                                    required
                                    style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>종료 시간 *</Label>
                                <Input
                                    type="time"
                                    value={form.endAt.split('T')[1]}
                                    onChange={(e) => field('endAt', `${form.endAt.split('T')[0]}T${e.target.value}`)}
                                    required
                                    style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                        </div>

                        {/* Mode toggle */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>회의 모드</Label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                {Object.entries(MEETING_MODE_LABELS).map(([k, v]) => (
                                    <button
                                        key={k}
                                        type="button"
                                        onClick={() => field('mode', k)}
                                        style={{
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            border: form.mode === k
                                                ? '1px solid var(--accent-purple)'
                                                : '1px solid var(--surface-border)',
                                            background: form.mode === k ? 'rgba(124,58,237,0.2)' : 'var(--surface-1)',
                                            color: form.mode === k ? 'var(--accent-purple-light)' : 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 참석자 선택 */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                참석 에이전트 ({form.participantAgentIds.length}명 선택됨)
                            </Label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                {agents.map((agent) => {
                                    const selected = form.participantAgentIds.includes(agent.id);
                                    return (
                                        <button
                                            key={agent.id}
                                            type="button"
                                            onClick={() => toggleParticipant(agent.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                border: selected ? `1px solid ${agent.avatarColor}` : '1px solid var(--surface-border)',
                                                background: selected ? `${agent.avatarColor}20` : 'var(--surface-1)',
                                                color: selected ? agent.avatarColor : 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: '50%',
                                                    background: agent.avatarColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '10px',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {agent.name[0]}
                                            </span>
                                            {agent.name}
                                            {selected && <X size={10} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <DialogFooter style={{ marginTop: '20px' }}>
                        <Button type="button" variant="ghost" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || form.participantAgentIds.length === 0}
                            style={{ background: 'var(--accent-purple)', color: 'white' }}
                        >
                            {loading ? '생성 중...' : '회의 생성'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
