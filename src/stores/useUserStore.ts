import { create } from 'zustand';

export type UserRole = 'director' | 'doctor' | 'social_worker' | 'nurse' | 'admin' | 'specialist' | 'secretary';

interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

const MOCK_USERS: Record<UserRole, User> = {
    director: { id: 'u1', name: 'خالد بن مطر الزهراني (المدير)', role: 'director' },
    doctor: { id: 'u2', name: 'د. محمد بلال (طبيب)', role: 'doctor' },
    social_worker: { id: 'u3', name: 'أ. سعيد بن علي الغامدي (أخصائي اجتماعي)', role: 'social_worker' },
    nurse: { id: 'u4', name: 'نايف بن عبدالله الغامدي (ممرض)', role: 'nurse' },
    admin: { id: 'u5', name: 'أحمد بن عبدالله الشهري', role: 'admin' },
    specialist: { id: 'u6', name: 'أ. فهد (أخصائي)', role: 'specialist' },
    secretary: { id: 'u7', name: 'أ. سكرتير (سكرتارية)', role: 'secretary' },
};

interface UserState {
    currentUser: User;
}

interface UserActions {
    switchRole: (role: UserRole) => void;
    hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
}

const isDemo = typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_MODE === 'demo';

export const useUserStore = create<UserState & UserActions>()((set, get) => ({
    currentUser: isDemo ? MOCK_USERS.admin : MOCK_USERS.admin,

    switchRole: (role) => set({ currentUser: MOCK_USERS[role] }),

    hasPermission: (requiredRole) => {
        const { currentUser } = get();
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(currentUser.role);
        }
        return currentUser.role === requiredRole;
    },
}));
