import Dexie, { type Table } from 'dexie';

export interface ActivityLog {
    id?: number;
    timestamp: number;
    provider: string;
    model: string;
    request: any;
    response: any;
    status: 'success' | 'error';
}

export class ActivityDatabase extends Dexie {
    logs!: Table<ActivityLog>;

    constructor() {
        super('ActivityLogDB');
        this.version(1).stores({
            logs: '++id, timestamp, provider, model, status'
        });
    }
}

export const activityDb = new ActivityDatabase();

export async function logActivity(log: Omit<ActivityLog, 'id'>) {
    try {
        await activityDb.logs.add(log as ActivityLog);
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
}
