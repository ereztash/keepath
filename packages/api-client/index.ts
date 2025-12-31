// Main client
export { APIClient, apiClient } from './client';

// Services
export { financeService } from './services/finance';
export { marketingService } from './services/marketing';
export { salesService } from './services/sales';
export { missionsService } from './services/missions';
export { aiService } from './services/ai';

// Event bus
export { eventBus, Events, EventBus } from './event-bus';

// Aggregations
export { aggregationService, AggregationService } from './aggregations';

// Types
export type { FinanceDashboard, CreateOfferData } from './services/finance';
export type { MarketingDashboard, CreateChannelData } from './services/marketing';
export type { SalesDashboard, CreateSaleData } from './services/sales';
export type { MissionStats, CreateMissionData } from './services/missions';
export type { ChatMessage, ChatResponse, MissionSuggestion } from './services/ai';
export type { DashboardAggregation } from './aggregations';
