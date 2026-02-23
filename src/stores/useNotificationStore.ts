import { create } from 'zustand';

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

interface NotificationState {
    notifications: Notification[];
}

interface NotificationActions {
    add: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    dismiss: (id: string) => void;
    clearAll: () => void;
    getUnread: () => Notification[];
    getByModule: (module: string) => Notification[];
    getCritical: () => Notification[];
    getStats: () => NotificationStats;
}

const STORAGE_KEY = 'basira_notifications';
const MAX_NOTIFICATIONS = 100;

function loadNotifications(): Notification[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const notifications: Notification[] = JSON.parse(stored);
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
        const toSave = notifications.slice(-MAX_NOTIFICATIONS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
        console.error('Failed to save notifications:', e);
    }
}

function playNotificationSound(): void {
    try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch {
        // Ignore audio errors
    }
}

export const useNotificationStore = create<NotificationState & NotificationActions>()((set, get) => ({
    notifications: loadNotifications(),

    add: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            read: false,
            dismissable: notification.dismissable ?? true,
        };

        set((state) => {
            const updated = [...state.notifications, newNotification];
            saveNotifications(updated);
            return { notifications: updated };
        });

        if (notification.priority === 'critical') {
            playNotificationSound();
        }
    },

    markAsRead: (id) => set((state) => {
        const updated = state.notifications.map(n => (n.id === id ? { ...n, read: true } : n));
        saveNotifications(updated);
        return { notifications: updated };
    }),

    markAllAsRead: () => set((state) => {
        const updated = state.notifications.map(n => ({ ...n, read: true }));
        saveNotifications(updated);
        return { notifications: updated };
    }),

    dismiss: (id) => set((state) => {
        const updated = state.notifications.filter(n => n.id !== id);
        saveNotifications(updated);
        return { notifications: updated };
    }),

    clearAll: () => {
        saveNotifications([]);
        set({ notifications: [] });
    },

    getUnread: () => get().notifications.filter(n => !n.read),

    getByModule: (module) => get().notifications.filter(n => n.module === module),

    getCritical: () => get().notifications.filter(n => n.priority === 'critical' && !n.read),

    getStats: () => {
        const { notifications } = get();
        const byType: Record<NotificationType, number> = { info: 0, success: 0, warning: 0, error: 0, alert: 0 };
        const byPriority: Record<NotificationPriority, number> = { low: 0, medium: 0, high: 0, critical: 0 };
        let unread = 0;

        notifications.forEach(n => {
            byType[n.type]++;
            byPriority[n.priority]++;
            if (!n.read) unread++;
        });

        return { total: notifications.length, unread, byType, byPriority };
    },
}));

// Pre-built notification creators (standalone, no hook needed)
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
