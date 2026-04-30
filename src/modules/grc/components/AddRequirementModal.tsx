import React, { useState } from 'react';
import { supabase } from '../../../config/supabase';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Save, AlertCircle } from 'lucide-react';

interface AddRequirementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddRequirementModal: React.FC<AddRequirementModalProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        requirement_code: '',
        title_ar: '',
        description: '',
        section: '',
        responsible_person: '',
        compliance_status: 'pending',
        compliance_score: 0,
        due_date: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'compliance_score' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic Validation
            if (!formData.requirement_code || !formData.title_ar) {
                throw new Error('يرجى تعبئة الحقول الإلزامية (الكود والعنوان)');
            }

            const { error: supabaseError } = await supabase
                .from('grc_compliance_requirements')
                .insert([
                    {
                        ...formData,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]);

            if (supabaseError) throw supabaseError;

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                requirement_code: '',
                title_ar: '',
                description: '',
                section: '',
                responsible_person: '',
                compliance_status: 'pending',
                compliance_score: 0,
                due_date: ''
            });

        } catch (err: any) {
            console.error('Error adding requirement:', err);
            setError(err.message || 'حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="إضافة متطلب امتثال جديد"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                {error && (
                    <div className="bg-[#DC2626]/10 text-[#DC2626] p-3 rounded-md text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="كود المتطلب *"
                        name="requirement_code"
                        value={formData.requirement_code}
                        onChange={handleChange}
                        placeholder="مثال: MOH-001"
                        required
                    />
                    <Input
                        label="العنوان (بالعربية) *"
                        name="title_ar"
                        value={formData.title_ar}
                        onChange={handleChange}
                        placeholder="مثال: تجديد ترخيص..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        الوصف التفصيلي
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                        placeholder="شرح المتطلب..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="القسم / المجال"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        placeholder="مثال: الصيانة، الموارد البشرية"
                    />
                    <Input
                        label="المسؤول المباشر"
                        name="responsible_person"
                        value={formData.responsible_person}
                        onChange={handleChange}
                        placeholder="اسم الموظف المسؤول"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            حالة الامتثال
                        </label>
                        <select
                            name="compliance_status"
                            id="compliance_status"
                            aria-label="حالة الامتثال"
                            value={formData.compliance_status}
                            onChange={handleChange}
                            className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                        >
                            <option value="pending">قيد المراجعة</option>
                            <option value="compliant">ممتثل</option>
                            <option value="partial">جزئي</option>
                            <option value="non_compliant">غير ممتثل</option>
                            <option value="not_applicable">لا ينطبق</option>
                        </select>
                    </div>

                    <Input
                        label="درجة الامتثال (%)"
                        type="number"
                        min="0"
                        max="100"
                        name="compliance_score"
                        value={formData.compliance_score}
                        onChange={handleChange}
                    />

                    <Input
                        label="تاريخ الاستحقاق"
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-[#269798] hover:bg-[#0e5c60] text-white"
                    >
                        {loading ? 'جاري الحفظ...' : (
                            <>
                                <Save className="w-4 h-4 ml-2" />
                                حفظ المتطلب
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
