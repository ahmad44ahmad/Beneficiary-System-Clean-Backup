import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser, UserRole } from '../context/UserContext';
import { AccessDenied } from './ui/AccessDenied';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { currentUser } = useUser();

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <AccessDenied />;
    }

    return <>{children}</>;
};
