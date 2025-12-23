import React, { useState } from 'react';
import { DentalAssessment, ToothStatus } from '../../../types/dental';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Save } from 'lucide-react';

export const DentalOdontogram: React.FC<{
    initialData?: Partial<DentalAssessment>;
    onSubmit: (data: DentalAssessment) => void;
}> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<DentalAssessment>>(initialData || {
        teeth: Array.from({ length: 32 }, (_, i) => ({ number: i + 1, status: 'Healthy' })),
        gumHealth: 'Healthy',
        plaqueIndex: 'Low',
        calculusIndex: 'Low',
        recommendations: []
    });

    const handleToothClick = (toothNum: number) => {
        // Cycle statuses: Healthy -> Decayed -> Missing -> Filled -> Crown -> Healthy
        const statuses = ['Healthy', 'Decayed', 'Missing', 'Filled', 'Crown', 'Healthy'];
        setFormData(prev => {
            const teeth = [...(prev.teeth || [])];
            const toothIndex = teeth.findIndex(t => t.number === toothNum);
            const currentStatus = teeth[toothIndex].status;
            const nextStatus = statuses[statuses.indexOf(currentStatus) + 1] as any;
            teeth[toothIndex] = { ...teeth[toothIndex], status: nextStatus };
            return { ...prev, teeth };
        });
    };

    const getToothColor = (status: string) => {
        switch (status) {
            case 'Decayed': return 'bg-red-500';
            case 'Missing': return 'bg-gray-800';
            case 'Filled': return 'bg-blue-500';
            case 'Crown': return 'bg-yellow-500';
            default: return 'bg-white border-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Odontogram Visualization */}
            <Card title="Dental Chart (Interactive)">
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-sm text-gray-500 mb-2">Click on a tooth to cycle status (Healthy, Decayed, Missing, Filled, Crown)</p>

                    {/* Upper Jaw */}
                    <div className="flex space-x-1">
                        {formData.teeth?.slice(0, 16).map(tooth => (
                            <button key={tooth.number}
                                onClick={() => handleToothClick(tooth.number)}
                                className={`w-8 h-12 border rounded-t-lg flex items-center justify-center text-xs font-bold ${getToothColor(tooth.status)} ${tooth.status === 'Healthy' ? 'text-gray-700' : 'text-white'}`}>
                                {tooth.number}
                            </button>
                        ))}
                    </div>
                    {/* Lower Jaw */}
                    <div className="flex space-x-1">
                        {formData.teeth?.slice(16, 32).reverse().map(tooth => (
                            <button key={tooth.number}
                                onClick={() => handleToothClick(tooth.number)}
                                className={`w-8 h-12 border rounded-b-lg flex items-center justify-center text-xs font-bold ${getToothColor(tooth.status)} ${tooth.status === 'Healthy' ? 'text-gray-700' : 'text-white'}`}>
                                {tooth.number}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-4 text-sm">
                        <span className="flex items-center"><div className="w-3 h-3 bg-red-500 mr-1"></div> Decayed</span>
                        <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 mr-1"></div> Filled</span>
                        <span className="flex items-center"><div className="w-3 h-3 bg-yellow-500 mr-1"></div> Crown</span>
                        <span className="flex items-center"><div className="w-3 h-3 bg-gray-800 mr-1"></div> Missing</span>
                    </div>
                </div>
            </Card>

            {/* 2. Periodontal & Hygiene */}
            <Card title="Periodontal & Hygiene Status">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField label="Gum Health" value={formData.gumHealth}
                        options={['Healthy', 'Gingivitis', 'Periodontitis']}
                        onChange={(v: any) => setFormData(prev => ({ ...prev, gumHealth: v }))} />

                    <SelectField label="Plaque Index" value={formData.plaqueIndex}
                        options={['Low', 'Moderate', 'Heavy']}
                        onChange={(v: any) => setFormData(prev => ({ ...prev, plaqueIndex: v }))} />

                    <SelectField label="Calculus Index" value={formData.calculusIndex}
                        options={['Low', 'Moderate', 'Heavy']}
                        onChange={(v: any) => setFormData(prev => ({ ...prev, calculusIndex: v }))} />
                </div>
            </Card>

            <div className="flex justify-end">
                <Button onClick={() => onSubmit(formData as DentalAssessment)}>
                    <Save className="mr-2 h-4 w-4" /> Save Dental Chart
                </Button>
            </div>
        </div>
    );
};

const SelectField = ({ label, value, options, onChange }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
            {options.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);
