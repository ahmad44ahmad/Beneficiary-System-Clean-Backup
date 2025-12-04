import React, { useState } from 'react';
import { EmpowermentProfile, EmpowermentGoal } from '../../types/unified';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
    Target,
    Zap,
    BookOpen,
    Briefcase,
    Smile,
    ArrowRight,
    Check,
    Lightbulb
} from 'lucide-react';

interface EmpowermentPlanBuilderProps {
    initialProfile?: EmpowermentProfile;
    onSave: (profile: EmpowermentProfile) => void;
}

export const EmpowermentPlanBuilder: React.FC<EmpowermentPlanBuilderProps> = ({ initialProfile, onSave }) => {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState<Partial<EmpowermentProfile>>(initialProfile || {
        readinessLevel: 'preparation',
        strengths: [],
        aspirations: [],
        hobbies: [],
        skills: [],
        goals: [],
        currentTracks: []
    });

    const [newStrength, setNewStrength] = useState('');
    const [newAspiration, setNewAspiration] = useState('');

    const handleAddStrength = () => {
        if (newStrength.trim()) {
            setProfile(prev => ({ ...prev, strengths: [...(prev.strengths || []), newStrength.trim()] }));
            setNewStrength('');
        }
    };

    const handleAddAspiration = () => {
        if (newAspiration.trim()) {
            setProfile(prev => ({ ...prev, aspirations: [...(prev.aspirations || []), newAspiration.trim()] }));
            setNewAspiration('');
        }
    };

    const suggestedTracks = [
        { name: 'Graphic Design', icon: '🎨', match: 'Creative' },
        { name: 'Computer Maintenance', icon: '💻', match: 'Technical' },
        { name: 'Culinary Arts', icon: '🍳', match: 'Hands-on' },
        { name: 'Gardening', icon: '🌱', match: 'Nature' }
    ];

    const renderStep1_Discovery = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Let's Discover Your Potential</h3>
                <p className="text-gray-500">What are you good at? What do you love doing?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border-blue-100 bg-blue-50/50">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> My Strengths
                    </h4>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            placeholder="e.g., Patient, Creative..."
                            value={newStrength}
                            onChange={(e) => setNewStrength(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddStrength()}
                        />
                        <Button size="sm" onClick={handleAddStrength}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.strengths?.map((s, i) => (
                            <span key={i} className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm border border-blue-100 flex items-center gap-1">
                                {s} <button onClick={() => setProfile(prev => ({ ...prev, strengths: prev.strengths?.filter((_, idx) => idx !== i) }))} className="hover:text-red-500 ml-1">×</button>
                            </span>
                        ))}
                    </div>
                </Card>

                <Card className="p-4 border-purple-100 bg-purple-50/50">
                    <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" /> My Aspirations
                    </h4>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            className="flex-1 border rounded px-3 py-2 text-sm"
                            placeholder="e.g., Get a job, Learn to paint..."
                            value={newAspiration}
                            onChange={(e) => setNewAspiration(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddAspiration()}
                        />
                        <Button size="sm" onClick={handleAddAspiration}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {profile.aspirations?.map((s, i) => (
                            <span key={i} className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm shadow-sm border border-purple-100 flex items-center gap-1">
                                {s} <button onClick={() => setProfile(prev => ({ ...prev, aspirations: prev.aspirations?.filter((_, idx) => idx !== i) }))} className="hover:text-red-500 ml-1">×</button>
                            </span>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderStep2_Pathways = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">Recommended Pathways</h3>
                <p className="text-gray-500">Based on your strengths, here are some exciting paths for you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedTracks.map((track) => (
                    <div key={track.name} className="border rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{track.icon}</span>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{track.name}</h4>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Match: {track.match}</span>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-50 flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep3_Goals = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Set Your First Goal</h3>
                <p className="text-gray-500">Let's make it SMART (Specific, Measurable, Achievable...)</p>
            </div>

            <Card className="p-6 max-w-lg mx-auto border-green-100 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                        <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="e.g., Complete Basic Computer Course" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                            <input type="date" className="w-full border rounded-lg px-4 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="w-full border rounded-lg px-4 py-2">
                                <option>Skill Development</option>
                                <option>Employment</option>
                                <option>Education</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden max-w-4xl mx-auto my-8">
            {/* Wizard Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    Empowerment Plan Builder
                </h2>
                <p className="text-blue-100 mt-1">Building a future based on ability, not disability.</p>

                {/* Progress Steps */}
                <div className="flex items-center mt-6 gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i ? 'bg-white text-blue-600' : 'bg-blue-800/50 text-blue-200'}`}>
                                {step > i ? <Check className="w-5 h-5" /> : i}
                            </div>
                            {i < 3 && <div className={`w-12 h-1 bg-blue-800/50 mx-2 ${step > i ? 'bg-white/50' : ''}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Wizard Content */}
            <div className="p-8 min-h-[400px]">
                {step === 1 && renderStep1_Discovery()}
                {step === 2 && renderStep2_Pathways()}
                {step === 3 && renderStep3_Goals()}
            </div>

            {/* Wizard Footer */}
            <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                >
                    Back
                </Button>

                {step < 3 ? (
                    <Button onClick={() => setStep(s => Math.min(3, s + 1))}>
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button onClick={() => onSave(profile as EmpowermentProfile)} className="bg-green-600 hover:bg-green-700 text-white">
                        Finish & Save Plan <Check className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
};
