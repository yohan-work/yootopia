'use client';

import { useCallback, useRef } from 'react';

interface SpeakOptions {
    agentId: string;
    onStart?: () => void;
    onEnd?: () => void;
    personalityTone?: string;
}

export function useSpeech() {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const stop = useCallback(() => {
        if (synth) {
            synth.cancel();
        }
    }, [synth]);

    const speak = useCallback((text: string, options: SpeakOptions) => {
        if (!synth) return;

        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        // Set Language
        utterance.lang = 'ko-KR';

        // Voice Selection based on personality
        const voices = synth.getVoices();
        const koVoices = voices.filter(v => v.lang.startsWith('ko'));

        if (koVoices.length > 0) {
            // Assign different voices based on personality or agentId
            // Simple mapping for demonstration:
            if (options.personalityTone === 'calm') {
                utterance.voice = koVoices[0]; // Usually default female
                utterance.pitch = 0.9;
                utterance.rate = 0.95;
            } else if (options.personalityTone === 'direct' || options.personalityTone === 'analytical') {
                utterance.voice = koVoices.find(v => v.name.includes('Male')) || koVoices[0];
                utterance.pitch = 0.8;
                utterance.rate = 1.05;
            } else {
                utterance.voice = koVoices[koVoices.length - 1]; // Often a varied voice
                utterance.pitch = 1.1;
                utterance.rate = 1.0;
            }
        }

        utterance.onstart = () => {
            if (options.onStart) options.onStart();
        };

        utterance.onend = () => {
            if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (event) => {
            console.error('SpeechSynthesis error:', event);
            if (options.onEnd) options.onEnd();
        };

        synth.speak(utterance);
    }, [synth]);

    return { speak, stop };
}
