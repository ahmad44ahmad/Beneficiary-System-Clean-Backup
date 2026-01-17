// ═══════════════════════════════════════════════════════════════════════════
// useAudit Hook - Access audit logging in React components
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useMemo } from 'react';
import { useUser } from '../context/UserContext';
import {
    createAuditLogger,
    AuditModule,
    logAuditEvent,
    AuditAction
} from '../services/auditService';

/**
 * Hook to get a module-specific audit logger
 * 
 * @example
 * ```tsx
 * const { audit } = useAudit('beneficiaries');
 * 
 * // Log a create action
 * audit.create('123', 'beneficiary', 'إضافة مستفيد جديد: محمد أحمد');
 * 
 * // Log an update
 * audit.update('123', 'beneficiary', 'تحديث بيانات المستفيد', oldData, newData);
 * ```
 */
export function useAudit(module: AuditModule) {
    const { currentUser } = useUser();

    const auditLogger = useMemo(() => {
        return createAuditLogger(module, {
            userId: currentUser.id,
            userName: currentUser.name,
            userRole: currentUser.role,
        });
    }, [module, currentUser.id, currentUser.name, currentUser.role]);

    // Custom log function for special cases
    const log = useCallback(
        (action: AuditAction, description: string, options?: {
            resourceId?: string;
            resourceType?: string;
            previousValue?: any;
            newValue?: any;
            success?: boolean;
            errorMessage?: string;
        }) => {
            return logAuditEvent({
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                action,
                module,
                description,
                resourceId: options?.resourceId,
                resourceType: options?.resourceType,
                previousValue: options?.previousValue,
                newValue: options?.newValue,
                success: options?.success ?? true,
                errorMessage: options?.errorMessage,
            });
        },
        [module, currentUser.id, currentUser.name, currentUser.role]
    );

    return {
        audit: auditLogger,
        log,
        user: {
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
        },
    };
}

export default useAudit;
