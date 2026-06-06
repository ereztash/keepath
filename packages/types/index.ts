// User
export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Value (life area)
export interface Value {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Intentions
export interface WeeklyIntention {
  id: string;
  userId: string;
  valueId: string;
  weekStart: Date;
  targetHours: number;
  notes: string | null;
  value?: Value;
  createdAt: Date;
  updatedAt: Date;
}

// Calendar
export interface CalendarEvent {
  id: string;
  userId: string;
  googleEventId: string;
  calendarId: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: Date;
  endTime: Date;
  durationMinutes: number;
  isAllDay: boolean;
  status: string;
  syncedAt: Date;
  categorizations?: EventCategorization[];
}

export interface EventCategorization {
  id: string;
  eventId: string;
  valueId: string;
  confidence: number;
  reasoning: string | null;
  isManual: boolean;
  value?: Value;
  createdAt: Date;
}

// Alignment
export interface AlignmentBreakdown {
  valueId: string;
  valueName: string;
  valueColor: string;
  targetHours: number;
  actualHours: number;
  score: number; // 0-100
}

export interface AlignmentScore {
  id: string;
  userId: string;
  weekStart: Date;
  overallScore: number;
  breakdown: AlignmentBreakdown[];
  totalActualHours: number;
  totalTargetHours: number;
  computedAt: Date;
}

// Missions
export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: MissionType;
  status: MissionStatus;
  priority: Priority;
  xpReward: number;
  dueDate: Date | null;
  completedAt: Date | null;
  subtasks: Subtask[];
  valueId: string | null;
  value?: Value;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export enum MissionType {
  QUICK_WIN = 'QUICK_WIN',
  WEEKLY_CHALLENGE = 'WEEKLY_CHALLENGE',
  MILESTONE = 'MILESTONE',
  NINETY_DAY_GOAL = 'NINETY_DAY_GOAL',
}

export enum MissionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Weekly Check-In
export interface WeeklyCheckIn {
  id: string;
  userId: string;
  weekStart: Date;
  mood: number;
  wins: string[];
  blockers: string[];
  learnings: string[];
  reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Conversations
export interface Conversation {
  id: string;
  userId: string;
  title: string | null;
  messages?: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

// Dashboard
export interface DashboardData {
  weekStart: Date;
  alignmentScore: AlignmentScore | null;
  intentions: WeeklyIntention[];
  events: CalendarEvent[];
  uncategorizedCount: number;
}

// Suggested icons for values
export const VALUE_ICONS = [
  'Target',
  'Heart',
  'Briefcase',
  'BookOpen',
  'Dumbbell',
  'Users',
  'Sparkles',
  'Brain',
  'Home',
  'Palette',
  'Music',
  'Globe',
] as const;

export const VALUE_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ef4444', // red
  '#84cc16', // lime
] as const;
