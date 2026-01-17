// ═══════════════════════════════════════════════════════════════════════════
// Batch Operations Hook for Basira System
// Enables multi-selection and bulk actions on beneficiaries and other entities
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo } from 'react';
import { useAudit } from './useAudit';
import type { AuditModule } from '../services/auditService';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export type BatchAction =
    | 'export'
    | 'print'
    | 'delete'
    | 'archive'
    | 'update_status'
    | 'assign'
    | 'send_notification'
    | 'generate_report';

export interface BatchActionConfig {
    action: BatchAction;
    label: string; // Arabic label
    icon?: string;
    confirmRequired?: boolean;
    confirmMessage?: string;
    requiresInput?: boolean;
    inputLabel?: string;
    allowedRoles?: string[];
    dangerous?: boolean;
}

export interface UseBatchOperationsResult<T> {
    // Selection state
    selectedIds: Set<string>;
    selectedItems: T[];
    isAllSelected: boolean;
    isPartiallySelected: boolean;
    selectionCount: number;

    // Selection actions
    select: (id: string) => void;
    deselect: (id: string) => void;
    toggle: (id: string) => void;
    selectAll: () => void;
    deselectAll: () => void;
    selectRange: (startId: string, endId: string) => void;
    isSelected: (id: string) => boolean;

    // Batch actions
    executeAction: (action: BatchAction, payload?: any) => Promise<BatchActionResult>;
    isExecuting: boolean;
    lastResult: BatchActionResult | null;
}

export interface BatchActionResult {
    success: boolean;
    action: BatchAction;
    affectedCount: number;
    errors?: { id: string; error: string }[];
    message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// Default Batch Actions Configuration
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_BATCH_ACTIONS: BatchActionConfig[] = [
    {
        action: 'export',
        label: 'تصدير',
        icon: 'Download',
        confirmRequired: false,
    },
    {
        action: 'print',
        label: 'طباعة',
        icon: 'Printer',
        confirmRequired: false,
    },
    {
        action: 'archive',
        label: 'أرشفة',
        icon: 'Archive',
        confirmRequired: true,
        confirmMessage: 'هل أنت متأكد من أرشفة العناصر المحددة؟',
    },
    {
        action: 'update_status',
        label: 'تحديث الحالة',
        icon: 'RefreshCw',
        requiresInput: true,
        inputLabel: 'الحالة الجديدة',
    },
    {
        action: 'assign',
        label: 'تعيين مسؤول',
        icon: 'UserPlus',
        requiresInput: true,
        inputLabel: 'المسؤول',
    },
    {
        action: 'send_notification',
        label: 'إرسال إشعار',
        icon: 'Bell',
        requiresInput: true,
        inputLabel: 'نص الإشعار',
    },
    {
        action: 'generate_report',
        label: 'إنشاء تقرير',
        icon: 'FileText',
        confirmRequired: false,
    },
    {
        action: 'delete',
        label: 'حذف',
        icon: 'Trash2',
        confirmRequired: true,
        confirmMessage: 'هل أنت متأكد من حذف العناصر المحددة؟ لا يمكن التراجع عن هذا الإجراء.',
        dangerous: true,
        allowedRoles: ['admin', 'director'],
    },
];

// ═══════════════════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════════════════

export interface UseBatchOperationsOptions<T> {
    data: T[];
    idField?: keyof T;
    module: AuditModule;
    onExecute?: (action: BatchAction, items: T[], payload?: any) => Promise<void>;
}

export function useBatchOperations<T extends Record<string, any>>(
    options: UseBatchOperationsOptions<T>
): UseBatchOperationsResult<T> {
    const { data, idField = 'id' as keyof T, module, onExecute } = options;

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isExecuting, setIsExecuting] = useState(false);
    const [lastResult, setLastResult] = useState<BatchActionResult | null>(null);

    const { audit } = useAudit(module);

    // Get all IDs from data
    const allIds = useMemo(() => {
        return data.map(item => String(item[idField]));
    }, [data, idField]);

    // Get selected items
    const selectedItems = useMemo(() => {
        return data.filter(item => selectedIds.has(String(item[idField])));
    }, [data, selectedIds, idField]);

    // Selection state
    const isAllSelected = selectedIds.size > 0 && selectedIds.size === allIds.length;
    const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < allIds.length;
    const selectionCount = selectedIds.size;

    // Selection actions
    const select = useCallback((id: string) => {
        setSelectedIds(prev => new Set(prev).add(id));
    }, []);

    const deselect = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }, []);

    const toggle = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const selectAll = useCallback(() => {
        setSelectedIds(new Set(allIds));
    }, [allIds]);

    const deselectAll = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    const selectRange = useCallback((startId: string, endId: string) => {
        const startIndex = allIds.indexOf(startId);
        const endIndex = allIds.indexOf(endId);

        if (startIndex === -1 || endIndex === -1) return;

        const min = Math.min(startIndex, endIndex);
        const max = Math.max(startIndex, endIndex);

        const rangeIds = allIds.slice(min, max + 1);
        setSelectedIds(prev => new Set([...prev, ...rangeIds]));
    }, [allIds]);

    const isSelected = useCallback((id: string) => {
        return selectedIds.has(id);
    }, [selectedIds]);

    // Execute batch action
    const executeAction = useCallback(async (
        action: BatchAction,
        payload?: any
    ): Promise<BatchActionResult> => {
        if (selectedIds.size === 0) {
            return {
                success: false,
                action,
                affectedCount: 0,
                message: 'لا توجد عناصر محددة',
            };
        }

        setIsExecuting(true);
        const errors: { id: string; error: string }[] = [];

        try {
            // Log the batch action
            await audit.log?.('BATCH_' + action.toUpperCase() as any,
                `تنفيذ عملية ${action} على ${selectedIds.size} عناصر`, {
                success: true,
            });

            // Execute custom handler if provided
            if (onExecute) {
                await onExecute(action, selectedItems, payload);
            }

            const result: BatchActionResult = {
                success: true,
                action,
                affectedCount: selectedIds.size,
                errors: errors.length > 0 ? errors : undefined,
                message: `تم تنفيذ العملية بنجاح على ${selectedIds.size} عناصر`,
            };

            setLastResult(result);
            setSelectedIds(new Set()); // Clear selection after successful action

            return result;
        } catch (error) {
            const result: BatchActionResult = {
                success: false,
                action,
                affectedCount: 0,
                message: `فشل في تنفيذ العملية: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
            };

            setLastResult(result);
            return result;
        } finally {
            setIsExecuting(false);
        }
    }, [selectedIds, selectedItems, audit, onExecute]);

    return {
        // Selection state
        selectedIds,
        selectedItems,
        isAllSelected,
        isPartiallySelected,
        selectionCount,

        // Selection actions
        select,
        deselect,
        toggle,
        selectAll,
        deselectAll,
        selectRange,
        isSelected,

        // Batch actions
        executeAction,
        isExecuting,
        lastResult,
    };
}

export default useBatchOperations;
