import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'director' | 'doctor' | 'social_worker' | 'nurse' | 'admin';

interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

interface UserContextType {
    currentUser: User;
    switchRole: (role: UserRole) => void;
    hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User> = {
    director: { id: 'u1', name: 'د. عبدالله (المدير)', role: 'director', avatar: 'https://i.pravatar.cc/150?u=director' },
    doctor: { id: 'u2', name: 'د. محمد (طبيب)', role: 'doctor', avatar: 'https://i.pravatar.cc/150?u=doctor' },
    social_worker: { id: 'u3', name: 'أ. علي (أخصائي اجتماعي)', role: 'social_worker', avatar: 'https://i.pravatar.cc/150?u=social' },
    nurse: { id: 'u4', name: 'سعيد (ممرض)', role: 'nurse', avatar: 'https://i.pravatar.cc/150?u=nurse' },
    admin: { id: 'u5', name: 'أحمد بن عبدالله الشهري', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.admin);

    const switchRole = (role: UserRole) => {
        setCurrentUser(MOCK_USERS[role]);
    };

    const hasPermission = (requiredRole: UserRole | UserRole[]) => {
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(currentUser.role);
        }
        return currentUser.role === requiredRole;
    };

    return (
        <UserContext.Provider value={{ currentUser, switchRole, hasPermission }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
