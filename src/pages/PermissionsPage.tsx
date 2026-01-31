import React, { useState } from 'react';
import { Shield, Users, Check, X, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    nameAr: string;
    color: string;
    permissions: Record<string, boolean>;
}

const PERMISSIONS = [
    { key: 'view_beneficiaries', label: 'عرض المستفيدين' },
    { key: 'edit_beneficiaries', label: 'تعديل المستفيدين' },
    { key: 'view_medical', label: 'عرض السجلات الطبية' },
    { key: 'edit_medical', label: 'تعديل السجلات الطبية' },
    { key: 'view_reports', label: 'عرض التقارير' },
    { key: 'manage_users', label: 'إدارة المستخدمين' },
    { key: 'manage_settings', label: 'إدارة الإعدادات' },
];

const INITIAL_ROLES: Role[] = [
    {
        id: '1',
        name: 'admin',
        nameAr: 'مدير النظام',
        color: 'bg-red-500',
        permissions: { view_beneficiaries: true, edit_beneficiaries: true, view_medical: true, edit_medical: true, view_reports: true, manage_users: true, manage_settings: true }
    },
    {
        id: '2',
        name: 'director',
        nameAr: 'مدير المركز',
        color: 'bg-blue-500',
        permissions: { view_beneficiaries: true, edit_beneficiaries: true, view_medical: true, edit_medical: false, view_reports: true, manage_users: false, manage_settings: true }
    },
    {
        id: '3',
        name: 'nurse',
        nameAr: 'ممرض/ة',
        color: 'bg-green-500',
        permissions: { view_beneficiaries: true, edit_beneficiaries: false, view_medical: true, edit_medical: true, view_reports: false, manage_users: false, manage_settings: false }
    },
    {
        id: '4',
        name: 'social_worker',
        nameAr: 'أخصائي اجتماعي',
        color: 'bg-purple-500',
        permissions: { view_beneficiaries: true, edit_beneficiaries: true, view_medical: false, edit_medical: false, view_reports: true, manage_users: false, manage_settings: false }
    },
];

export const PermissionsPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const togglePermission = (roleId: string, permKey: string) => {
        setRoles(roles.map(role => {
            if (role.id === roleId) {
                return {
                    ...role,
                    permissions: {
                        ...role.permissions,
                        [permKey]: !role.permissions[permKey]
                    }
                };
            }
            return role;
        }));
    };

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#14415A] flex items-center gap-3">
                    <Shield className="w-7 h-7 text-[#148287]" />
                    إدارة الصلاحيات
                </h1>
                <p className="text-gray-500 mt-1">تحديد صلاحيات الوصول لكل دور</p>
            </div>

            {/* Roles Overview */}
            <div className="grid grid-cols-4 gap-4">
                {roles.map(role => (
                    <div
                        key={role.id}
                        className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all ${selectedRole === role.id ? 'ring-2 ring-[#148287]' : 'hover:shadow-xl'
                            }`}
                        onClick={() => setSelectedRole(selectedRole === role.id ? null : role.id)}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 ${role.color} rounded-xl flex items-center justify-center`}>
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{role.nameAr}</p>
                                <p className="text-xs text-gray-500">{role.name}</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            {Object.values(role.permissions).filter(Boolean).length} / {PERMISSIONS.length} صلاحيات
                        </div>
                    </div>
                ))}
            </div>

            {/* Permissions Matrix */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#14415A] text-white">
                        <tr>
                            <th className="p-4 text-right">الصلاحية</th>
                            {roles.map(role => (
                                <th key={role.id} className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs ${role.color} text-white`}>
                                        {role.nameAr}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {PERMISSIONS.map(perm => (
                            <tr key={perm.key} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{perm.label}</td>
                                {roles.map(role => (
                                    <td key={role.id} className="p-4 text-center">
                                        <button
                                            onClick={() => togglePermission(role.id, perm.key)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${role.permissions[perm.key]
                                                    ? 'bg-[#2DB473] text-white'
                                                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                                }`}
                                        >
                                            {role.permissions[perm.key] ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PermissionsPage;
