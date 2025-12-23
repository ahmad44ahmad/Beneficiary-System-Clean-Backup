import React, { useState } from 'react';
import { SpeechAssessment, ArticulationScore, SwallowingStatus } from '../../../types/speechTherapy';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Save } from 'lucide-react';

export const SpeechAssessmentForm: React.FC<{
    initialData?: Partial<SpeechAssessment>;
    onSubmit: (data: SpeechAssessment) => void;
}> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<SpeechAssessment>>(initialData || {
        receptiveLanguageAge: '',
        expressiveLanguageAge: '',
        articulationErrors: [],
        intelligibility: 100,
        swallowing: {
            oralPhase: 'Normal', pharyngealPhase: 'Normal', esophagealPhase: 'Normal',
            aspirationRisk: false, dietTexture: 'Regular', liquidConsistency: 'Thin'
        },
        lips: 'Normal', tongue: 'Normal', palate: 'Normal', drooling: false,
        recommendations: []
    });

    const handleSwallowingChange = (field: keyof SwallowingStatus, value: any) => {
        setFormData(prev => ({
            ...prev,
            swallowing: { ...prev.swallowing!, [field]: value }
        }));
    };

    const handleSystemChange = (field: keyof SpeechAssessment, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Mock Phonemes for Articulation Grid
    const phonemes = ['b', 'p', 'm', 'n', 'd', 't', 'k', 'g', 'f', 'v', 's', 'z', 'sh', 'ch', 'j', 'l', 'r', 'th'];

    return (
        <div className="space-y-6">
            {/* 1. Language Development */}
            <Card title="Language & Communication Age">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Receptive Language Age</label>
                        <input type="text" value={formData.receptiveLanguageAge}
                            onChange={(e) => handleSystemChange('receptiveLanguageAge', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            placeholder="e.g. 3 years 6 months" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expressive Language Age</label>
                        <input type="text" value={formData.expressiveLanguageAge}
                            onChange={(e) => handleSystemChange('expressiveLanguageAge', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            placeholder="e.g. 2 years" />
                    </div>
                </div>
            </Card>

            {/* 2. Orofacial Exam */}
            <Card title="Orofacial Examination">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <SelectField label="Lips" value={formData.lips} options={['Normal', 'Abnormal']}
                        onChange={(v: any) => handleSystemChange('lips', v)} />
                    <SelectField label="Tongue" value={formData.tongue} options={['Normal', 'Abnormal']}
                        onChange={(v: any) => handleSystemChange('tongue', v)} />
                    <SelectField label="Palate" value={formData.palate} options={['Normal', 'Abnormal']}
                        onChange={(v: any) => handleSystemChange('palate', v)} />
                    <div className="flex items-center mt-6">
                        <input type="checkbox" checked={formData.drooling}
                            onChange={(e) => handleSystemChange('drooling', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Drooling Present</label>
                    </div>
                </div>
            </Card>

            {/* 3. Swallowing Function */}
            <Card title="Swallowing & Feeding">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <SelectField label="Oral Phase" value={formData.swallowing?.oralPhase} options={['Normal', 'Impaired']}
                        onChange={(v: any) => handleSwallowingChange('oralPhase', v)} />
                    <SelectField label="Pharyngeal Phase" value={formData.swallowing?.pharyngealPhase} options={['Normal', 'Impaired']}
                        onChange={(v: any) => handleSwallowingChange('pharyngealPhase', v)} />
                    <SelectField label="Esophageal Phase" value={formData.swallowing?.esophagealPhase} options={['Normal', 'Impaired']}
                        onChange={(v: any) => handleSwallowingChange('esophagealPhase', v)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField label="Diet Texture" value={formData.swallowing?.dietTexture} options={['Regular', 'Soft', 'Minced', 'Pureed']}
                        onChange={(v: any) => handleSwallowingChange('dietTexture', v)} />
                    <SelectField label="Liquid Consistency" value={formData.swallowing?.liquidConsistency} options={['Thin', 'Nectar', 'Honey', 'Pudding']}
                        onChange={(v: any) => handleSwallowingChange('liquidConsistency', v)} />
                </div>
            </Card>

            {/* 4. Articulation Grid (Simplified) */}
            <Card title="Articulation Screen (Selected Phonemes)">
                <div className="grid grid-cols-4 md:grid-cols-9 gap-2">
                    {phonemes.map(ph => (
                        <div key={ph} className="p-2 border rounded bg-gray-50 text-center">
                            <span className="font-bold block mb-1">/{ph}/</span>
                            <select className="text-xs p-1 w-full border rounded">
                                <option>✓</option>
                                <option>X</option>
                                <option>Sub</option>
                            </select>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex justify-end">
                <Button onClick={() => onSubmit(formData as SpeechAssessment)}>
                    <Save className="mr-2 h-4 w-4" /> Save Assessment
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
