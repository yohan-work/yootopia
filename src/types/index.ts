// ============================================================
// Yootopia - Core Type Definitions
// ============================================================

// ----- Agent -----
export type AgentRole =
  | 'lawyer'
  | 'accountant'
  | 'developer'
  | 'designer'
  | 'announcer'
  | 'custom';

export type AgentStatus = 'working' | 'idle' | 'offline';

export type PersonalityTone = 'calm' | 'direct' | 'friendly' | 'analytical' | 'creative';
export type ResponseStyle = 'brief' | 'logical' | 'questioning' | 'detailed';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  title: string;
  specialty: string;
  personalityTone: PersonalityTone;
  responseStyle: ResponseStyle;
  avatarUrl?: string;
  avatarColor: string; // hex color for initial avatar
  status: AgentStatus;
  systemPrompt: string;
  createdAt: string;
  updatedAt: string;
}

// ----- Meeting -----
export type MeetingMode = 'free' | 'round_robin' | 'directed';
export type MeetingStatus = 'scheduled' | 'live' | 'ended';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  mode: MeetingMode;
  startAt: string;
  endAt: string;
  status: MeetingStatus;
  participantAgentIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ----- TranscriptMessage -----
export type SpeakerType = 'user' | 'agent' | 'system';

export interface TranscriptMessage {
  id: string;
  meetingId: string;
  speakerType: SpeakerType;
  speakerId?: string;
  speakerName: string;
  text: string;
  timestamp: string;
}

// ----- Agent Runtime State (Meeting Room UI) -----
export type AgentUiState = 'idle' | 'thinking' | 'speaking' | 'hand_raised';

export interface AgentRuntimeState {
  meetingId: string;
  agentId: string;
  uiState: AgentUiState;
  handRaisedReason?: string;
  lastSpokenAt?: string;
}

// ----- Meeting Summary -----
export interface MeetingActionItem {
  id: string;
  text: string;
  assignee?: string;
  done: boolean;
}

export interface MeetingSummary {
  meetingId: string;
  keyTopics: string[];
  decisions: string[];
  actionItems: MeetingActionItem[];
  reviewItems: string[];
  generatedAt: string;
}

// ----- API Response Types -----
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// ----- Orchestration -----
export interface SpeakIntentScore {
  agentId: string;
  score: number;
}
