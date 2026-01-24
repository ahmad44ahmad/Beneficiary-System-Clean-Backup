import React from 'react';
import { Card } from '../../components/ui/Card';

interface MealScheduleProps {
    preview?: boolean;
}

export const MealSchedule: React.FC<MealScheduleProps> = ({ preview }) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const meals = [
        { day: 'الأحد', breakfast: 'فول + تميس + جبن', lunch: 'كبسة دجاج + سلطة + لبن', dinner: 'بيض مسلوق + خضار + خبز' },
        { day: 'الاثنين', breakfast: 'شكشوكة + خبز + زيتون', lunch: 'إيدام خضار + أرز أبيض + دجاج', dinner: 'مكرونة بالبشاميل + عصير' },
        { day: 'الثلاثاء', breakfast: 'أجبان متنوعة + مربى + خبز', lunch: 'سمك فيليه + أرز صيادية', dinner: 'ساندوتشات متنوعة + حليب' },
        { day: 'الأربعاء', breakfast: 'عدس + خبز + طحينة', lunch: 'جريش + لحم + سلطة حارة', dinner: 'شوربة شوفان + فطائر' },
        { day: 'الخميس', breakfast: 'كبدة + خبز + عصير', lunch: 'برياني دجاج + سلطة زبادي', dinner: 'بيتزا + بطاطس' },
        { day: 'الجمعة', breakfast: 'نواشف + بيض مقلي', lunch: 'سليق طائفي + دجاج محمر', dinner: 'فواكه مشكلة + زبادي' },
        { day: 'السبت', breakfast: 'فول + زيت زيتون + خبز', lunch: 'مقلوبة خضار + لحم', dinner: 'برجر منزلي + عصير' },
    ];

    const displayMeals = preview ? meals.slice(0, 3) : meals;

    return (
        <Card title="جدول الوجبات الأسبوعي" className="h-full">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-4 py-3 text-right">اليوم</th>
                            <th className="px-4 py-3 text-right">الإفطار</th>
                            <th className="px-4 py-3 text-right">الغداء</th>
                            <th className="px-4 py-3 text-right">العشاء</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {displayMeals.map((meal, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{meal.day}</td>
                                <td className="px-4 py-3 text-gray-600">{meal.breakfast}</td>
                                <td className="px-4 py-3 text-gray-600">{meal.lunch}</td>
                                <td className="px-4 py-3 text-gray-600">{meal.dinner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {preview && (
                <div className="mt-4 text-center">
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">عرض الجدول الكامل</span>
                </div>
            )}
        </Card>
    );
};
