// ═══════════════════════════════════════════════════════════════════════════
// Notification Center Context for Basira System
// Centralized notification management with persistence
// ═══════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'alert';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
    id: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
    module?: string;
    resourceId?: string;
    expiresAt?: string;
    dismissable?: boolean;
}

export interface NotificationStats {
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
}

interface NotificationContextType {
    notifications: Notification[];
    stats: NotificationStats;
    add: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    dismiss: (id: string) => void;
    clearAll: () => void;
    getUnread: () => Notification[];
    getByModule: (module: string) => Notification[];
    getCritical: () => Notification[];
}

// ═══════════════════════════════════════════════════════════════════════════
// Storage
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'basira_notifications';
const MAX_NOTIFICATIONS = 100;

function loadNotifications(): Notification[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const notifications: Notification[] = JSON.parse(stored);
            // Filter out expired notifications
            const now = new Date().toISOString();
            return notifications.filter(n => !n.expiresAt || n.expiresAt > now);
        }
    } catch (e) {
        console.error('Failed to load notifications:', e);
    }
    return [];
}

function saveNotifications(notifications: Notification[]): void {
    try {
        // Keep only the most recent notifications
        const toSave = notifications.slice(-MAX_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
        console.error('Failed to save notifications:', e);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════════════════

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ═══════════════════════════════════════════════════════════════════════════
// Provider
// ═══════════════════════════════════════════════════════════════════════════

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<Notification[]>(loadNotifications);

    // Save to localStorage when notifications change
    useEffect(() => {
        saveNotifications(notifications);
    }, [notifications]);

    // Calculate stats
    const stats: NotificationStats = React.useMemo(() => {
        const byType: Record<NotificationType, number> = {
            info: 0,
            success: 0,
            warning: 0,
            error: 0,
            alert: 0,
        };
        const byPriority: Record<NotificationPriority, number> = {
            low: 0,
            medium: 0,
            high: 0,
            critical: 0,
        };

        let unread = 0;

        notifications.forEach(n => {
            byType[n.type]++;
            byPriority[n.priority]++;
            if (!n.read) unread++;
        });

        return {
            total: notifications.length,
            unread,
            byType,
            byPriority,
        };
    }, [notifications]);

    // Add notification
    const add = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            read: false,
            dismissable: notification.dismissable ?? true,
        };

        setNotifications(prev => [...prev, newNotification]);

        // Play sound for critical notifications
        if (notification.priority === 'critical') {
            playNotificationSound();
        }
    }, []);

    // Mark as read
    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    // Dismiss notification
    const dismiss = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Clear all
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Get unread
    const getUnread = useCallback(() => {
        return notifications.filter(n => !n.read);
    }, [notifications]);

    // Get by module
    const getByModule = useCallback((module: string) => {
        return notifications.filter(n => n.module === module);
    }, [notifications]);

    // Get critical
    const getCritical = useCallback(() => {
        return notifications.filter(n => n.priority === 'critical' && !n.read);
    }, [notifications]);

    const value: NotificationContextType = {
        notifications,
        stats,
        add,
        markAsRead,
        markAllAsRead,
        dismiss,
        clearAll,
        getUnread,
        getByModule,
        getCritical,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════════════

function playNotificationSound() {
    try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Ignore audio errors
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// Pre-built Notification Creators
// ═══════════════════════════════════════════════════════════════════════════

export const NotificationCreators = {
    riskAlert: (beneficiaryName: string, riskScore: number, beneficiaryId: string) => ({
        type: 'alert' as NotificationType,
        priority: 'critical' as NotificationPriority,
        title: '⚠️ تنبيه خطورة عالية',
        message: `المستفيد ${beneficiaryName} لديه درجة خطورة ${riskScore}`,
        module: 'beneficiaries',
        resourceId: beneficiaryId,
        actionUrl: `/beneficiaries/${beneficiaryId}`,
        actionLabel: 'عرض الملف',
    }),

    medicationReminder: (beneficiaryName: string, medicationName: string) => ({
        type: 'warning' as NotificationType,
        priority: 'high' as NotificationPriority,
        title: '💊 تذكير بالدواء',
        message: `موعد إعطاء ${medicationName} لـ ${beneficiaryName}`,
        module: 'medical',
    }),

    visitScheduled: (beneficiaryName: string, visitorName: string, date: string) => ({
        type: 'info' as NotificationType,
        priority: 'medium' as NotificationPriority,
        title: '📅 زيارة مجدولة',
        message: `زيارة ${visitorName} لـ ${beneficiaryName} في ${date}`,
        module: 'social',
    }),

    maintenanceComplete: (location: string, issueType: string) => ({
        type: 'success' as NotificationType,
        priority: 'low' as NotificationPriority,
        title: '✅ صيانة مكتملة',
        message: `تم إكمال صيانة ${issueType} في ${location}`,
        module: 'operations',
    }),

    systemAlert: (message: string) => ({
        type: 'error' as NotificationType,
        priority: 'critical' as NotificationPriority,
        title: '🚨 تنبيه النظام',
        message,
        module: 'system',
    }),
};

export default NotificationProvider;
