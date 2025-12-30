// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER',
}

// Organization
export interface Organization {
  id: string;
  name: string;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Mission Types
export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  department: Department;
  duration: number; // in days
  xpReward: number;
  priority: Priority;
  status: MissionStatus;
  subtasks: Subtask[];
  assignedToId?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum MissionType {
  QUICK_WIN = 'QUICK_WIN',
  WEEKLY_CHALLENGE = 'WEEKLY_CHALLENGE',
  MILESTONE = 'MILESTONE',
  NINETY_DAY_GOAL = 'NINETY_DAY_GOAL',
}

export enum Department {
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  PRODUCT = 'PRODUCT',
  OPERATIONS = 'OPERATIONS',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MissionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

// Offer Types
export interface Offer {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryCost: number;
  profitMargin: number; // calculated
  profitPerSale: number; // calculated
  isMain: boolean;
  status: OfferStatus;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: Department;
  monthlyCost: number;
  kpiMetric: string;
  kpiTarget: number;
  currentKpi: number;
  performance: number; // percentage
  capacity: number; // percentage
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Marketing Channel Types
export interface MarketingChannel {
  id: string;
  source: string;
  funnelStage: FunnelStage;
  visitors: number;
  leads: number;
  convRate: number; // calculated
  monthlySpend: number;
  costPerLead: number; // calculated
  status: ChannelStatus;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum FunnelStage {
  AWARENESS = 'AWARENESS',
  CONSIDERATION = 'CONSIDERATION',
  CONVERSION = 'CONVERSION',
  RETENTION = 'RETENTION',
}

export enum ChannelStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  TESTING = 'TESTING',
}

// Sale Types
export interface Sale {
  id: string;
  clientName: string;
  offerId: string;
  amount: number;
  soldById: string;
  date: Date;
  status: SaleStatus;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SaleStatus {
  PENDING = 'PENDING',
  CLOSED = 'CLOSED',
  LOST = 'LOST',
}

// Process Types
export interface Process {
  id: string;
  name: string;
  description: string;
  department: Department;
  timeSaved: number; // hours per month
  automatable: boolean;
  status: ProcessStatus;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProcessStatus {
  IDENTIFIED = 'IDENTIFIED',
  IN_PROGRESS = 'IN_PROGRESS',
  AUTOMATED = 'AUTOMATED',
}

// Goal & Reflection Types
export interface WeeklyCheckIn {
  id: string;
  week: Date;
  snapshot: {
    leads: number;
    sales: number;
    revenue: number;
    profit: number;
    hours: number;
    mood: number; // 1-10
  };
  goals: string[];
  wins: string[];
  blockers: string[];
  learnings: string[];
  why: string;
  userId: string;
  organizationId: string;
  createdAt: Date;
}

// Analytics Types
export interface DashboardMetrics {
  finance: {
    revenue: number;
    profit: number;
    expenses: number;
    burnRate: number;
    runway: number; // months
  };
  marketing: {
    totalLeads: number;
    totalSpend: number;
    avgCPL: number;
    bestChannel: string;
  };
  sales: {
    totalSales: number;
    avgDealSize: number;
    winRate: number;
    topSeller: string;
  };
  team: {
    totalMembers: number;
    totalCost: number;
    avgPerformance: number;
  };
}
