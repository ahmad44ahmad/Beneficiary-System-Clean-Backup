
import React, { useState } from 'react';
import { PsychologyAssessment, MentalStatusExam, IQTestResult } from '../../../types/psychology';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Save } from 'lucide-react';

export const PsychProfileForm: React.FC<{
    initialData?: Partial<PsychologyAssessment>;
    onSubmit: (data: PsychologyAssessment) => void;
}> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<PsychologyAssessment>>(initialData || {
        mentalStatus: {
            appearance: '', behavior: 'Cooperative', mood: 'Euthymic', affect: 'Congruent',
            thoughtProcess: 'Linear', perceptualDisturbances: false,
            cognition: { orientation: 10, memory: '', attention: '' }
        },
        iqTests: [],
        behavioralIssues: [],
        treatmentPlan: { goals: [], interventions: [] }
    });

    const handleMSEChange = (field: keyof MentalStatusExam, value: any) => {
        setFormData(prev => ({
            ...prev,
            mentalStatus: { ...prev.mentalStatus!, [field]: value }
        }));
    };

    return (
        <div className="space-y-6">
            {/* 1. Mental Status Exam */}
            <Card title="Mental Status Examination">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Appearance</label>
                        <textarea
                            value={formData.mentalStatus?.appearance}
                            onChange={(e) => handleMSEChange('appearance', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            placeholder="General appearance, grooming, dress..."
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Behavior</label>
                        <select value={formData.mentalStatus?.behavior}
                            onChange={(e) => handleMSEChange('behavior', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2">
                            {['Cooperative', 'Agitated', 'Withdrawn', 'Aggressive'].map(o => <option key={o}>{o}</option>)}
                        </select>
                    </div>

                    <SelectField label="Mood" value={formData.mentalStatus?.mood} options={['Euthymic', 'Depressed', 'Anxious', 'Euphoric']}
                        onChange={(v: any) => handleMSEChange('mood', v)} />

                    <SelectField label="Affect" value={formData.mentalStatus?.affect} options={['Congruent', 'Flat', 'Labile']}
                        onChange={(v: any) => handleMSEChange('affect', v)} />

                    <SelectField label="Thought Process" value={formData.mentalStatus?.thoughtProcess} options={['Linear', 'Tangential', 'Flight of Ideas']}
                        onChange={(v: any) => handleMSEChange('thoughtProcess', v)} />

                    <div className="flex items-center mt-6">
                        <input type="checkbox" checked={formData.mentalStatus?.perceptualDisturbances}
                            onChange={(e) => handleMSEChange('perceptualDisturbances', e.target.checked)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        <label className="ml-2 block text-sm text-gray-900">Perceptual Disturbances (Hallucinations)</label>
                    </div>
                </div>
            </Card>

            {/* 2. IQ & Cognition */}
            <Card title="Cognition & IQ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Orientation Score (/10)</label>
                        <input type="number"
                            value={formData.mentalStatus?.cognition.orientation}
                            onChange={(e) => setFormData(prev => ({ ...prev, mentalStatus: { ...prev.mentalStatus!, cognition: { ...prev.mentalStatus!.cognition, orientation: parseInt(e.target.value) } } }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                        <input type="text" value={formData.diagnosis || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            placeholder="e.g. Moderate Intellectual Disability (F71)"
                        />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button onClick={() => onSubmit(formData as PsychologyAssessment)}>
                    <Save className="mr-2 h-4 w-4" /> Save Psychological Profile
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
