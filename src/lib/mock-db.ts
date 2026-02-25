// ============================================================
// Yootopia - In-Memory Mock Database
// Abstracted layer for easy Supabase/Postgres replacement
// ============================================================
import { Agent, Meeting, TranscriptMessage, AgentRuntimeState, MeetingSummary } from '@/types';
import { SEED_AGENTS } from './seed-data';

// ---- Stores (Persist across Next.js HMR) ----
const globalAny: any = globalThis;

if (!globalAny.__mockDb) {
    globalAny.__mockDb = {
        agents: [...SEED_AGENTS],
        meetings: [],
        transcripts: [],
        runtimeStates: [],
        summaries: [],
    };
}

const getStore = () => globalAny.__mockDb;


// ---- Helper ----
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================
// Agent Repository
// ============================================================
export const agentRepo = {
    findAll(): Agent[] {
        return getStore().agents;
    },

    findById(id: string): Agent | undefined {
        return getStore().agents.find((a: Agent) => a.id === id);
    },

    create(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
        const now = new Date().toISOString();
        const agent: Agent = {
            ...data,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };
        getStore().agents.push(agent);
        return agent;
    },

    update(id: string, data: Partial<Omit<Agent, 'id' | 'createdAt'>>): Agent | null {
        const store = getStore();
        const idx = store.agents.findIndex((a: Agent) => a.id === id);
        if (idx === -1) return null;
        store.agents[idx] = { ...store.agents[idx], ...data, updatedAt: new Date().toISOString() };
        return store.agents[idx];
    },

    delete(id: string): boolean {
        const store = getStore();
        const prev = store.agents.length;
        store.agents = store.agents.filter((a: Agent) => a.id !== id);
        return store.agents.length < prev;
    },
};

// ============================================================
// Meeting Repository
// ============================================================
export const meetingRepo = {
    findAll(): Meeting[] {
        return getStore().meetings;
    },

    findById(id: string): Meeting | undefined {
        return getStore().meetings.find((m: Meeting) => m.id === id);
    },

    create(data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>): Meeting {
        const now = new Date().toISOString();
        const meeting: Meeting = {
            ...data,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
        };
        getStore().meetings.push(meeting);
        return meeting;
    },

    update(id: string, data: Partial<Omit<Meeting, 'id' | 'createdAt'>>): Meeting | null {
        const store = getStore();
        const idx = store.meetings.findIndex((m: Meeting) => m.id === id);
        if (idx === -1) return null;
        store.meetings[idx] = { ...store.meetings[idx], ...data, updatedAt: new Date().toISOString() };
        return store.meetings[idx];
    },

    delete(id: string): boolean {
        const store = getStore();
        const prev = store.meetings.length;
        store.meetings = store.meetings.filter((m: Meeting) => m.id !== id);
        return store.meetings.length < prev;
    },
};

// ============================================================
// Transcript Repository
// ============================================================
export const transcriptRepo = {
    findByMeeting(meetingId: string): TranscriptMessage[] {
        return getStore().transcripts.filter((t: TranscriptMessage) => t.meetingId === meetingId);
    },

    add(data: Omit<TranscriptMessage, 'id'>): TranscriptMessage {
        const msg: TranscriptMessage = { ...data, id: generateId() };
        getStore().transcripts.push(msg);
        return msg;
    },
};

// ============================================================
// Runtime State Repository
// ============================================================
export const runtimeRepo = {
    findByMeeting(meetingId: string): AgentRuntimeState[] {
        return getStore().runtimeStates.filter((r: AgentRuntimeState) => r.meetingId === meetingId);
    },

    upsert(meetingId: string, agentId: string, patch: Partial<AgentRuntimeState>): AgentRuntimeState {
        const store = getStore();
        const idx = store.runtimeStates.findIndex(
            (r: AgentRuntimeState) => r.meetingId === meetingId && r.agentId === agentId,
        );
        if (idx === -1) {
            const state: AgentRuntimeState = {
                meetingId,
                agentId,
                uiState: 'idle',
                ...patch,
            };
            store.runtimeStates.push(state);
            return state;
        }
        store.runtimeStates[idx] = { ...store.runtimeStates[idx], ...patch };
        return store.runtimeStates[idx];
    },

    initForMeeting(meetingId: string, agentIds: string[]): AgentRuntimeState[] {
        const store = getStore();
        // Remove old states for this meeting
        store.runtimeStates = store.runtimeStates.filter((r: AgentRuntimeState) => r.meetingId !== meetingId);
        const states = agentIds.map((agentId) => ({
            meetingId,
            agentId,
            uiState: 'idle' as const,
        }));
        store.runtimeStates.push(...states);
        return states;
    },

    resetAll(meetingId: string): void {
        const store = getStore();
        store.runtimeStates = store.runtimeStates.map((r: AgentRuntimeState) =>
            r.meetingId === meetingId ? { ...r, uiState: 'idle' } : r,
        );
    },
};

// ============================================================
// Summary Repository
// ============================================================
export const summaryRepo = {
    findByMeeting(meetingId: string): MeetingSummary | undefined {
        return getStore().summaries.find((s: MeetingSummary) => s.meetingId === meetingId);
    },

    upsert(summary: MeetingSummary): MeetingSummary {
        const store = getStore();
        const idx = store.summaries.findIndex((s: MeetingSummary) => s.meetingId === summary.meetingId);
        if (idx === -1) {
            store.summaries.push(summary);
        } else {
            store.summaries[idx] = summary;
        }
        return summary;
    },
};
