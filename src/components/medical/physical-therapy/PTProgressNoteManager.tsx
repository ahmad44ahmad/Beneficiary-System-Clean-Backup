import React, { useState } from 'react';
import { PTProgressNote } from '../../../types/physicalTherapy';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

export const PTProgressNoteManager: React.FC<{
    notes: PTProgressNote[];
    onAddNote: (note: PTProgressNote) => void;
}> = ({ notes, onAddNote }) => {
    const [newNote, setNewNote] = useState<Partial<PTProgressNote>>({
        sessionType: 'Individual',
        response: 'Cooperative',
        activities: []
    });

    const handleSubmit = () => {
        if (!newNote.notes) return;

        // In a real app, generate ID and attach user info
        onAddNote({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            therapistName: 'Current User',
            ...newNote
        } as PTProgressNote);

        setNewNote({ sessionType: 'Individual', response: 'Cooperative', activities: [], notes: '' });
    };

    return (
        <div className="space-y-6">
            {/* Input Form */}
            <Card title="New Progress Note">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Session Type</label>
                        <select
                            value={newNote.sessionType}
                            onChange={(e) => setNewNote(prev => ({ ...prev, sessionType: e.target.value as any }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        >
                            <option value="Individual">Individual</option>
                            <option value="Group">Group</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Patient Response</label>
                        <select
                            value={newNote.response}
                            onChange={(e) => setNewNote(prev => ({ ...prev, response: e.target.value as any }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        >
                            <option value="Cooperative">Cooperative</option>
                            <option value="Resistant">Resistant</option>
                            <option value="Passive">Passive</option>
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Clinical Notes</label>
                    <textarea
                        value={newNote.notes || ''}
                        onChange={(e) => setNewNote(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        rows={3}
                        placeholder="Describe interventions and progress..."
                    />
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={!newNote.notes}>
                        Add Note
                    </Button>
                </div>
            </Card>

            {/* History List */}
            <div className="space-y-4">
                {notes.slice().reverse().map((note) => (
                    <div key={note.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-bold text-gray-900">{new Date(note.date).toLocaleDateString()}</span>
                                <span className="ml-2 text-sm text-gray-500">{new Date(note.date).toLocaleTimeString()}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium 
                        ${note.response === 'Cooperative' ? 'bg-green-100 text-green-800' :
                                    note.response === 'Resistant' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {note.response}
                            </span>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">{note.notes}</div>
                        <div className="mt-2 text-sm text-gray-500">
                            <span className="font-medium">Therapist:</span> {note.therapistName} |
                            <span className="font-medium ml-2">Type:</span> {note.sessionType}
                        </div>
                    </div>
                ))}
                {notes.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No progress notes recorded yet.</div>
                )}
            </div>
        </div>
    );
};
