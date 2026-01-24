import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'director' | 'doctor' | 'social_worker' | 'nurse' | 'admin' | 'specialist' | 'secretary';

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
    director: { id: 'u1', name: 'خالد بن مطر الزهراني (المدير)', role: 'director', avatar: 'https://i.pravatar.cc/150?u=director' },
    doctor: { id: 'u2', name: 'د. محمد بلال (طبيب)', role: 'doctor', avatar: 'https://i.pravatar.cc/150?u=doctor' },
    social_worker: { id: 'u3', name: 'أ. سعيد بن علي الغامدي (أخصائي اجتماعي)', role: 'social_worker', avatar: 'https://i.pravatar.cc/150?u=social' },
    nurse: { id: 'u4', name: 'نايف بن عبدالله الغامدي (ممرض)', role: 'nurse', avatar: 'https://i.pravatar.cc/150?u=nurse' },
    admin: { id: 'u5', name: 'أحمد بن عبدالله الشهري', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
    specialist: { id: 'u6', name: 'أ. فهد (أخصائي)', role: 'specialist', avatar: 'https://i.pravatar.cc/150?u=specialist' },
    secretary: { id: 'u7', name: 'أ. سكرتير (سكرتارية)', role: 'secretary', avatar: 'https://i.pravatar.cc/150?u=secretary' },
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Demo Mode: Auto-login as Admin
    const isDemo = import.meta.env.VITE_APP_MODE === 'demo';
    const [currentUser, setCurrentUser] = useState<User>(isDemo ? MOCK_USERS.admin : MOCK_USERS.admin); // Defaulting to admin for now, but explicit for demo logic

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
