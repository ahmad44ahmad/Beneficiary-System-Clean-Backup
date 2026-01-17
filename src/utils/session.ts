// ═══════════════════════════════════════════════════════════════════════════
// Session Management Utilities for Basira System
// Handles session timeout, activity tracking, and secure logout
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════════

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'];

// ═══════════════════════════════════════════════════════════════════════════
// Session State
// ═══════════════════════════════════════════════════════════════════════════

let lastActivityTime = Date.now();
let sessionTimeoutId: ReturnType<typeof setTimeout> | null = null;
let warningTimeoutId: ReturnType<typeof setTimeout> | null = null;
let onSessionWarning: (() => void) | null = null;
let onSessionTimeout: (() => void) | null = null;

// ═══════════════════════════════════════════════════════════════════════════
// Session ID Management
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${randomPart}`;
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
    let sessionId = sessionStorage.getItem('basira_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('basira_session_id', sessionId);
        sessionStorage.setItem('basira_session_start', new Date().toISOString());
    }
    return sessionId;
}

/**
 * Clear session data
 */
export function clearSession(): void {
    sessionStorage.removeItem('basira_session_id');
    sessionStorage.removeItem('basira_session_start');
    localStorage.removeItem('basira_user_preferences');
}

// ═══════════════════════════════════════════════════════════════════════════
// Activity Tracking
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Update last activity timestamp
 */
function updateLastActivity(): void {
    lastActivityTime = Date.now();
    resetTimeouts();
}

/**
 * Reset session timeouts
 */
function resetTimeouts(): void {
    // Clear existing timeouts
    if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
        warningTimeoutId = null;
    }
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
        sessionTimeoutId = null;
    }

    // Set warning timeout
    warningTimeoutId = setTimeout(() => {
        if (onSessionWarning) {
            onSessionWarning();
        }
    }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

    // Set session timeout
    sessionTimeoutId = setTimeout(() => {
        if (onSessionTimeout) {
            onSessionTimeout();
        }
    }, SESSION_TIMEOUT);
}

// ═══════════════════════════════════════════════════════════════════════════
// Session Manager
// ═══════════════════════════════════════════════════════════════════════════

interface SessionConfig {
    onWarning?: () => void;
    onTimeout?: () => void;
    timeoutMinutes?: number;
    warningMinutes?: number;
}

/**
 * Start session management
 */
export function startSessionManager(config: SessionConfig = {}): void {
    onSessionWarning = config.onWarning || null;
    onSessionTimeout = config.onTimeout || null;

    // Ensure session ID exists
    getSessionId();

    // Track user activity
    ACTIVITY_EVENTS.forEach(event => {
        document.addEventListener(event, updateLastActivity, { passive: true });
    });

    // Start timeouts
    resetTimeouts();

    // Sync session across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'basira_session_sync') {
            // Another tab indicated activity or logout
            const data = JSON.parse(e.newValue || '{}');
            if (data.type === 'activity') {
                updateLastActivity();
            } else if (data.type === 'logout') {
                if (onSessionTimeout) {
                    onSessionTimeout();
                }
            }
        }
    });
}

/**
 * Stop session management
 */
export function stopSessionManager(): void {
    // Remove event listeners
    ACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, updateLastActivity);
    });

    // Clear timeouts
    if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
        warningTimeoutId = null;
    }
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
        sessionTimeoutId = null;
    }
}

/**
 * Extend session (e.g., after user confirms they want to continue)
 */
export function extendSession(): void {
    updateLastActivity();
}

/**
 * Broadcast session event to other tabs
 */
export function broadcastSessionEvent(type: 'activity' | 'logout'): void {
    localStorage.setItem('basira_session_sync', JSON.stringify({
        type,
        timestamp: Date.now(),
    }));
    // Clean up immediately
    localStorage.removeItem('basira_session_sync');
}

// ═══════════════════════════════════════════════════════════════════════════
// Session Info
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get session information
 */
export function getSessionInfo(): {
    sessionId: string | null;
    startTime: string | null;
    lastActivity: number;
    isActive: boolean;
    minutesRemaining: number;
} {
    const sessionId = sessionStorage.getItem('basira_session_id');
    const startTime = sessionStorage.getItem('basira_session_start');
    const timeSinceActivity = Date.now() - lastActivityTime;
    const minutesRemaining = Math.max(0, Math.floor((SESSION_TIMEOUT - timeSinceActivity) / 60000));

    return {
        sessionId,
        startTime,
        lastActivity: lastActivityTime,
        isActive: timeSinceActivity < SESSION_TIMEOUT,
        minutesRemaining,
    };
}
