'use client';

import { useState } from 'react';
import { Agent, AgentRole, PersonalityTone, ResponseStyle } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AGENT_ROLE_LABELS,
    PERSONALITY_TONE_LABELS,
    RESPONSE_STYLE_LABELS,
    AGENT_STATUS_LABELS,
} from '@/constants/ui-text';

const AVATAR_COLORS = [
    '#6366f1', '#10b981', '#f59e0b', '#ec4899',
    '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
];

interface AgentFormDialogProps {
    open: boolean;
    agent?: Agent | null;
    onClose: () => void;
    onSave: (data: Partial<Agent>) => Promise<void>;
}

export function AgentFormDialog({ open, agent, onClose, onSave }: AgentFormDialogProps) {
    const isEdit = !!agent;

    const [form, setForm] = useState({
        name: agent?.name ?? '',
        role: (agent?.role ?? 'lawyer') as AgentRole,
        title: agent?.title ?? '',
        specialty: agent?.specialty ?? '',
        personalityTone: (agent?.personalityTone ?? 'friendly') as PersonalityTone,
        responseStyle: (agent?.responseStyle ?? 'brief') as ResponseStyle,
        avatarColor: agent?.avatarColor ?? AVATAR_COLORS[0],
        status: agent?.status ?? 'working',
        systemPrompt: agent?.systemPrompt ?? '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(form);
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
                    maxWidth: 520,
                }}
            >
                <DialogHeader>
                    <DialogTitle style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        {isEdit ? '직원 수정' : '새 직원 추가'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 0' }}>
                        {/* Name + Role */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                    이름 *
                                </Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => field('name', e.target.value)}
                                    placeholder="예: Qui"
                                    required
                                    style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                    직군 *
                                </Label>
                                <Select value={form.role} onValueChange={(v) => field('role', v)}>
                                    <SelectTrigger style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent style={{ background: 'rgba(15,8,36,0.97)', border: '1px solid var(--surface-border)' }}>
                                        {Object.entries(AGENT_ROLE_LABELS).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>직함</Label>
                            <Input
                                value={form.title}
                                onChange={(e) => field('title', e.target.value)}
                                placeholder="예: 수석 변호사"
                                style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        {/* Specialty */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>전문 분야</Label>
                            <Input
                                value={form.specialty}
                                onChange={(e) => field('specialty', e.target.value)}
                                placeholder="예: 계약법, 개인정보보호"
                                style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
                            />
                        </div>

                        {/* Personality + Response style */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>말투</Label>
                                <Select value={form.personalityTone} onValueChange={(v) => field('personalityTone', v)}>
                                    <SelectTrigger style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent style={{ background: 'rgba(15,8,36,0.97)', border: '1px solid var(--surface-border)' }}>
                                        {Object.entries(PERSONALITY_TONE_LABELS).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>응답 스타일</Label>
                                <Select value={form.responseStyle} onValueChange={(v) => field('responseStyle', v)}>
                                    <SelectTrigger style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent style={{ background: 'rgba(15,8,36,0.97)', border: '1px solid var(--surface-border)' }}>
                                        {Object.entries(RESPONSE_STYLE_LABELS).map(([k, v]) => (
                                            <SelectItem key={k} value={k}>{v}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>상태</Label>
                            <Select value={form.status} onValueChange={(v) => field('status', v)}>
                                <SelectTrigger style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent style={{ background: 'rgba(15,8,36,0.97)', border: '1px solid var(--surface-border)' }}>
                                    {Object.entries(AGENT_STATUS_LABELS).map(([k, v]) => (
                                        <SelectItem key={k} value={k}>{v}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Avatar color */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>아바타 색상</Label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                {AVATAR_COLORS.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => field('avatarColor', c)}
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            background: c,
                                            border: form.avatarColor === c ? `2px solid white` : '2px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'transform 0.15s',
                                            transform: form.avatarColor === c ? 'scale(1.2)' : 'scale(1)',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* System prompt */}
                        <div>
                            <Label style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>시스템 프롬프트</Label>
                            <Textarea
                                value={form.systemPrompt}
                                onChange={(e) => field('systemPrompt', e.target.value)}
                                placeholder="에이전트의 역할과 응답 방식을 설명하세요..."
                                rows={3}
                                style={{ marginTop: '4px', background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)', resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    <DialogFooter style={{ marginTop: '20px' }}>
                        <Button type="button" variant="ghost" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            style={{ background: 'var(--accent-purple)', color: 'white' }}
                        >
                            {loading ? '저장 중...' : isEdit ? '수정 완료' : '직원 추가'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
