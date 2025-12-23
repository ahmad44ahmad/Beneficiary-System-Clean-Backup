
import React, { useState } from 'react';
import { PhysicalTherapyAssessment, SkeletalAlignment, RangeOfMotion, MotorFunction } from '../../../types/physicalTherapy';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Save, Plus, Trash2 } from 'lucide-react';

export const PTAssessmentForm: React.FC<{
    initialData?: Partial<PhysicalTherapyAssessment>;
    onSubmit: (data: PhysicalTherapyAssessment) => void;
}> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<PhysicalTherapyAssessment>>(initialData || {
        alignment: {
            headAndNeck: 'Normal', shoulders: 'Level', spine: 'Normal',
            pelvis: 'Level', knees: 'Normal', feet: 'Normal'
        },
        romChecks: [],
        muscleTone: { upperExtremities: 0, lowerExtremities: 0 },
        motorFunctions: {
            rolling: 'Independent', sitting: 'Independent', crawling: 'Independent',
            standing: 'Independent', walking: 'Independent', running: 'Normal', jumping: 'Normal'
        },
        goals: []
    });

    const handleAlignmentChange = (field: keyof SkeletalAlignment, value: string) => {
        setFormData(prev => ({
            ...prev,
            alignment: { ...prev.alignment!, [field]: value }
        }));
    };

    const handleMotorChange = (field: keyof MotorFunction, value: string) => {
        setFormData(prev => ({
            ...prev,
            motorFunctions: { ...prev.motorFunctions!, [field]: value }
        }));
    };

    const addGoal = () => {
        const goal = prompt("Enter new goal:");
        if (goal) {
            setFormData(prev => ({ ...prev, goals: [...(prev.goals || []), goal] }));
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Skeletal Alignment Section */}
            <Card title="Structural Alignment (Skeletal)">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectField label="Head & Neck" value={formData.alignment?.headAndNeck}
                        options={['Normal', 'Tilted', 'Rotated']}
                        onChange={(v) => handleAlignmentChange('headAndNeck', v)} />

                    <SelectField label="Spine" value={formData.alignment?.spine}
                        options={['Normal', 'Scoliosis', 'Kyphosis', 'Lordosis']}
                        onChange={(v) => handleAlignmentChange('spine', v)} />

                    <SelectField label="Shoulders" value={formData.alignment?.shoulders}
                        options={['Level', 'Uneven', 'Protracted']}
                        onChange={(v) => handleAlignmentChange('shoulders', v)} />

                    <SelectField label="Pelvis" value={formData.alignment?.pelvis}
                        options={['Level', 'Tilted', 'Rotated']}
                        onChange={(v) => handleAlignmentChange('pelvis', v)} />

                    <SelectField label="Knees" value={formData.alignment?.knees}
                        options={['Normal', 'Valgus', 'Varus', 'Hyperextension']}
                        onChange={(v) => handleAlignmentChange('knees', v)} />

                    <SelectField label="Feet" value={formData.alignment?.feet}
                        options={['Normal', 'Flat', 'Club']}
                        onChange={(v) => handleAlignmentChange('feet', v)} />
                </div>
            </Card>

            {/* 2. Gross Motor Function */}
            <Card title="Gross Motor Function">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.keys(formData.motorFunctions || {}).map((key) => (
                        <SelectField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={(formData.motorFunctions as any)[key]}
                            options={['Independent', 'Assist', 'Dependent', 'Normal', 'Impaired', 'Unable']}
                            onChange={(v) => handleMotorChange(key as keyof MotorFunction, v)}
                        />
                    ))}
                </div>
            </Card>

            {/* 3. Treatment Goals */}
            <Card title="Treatment Plan">
                <div className="space-y-2">
                    {formData.goals?.map((goal, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span>{idx + 1}. {goal}</span>
                            <button onClick={() => setFormData(prev => ({ ...prev, goals: prev.goals?.filter((_, i) => i !== idx) }))}
                                className="text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    <Button onClick={addGoal} variant="outline" size="sm" className="w-full mt-2">
                        <Plus size={16} className="mr-2" /> Add Treatment Goal
                    </Button>
                </div>
            </Card>

            <div className="flex justify-end">
                <Button onClick={() => onSubmit(formData as PhysicalTherapyAssessment)}>
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
