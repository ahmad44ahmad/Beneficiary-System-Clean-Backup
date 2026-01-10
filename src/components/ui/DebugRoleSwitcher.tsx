import React from 'react';
import { useUser, UserRole } from '../../context/UserContext';
import { Shield } from 'lucide-react';

export const DebugRoleSwitcher: React.FC = () => {
    const { currentUser, switchRole } = useUser();

    if (!import.meta.env.DEV) return null;

    return (
        <div className="fixed bottom-28 right-4 z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                <Shield className="w-3 h-3" />
                Debug: Role Switcher
            </div>
            <div className="flex gap-1">
                {(['director', 'doctor', 'social_worker', 'nurse', 'admin'] as UserRole[]).map(role => (
                    <button
                        key={role}
                        onClick={() => switchRole(role)}
                        className={`px-2 py-1 text-xs rounded border ${currentUser.role === role
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                            }`}
                        title={`Switch to ${role}`}
                    >
                        {role === 'social_worker' ? 'Social' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                ))}
            </div>
            <div className="mt-2 text-[10px] text-gray-500 text-center">
                Current: <span className="text-white font-bold">{currentUser.name}</span>
            </div>
        </div>
    );
};
