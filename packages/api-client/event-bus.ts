type EventHandler = (data: any) => void | Promise<void>;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  off(event: string, handler: EventHandler): void {
    this.handlers.get(event)?.delete(handler);
  }

  async emit(event: string, data?: any): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    await Promise.all(
      Array.from(handlers).map((handler) => handler(data))
    );
  }

  clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

// Create singleton instance
export const eventBus = new EventBus();

// Define standard events
export const Events = {
  // Finance events
  OFFER_CREATED: 'finance:offer:created',
  OFFER_UPDATED: 'finance:offer:updated',
  OFFER_DELETED: 'finance:offer:deleted',

  // Marketing events
  CHANNEL_CREATED: 'marketing:channel:created',
  CHANNEL_UPDATED: 'marketing:channel:updated',
  CHANNEL_DELETED: 'marketing:channel:deleted',

  // Sales events
  SALE_CREATED: 'sales:sale:created',
  SALE_UPDATED: 'sales:sale:updated',
  SALE_CLOSED: 'sales:sale:closed',

  // Mission events
  MISSION_CREATED: 'missions:mission:created',
  MISSION_COMPLETED: 'missions:mission:completed',
  MISSION_UPDATED: 'missions:mission:updated',

  // Team events
  TEAM_MEMBER_ADDED: 'team:member:added',
  TEAM_MEMBER_UPDATED: 'team:member:updated',
  TEAM_MEMBER_REMOVED: 'team:member:removed',
} as const;

// Example usage:
// eventBus.on(Events.SALE_CREATED, async (sale) => {
//   // Recalculate finance dashboard
//   // Send notification
//   // Update analytics
// });
