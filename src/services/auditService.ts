// ═══════════════════════════════════════════════════════════════════════════
// Audit Logging Service for Basira System
// Tracks all user actions for accountability and compliance
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../config/supabase';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type AuditAction =
    | 'CREATE'
    | 'READ'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'EXPORT'
    | 'PRINT'
    | 'APPROVE'
    | 'REJECT'
    | 'ESCALATE';

export type AuditModule =
    | 'beneficiaries'
    | 'medical'
    | 'social'
    | 'medication'
    | 'incidents'
    | 'grc'
    | 'ipc'
    | 'empowerment'
    | 'catering'
    | 'operations'
    | 'reports'
    | 'auth'
    | 'settings';

export interface AuditLogEntry {
    id?: string;
    timestamp: string;
    userId: string;
    userName: string;
    userRole: string;
    action: AuditAction;
    module: AuditModule;
    resourceId?: string;
    resourceType?: string;
    description: string;
    previousValue?: any;
    newValue?: any;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    success: boolean;
    errorMessage?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// In-Memory Queue for batch inserts (improves performance)
// ═══════════════════════════════════════════════════════════════════════════

const auditQueue: AuditLogEntry[] = [];
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000; // 5 seconds

let flushTimer: ReturnType<typeof setInterval> | null = null;

// ═══════════════════════════════════════════════════════════════════════════
// Core Audit Functions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const fullEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    // Add to queue
    auditQueue.push(fullEntry);

    // Log to console in development
    if (import.meta.env.DEV) {
        console.log('[Audit]', {
            action: entry.action,
            module: entry.module,
            description: entry.description,
            user: entry.userName,
        });
    }

    // Flush if queue is full
    if (auditQueue.length >= BATCH_SIZE) {
        await flushAuditQueue();
    }
}

/**
 * Flush audit queue to database
 */
async function flushAuditQueue(): Promise<void> {
    if (auditQueue.length === 0) return;

    const entries = [...auditQueue];
    auditQueue.length = 0; // Clear queue

    try {
        // Only insert to Supabase if available
        if (supabase) {
            const { error } = await supabase
                .from('audit_logs')
                .insert(entries.map(e => ({
                    user_id: e.userId,
                    user_name: e.userName,
                    user_role: e.userRole,
                    action: e.action,
                    module: e.module,
                    resource_id: e.resourceId,
                    resource_type: e.resourceType,
                    description: e.description,
                    previous_value: e.previousValue ? JSON.stringify(e.previousValue) : null,
                    new_value: e.newValue ? JSON.stringify(e.newValue) : null,
                    ip_address: e.ipAddress,
                    user_agent: e.userAgent,
                    session_id: e.sessionId,
                    success: e.success,
                    error_message: e.errorMessage,
                    created_at: e.timestamp,
                })));

            if (error) {
                console.warn('[Audit] Failed to persist logs:', error.message);
                // Store in localStorage as fallback
                storeOfflineLogs(entries);
            }
        } else {
            // Store locally if Supabase not available
            storeOfflineLogs(entries);
        }
    } catch (error) {
        console.error('[Audit] Error flushing queue:', error);
        storeOfflineLogs(entries);
    }
}

/**
 * Store logs locally when offline
 */
function storeOfflineLogs(entries: AuditLogEntry[]): void {
    try {
        const existing = JSON.parse(localStorage.getItem('offline_audit_logs') || '[]');
        localStorage.setItem('offline_audit_logs', JSON.stringify([...existing, ...entries]));
    } catch (e) {
        console.error('[Audit] Failed to store offline logs:', e);
    }
}

/**
 * Sync offline logs when connection is restored
 */
export async function syncOfflineLogs(): Promise<void> {
    const offlineLogs = localStorage.getItem('offline_audit_logs');
    if (!offlineLogs) return;

    try {
        const entries: AuditLogEntry[] = JSON.parse(offlineLogs);
        if (entries.length > 0 && supabase) {
            // Try to insert offline logs
            await flushAuditQueue();
            localStorage.removeItem('offline_audit_logs');
        }
    } catch (e) {
        console.error('[Audit] Failed to sync offline logs:', e);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Auto-flush timer
// ═══════════════════════════════════════════════════════════════════════════

export function startAuditService(): void {
    if (flushTimer) return;

    flushTimer = setInterval(flushAuditQueue, FLUSH_INTERVAL);

    // Sync offline logs on startup
    syncOfflineLogs();

    // Flush on page unload
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            flushAuditQueue();
        });
    }
}

export function stopAuditService(): void {
    if (flushTimer) {
        clearInterval(flushTimer);
        flushTimer = null;
    }
    flushAuditQueue();
}

// ═══════════════════════════════════════════════════════════════════════════
// Convenience Wrappers for Common Actions
// ═══════════════════════════════════════════════════════════════════════════

interface UserContext {
    userId: string;
    userName: string;
    userRole: string;
}

/**
 * Create a module-specific audit logger
 */
export function createAuditLogger(module: AuditModule, userContext: UserContext) {
    return {
        create: (resourceId: string, resourceType: string, description: string, newValue?: any) =>
            logAuditEvent({
                ...userContext,
                action: 'CREATE',
                module,
                resourceId,
                resourceType,
                description,
                newValue,
                success: true,
            }),

        read: (resourceId: string, resourceType: string, description: string) =>
            logAuditEvent({
                ...userContext,
                action: 'READ',
                module,
                resourceId,
                resourceType,
                description,
                success: true,
            }),

        update: (resourceId: string, resourceType: string, description: string, previousValue?: any, newValue?: any) =>
            logAuditEvent({
                ...userContext,
                action: 'UPDATE',
                module,
                resourceId,
                resourceType,
                description,
                previousValue,
                newValue,
                success: true,
            }),

        delete: (resourceId: string, resourceType: string, description: string) =>
            logAuditEvent({
                ...userContext,
                action: 'DELETE',
                module,
                resourceId,
                resourceType,
                description,
                success: true,
            }),

        export: (description: string) =>
            logAuditEvent({
                ...userContext,
                action: 'EXPORT',
                module,
                description,
                success: true,
            }),

        print: (description: string) =>
            logAuditEvent({
                ...userContext,
                action: 'PRINT',
                module,
                description,
                success: true,
            }),

        error: (action: AuditAction, description: string, errorMessage: string) =>
            logAuditEvent({
                ...userContext,
                action,
                module,
                description,
                success: false,
                errorMessage,
            }),
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// Login/Logout Audit
// ═══════════════════════════════════════════════════════════════════════════

export function auditLogin(userId: string, userName: string, userRole: string, success: boolean, errorMessage?: string) {
    return logAuditEvent({
        userId,
        userName,
        userRole,
        action: 'LOGIN',
        module: 'auth',
        description: success ? `تسجيل دخول ناجح: ${userName}` : `محاولة تسجيل دخول فاشلة: ${userName}`,
        success,
        errorMessage,
    });
}

export function auditLogout(userId: string, userName: string, userRole: string) {
    return logAuditEvent({
        userId,
        userName,
        userRole,
        action: 'LOGOUT',
        module: 'auth',
        description: `تسجيل خروج: ${userName}`,
        success: true,
    });
}
