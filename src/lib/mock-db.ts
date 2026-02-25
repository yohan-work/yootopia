// ============================================================
// Yootopia - In-Memory Mock Database
// Abstracted layer for easy Supabase/Postgres replacement
// ============================================================
import { Agent, Meeting, TranscriptMessage, AgentRuntimeState, MeetingSummary } from '@/types';
import { SEED_AGENTS } from './seed-data';

// ---- Stores ----
let agents: Agent[] = [...SEED_AGENTS];
let meetings: Meeting[] = [];
let transcripts: TranscriptMessage[] = [];
let runtimeStates: AgentRuntimeState[] = [];
let summaries: MeetingSummary[] = [];

// ---- Helper ----
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================
// Agent Repository
// ============================================================
export const agentRepo = {
    findAll(): Agent[] {
        return agents;
    },

    findById(id: string): Agent | undefined {
        return agents.find((a) => a.id === id);
    },

    create(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
        const now = new Date().toISOString();
        const agent: Agent = {
            ...data,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };
        agents.push(agent);
        return agent;
    },

    update(id: string, data: Partial<Omit<Agent, 'id' | 'createdAt'>>): Agent | null {
        const idx = agents.findIndex((a) => a.id === id);
        if (idx === -1) return null;
        agents[idx] = { ...agents[idx], ...data, updatedAt: new Date().toISOString() };
        return agents[idx];
    },

    delete(id: string): boolean {
        const prev = agents.length;
        agents = agents.filter((a) => a.id !== id);
        return agents.length < prev;
    },
};

// ============================================================
// Meeting Repository
// ============================================================
export const meetingRepo = {
    findAll(): Meeting[] {
        return meetings;
    },

    findById(id: string): Meeting | undefined {
        return meetings.find((m) => m.id === id);
    },

    create(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Meeting {
        const now = new Date().toISOString();
        const meeting: Meeting = {
            ...data,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };
        meetings.push(meeting);
        return meeting;
    },

    update(id: string, data: Partial<Omit<Meeting, 'id' | 'createdAt'>>): Meeting | null {
        const idx = meetings.findIndex((m) => m.id === id);
        if (idx === -1) return null;
        meetings[idx] = { ...meetings[idx], ...data, updatedAt: new Date().toISOString() };
        return meetings[idx];
    },

    delete(id: string): boolean {
        const prev = meetings.length;
        meetings = meetings.filter((m) => m.id !== id);
        return meetings.length < prev;
    },
};

// ============================================================
// Transcript Repository
// ============================================================
export const transcriptRepo = {
    findByMeeting(meetingId: string): TranscriptMessage[] {
        return transcripts.filter((t) => t.meetingId === meetingId);
    },

    add(data: Omit<TranscriptMessage, 'id'>): TranscriptMessage {
        const msg: TranscriptMessage = { ...data, id: generateId() };
        transcripts.push(msg);
        return msg;
    },
};

// ============================================================
// Runtime State Repository
// ============================================================
export const runtimeRepo = {
    findByMeeting(meetingId: string): AgentRuntimeState[] {
        return runtimeStates.filter((r) => r.meetingId === meetingId);
    },

    upsert(meetingId: string, agentId: string, patch: Partial<AgentRuntimeState>): AgentRuntimeState {
        const idx = runtimeStates.findIndex(
            (r) => r.meetingId === meetingId && r.agentId === agentId,
        );
        if (idx === -1) {
            const state: AgentRuntimeState = {
                meetingId,
                agentId,
                uiState: 'idle',
                ...patch,
            };
            runtimeStates.push(state);
            return state;
        }
        runtimeStates[idx] = { ...runtimeStates[idx], ...patch };
        return runtimeStates[idx];
    },

    initForMeeting(meetingId: string, agentIds: string[]): AgentRuntimeState[] {
        // Remove old states for this meeting
        runtimeStates = runtimeStates.filter((r) => r.meetingId !== meetingId);
        const states = agentIds.map((agentId) => ({
            meetingId,
            agentId,
            uiState: 'idle' as const,
        }));
        runtimeStates.push(...states);
        return states;
    },

    resetAll(meetingId: string): void {
        runtimeStates = runtimeStates.map((r) =>
            r.meetingId === meetingId ? { ...r, uiState: 'idle' } : r,
        );
    },
};

// ============================================================
// Summary Repository
// ============================================================
export const summaryRepo = {
    findByMeeting(meetingId: string): MeetingSummary | undefined {
        return summaries.find((s) => s.meetingId === meetingId);
    },

    upsert(summary: MeetingSummary): MeetingSummary {
        const idx = summaries.findIndex((s) => s.meetingId === summary.meetingId);
        if (idx === -1) {
            summaries.push(summary);
        } else {
            summaries[idx] = summary;
        }
        return summary;
    },
};
