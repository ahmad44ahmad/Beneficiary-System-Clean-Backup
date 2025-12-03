
import React, { useState } from 'react';
import { useBeneficiaries, useBeneficiaryMutations } from '../../hooks/useDatabase';
import { Beneficiary } from '../../types';

export const BeneficiaryManagementExample: React.FC = () => {
    const { beneficiaries, loading, error } = useBeneficiaries();
    const { create, update, remove } = useBeneficiaryMutations();
    const [newBeneficiaryName, setNewBeneficiaryName] = useState('');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading beneficiaries</div>;

    const handleCreate = async () => {
        try {
            await create({
                fullName: newBeneficiaryName,
                status: 'active',
                enrollmentDate: new Date().toISOString().split('T')[0],
                gender: 'male' // Default for this example
            });
            setNewBeneficiaryName('');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Beneficiary Management</h1>

            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    value={newBeneficiaryName}
                    onChange={(e) => setNewBeneficiaryName(e.target.value)}
                    placeholder="New Beneficiary Name"
                    className="border p-2 rounded"
                />
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Beneficiary
                </button>
            </div>

            <div className="grid gap-4">
                {beneficiaries.map((b: Beneficiary) => (
                    <div key={b.id} className="border p-4 rounded shadow flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{b.fullName}</h3>
                            <p className="text-sm text-gray-600">Status: {b.status}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => update({ id: b.id, data: { status: b.status === 'active' ? 'exit' : 'active' } })}
                                className="text-blue-500 hover:underline"
                            >
                                Toggle Status
                            </button>
                            <button
                                onClick={() => remove(b.id)}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
