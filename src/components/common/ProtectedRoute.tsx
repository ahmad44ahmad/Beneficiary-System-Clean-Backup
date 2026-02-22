import React from 'react';
import { useUserStore, UserRole } from '../../stores/useUserStore';
import { AccessDenied } from '../ui/AccessDenied';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { currentUser } = useUserStore();

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <AccessDenied />;
    }

    return <>{children}</>;
};
