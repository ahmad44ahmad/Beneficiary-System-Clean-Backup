import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <ShieldAlert className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">عذراً، ليس لديك صلاحية الوصول</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                هذه الصفحة مخصصة لمستويات إدارية أو تخصصية محددة. يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>العودة للصفحة السابقة</Button>
                <Button onClick={() => navigate('/dashboard')}>الذهاب للرئيسية</Button>
            </div>
        </div>
    );
};
