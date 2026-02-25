'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic } from 'lucide-react';

interface ChatInputBoxProps {
    onSend: (text: string) => Promise<void>;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInputBox({ onSend, disabled, placeholder }: ChatInputBoxProps) {
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const ref = useRef<HTMLTextAreaElement>(null);

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const handleSend = async () => {
        if (!text.trim() || sending || disabled) return;
        setSending(true);
        try {
            await onSend(text.trim());
            setText('');
            ref.current?.focus();
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('이 브라우저에서는 음성 인식을 지원하지 않습니다.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (e: any) => {
            console.error('Speech recognition error', e);
            setIsListening(false);
        };

        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setText((prev) => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    return (
        <div
            style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-end',
                padding: '12px 16px',
                borderTop: '1px solid var(--surface-border)',
                background: 'var(--surface-1)',
            }}
        >
            <Textarea
                ref={ref}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={disabled ? '회의가 시작되면 입력할 수 있습니다...' : (placeholder ?? '회의에 발언하세요... (Enter 전송, Shift+Enter 줄바꿈)')}
                disabled={disabled || sending}
                rows={1}
                style={{
                    flex: 1,
                    background: 'var(--surface-2)',
                    border: '1px solid var(--surface-border)',
                    color: 'var(--text-primary)',
                    resize: 'none',
                    fontSize: '13px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    maxHeight: 120,
                    overflowY: 'auto',
                }}
            />
            <Button
                onClick={toggleListen}
                disabled={disabled || sending}
                style={{
                    background: isListening ? '#ef4444' : 'var(--surface-button)',
                    color: isListening ? 'white' : 'var(--text-primary)',
                    width: 40,
                    height: 40,
                    padding: 0,
                    flexShrink: 0,
                    borderRadius: '10px',
                    border: '1px solid var(--surface-border)',
                }}
                title="음성 입력"
            >
                <Mic size={15} />
            </Button>
            <Button
                onClick={handleSend}
                disabled={!text.trim() || disabled || sending}
                style={{
                    background: 'var(--accent-purple)',
                    color: 'white',
                    width: 40,
                    height: 40,
                    padding: 0,
                    flexShrink: 0,
                    borderRadius: '10px',
                }}
            >
                <Send size={15} />
            </Button>
        </div>
    );
}
